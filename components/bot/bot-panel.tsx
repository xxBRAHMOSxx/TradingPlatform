'use client'

import * as React from 'react'
import { Bot, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface BotPanelProps {
  messages: ChatMessage[]
  onSend: (text: string) => void
  onClose: () => void
  /** show a "typing…" indicator */
  pending?: boolean
  className?: string
}

export function BotPanel({
  messages,
  onSend,
  onClose,
  pending = false,
  className,
}: BotPanelProps) {
  const [value, setValue] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // auto-scroll to bottom on new message
React.useEffect(() => {
  const el = scrollRef.current?.querySelector(
    '[data-radix-scroll-area-viewport]'
  ) as HTMLElement | null
  if (!el) return

  requestAnimationFrame(() => {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })
}, [messages, pending])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  return (
    <div
      role="dialog"
      aria-label="Chat with assistant"
      className={cn(
        'fixed bottom-24 right-4 z-50 flex h-[min(500px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Assistant</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 overflow-auto">
        <div className="flex flex-col gap-3 py-4 ">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Ask me anything to get started.
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
                m.role === 'user'
                  ? 'self-end bg-primary text-primary-foreground'
                  : 'self-start bg-muted text-foreground'
              )}
            >
              {m.content}
            </div>
          ))}
          {pending && (
            <div className="self-start rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
              <span className="animate-pulse">Typing…</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a message…"
          className="flex-1"
        />
        <Button type="submit" size="icon" aria-label="Send message" disabled={!value.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}