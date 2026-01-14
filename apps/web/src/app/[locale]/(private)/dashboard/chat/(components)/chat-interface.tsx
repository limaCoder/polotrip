'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { env } from '@/lib/env'
import { ChatInput } from './chat-input'
import { ChatMessage } from './chat-message'

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: `${env.NEXT_PUBLIC_API_URL}/api/v1/chat`,
      credentials: 'include',
      onError: (error) => {
        console.error('Chat error:', error)
      },
    })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] border rounded-lg bg-card">
      <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">
                Ask me about your albums, photos, or trip statistics!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-pulse">●</div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            Error: {error.message}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
