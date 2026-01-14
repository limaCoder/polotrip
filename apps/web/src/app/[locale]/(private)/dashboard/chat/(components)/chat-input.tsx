'use client'

import { Send } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ChatInputProps = {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Ask about your albums, photos, or trips..."
        className="min-h-[60px] resize-none"
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as any)
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim()}
        className="h-[60px] w-[60px] flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
