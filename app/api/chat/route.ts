import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// --- Type definitions ---
type ChatRole = 'user' | 'assistant'

interface IncomingMessage {
  id?: string
  role: ChatRole
  content: string
}

// The new Interactions API step structure
interface InteractionStep {
  type: 'user_input' | 'model_output'
  content: Array<{ type: 'text'; text: string }>
}

export async function POST(req: Request) {
  try {
    const body: { messages?: IncomingMessage[] } = await req.json()
    const messages = body.messages

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    // Convert history to the steps format required by the Interactions API
    const history: InteractionStep[] = messages.slice(0, -1).map((m) => ({
      type: m.role === 'user' ? 'user_input' : 'model_output',
      content: [{ type: 'text', text: m.content }],
    }))

    const last = messages[messages.length - 1]

    const interaction = await ai.interactions.create({
      model: 'gemini-3.6-flash', // or gemini-3.8-flash, whichever you're using
      store: false,
      input: [
        ...history,
        { type: 'user_input', content: [{ type: 'text', text: last.content }] },
      ],
    })

    const reply = interaction.output_text

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}