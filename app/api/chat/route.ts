import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const last = messages?.[messages.length - 1]?.content ?? ''

  // Replace with real LLM / logic
  return NextResponse.json({
    reply: `You said: "${last}". This is a placeholder response.`,
  })
}