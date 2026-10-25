'use client'

import * as React from 'react'
import { BotComponent } from './Bot'
import { BotPanel, type ChatMessage } from './bot-panel'

export function BotLauncher() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [pending, setPending] = React.useState(false)

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }
    setMessages((prev) => [...prev, userMsg])
    setPending(true)

    try {
      // replace with your actual endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply ?? 'Sorry, I could not respond.',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Something went wrong.' },
      ])
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <BotPanel
          messages={messages}
          onSend={handleSend}
          onClose={() => setOpen(false)}
          pending={pending}
        />
      )}
      <BotComponent open={open} onClick={() => setOpen((o) => !o)} />
    </div>
  )
}