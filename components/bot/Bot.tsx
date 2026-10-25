'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Bot, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const botVariants = cva(
  'relative inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-14 w-14',
        sm: 'h-10 w-10',
        lg: 'h-16 w-16',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BotProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof botVariants> {
  /** Whether the chat panel is open — toggles the icon */
  open?: boolean
  /** Icon size class, defaults to h-1/2 w-1/2 of the button */
  iconClassName?: string
}

const BotComponent = React.forwardRef<HTMLButtonElement, BotProps>(
  ({ className, variant, size, open = false, iconClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className={cn(botVariants({ variant, size }), className)}
        {...props}
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        <span
          className="absolute inset-0 rounded-full bg-primary/30 animate-ping"
          style={{ animationDelay: '0.5s' }}
        />
        {/* Icon */}
        {open ? (
          <X className={cn('relative h-1/2 w-1/2', iconClassName)} />
        ) : (
          <Bot className={cn('relative h-1/2 w-1/2', iconClassName)} />
        )}
      </button>
    )
  }
)
BotComponent.displayName = 'BotComponent'

export { BotComponent, botVariants }