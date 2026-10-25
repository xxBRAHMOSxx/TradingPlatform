import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    // Convert frontend messages to the step format required by the Interactions API
    const history: any[] = []
    for (const m of messages.slice(0, -1)) {
      history.push({
        type: m.role === 'user' ? 'user_input' : 'model_output',
        content: [{ type: 'text', text: m.content }],
      })
    }

    const last = messages[messages.length - 1]

    // The new API uses input to receive the full history, with store: false for stateless mode
    const interaction = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      store: false,
      input: [
        ...history,
        { type: 'user_input', content: [{ type: 'text', text: last.content }] },
      ],
    })

    // The new API extracts text via output_text
    const reply = interaction.output_text

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}