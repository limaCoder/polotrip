'use client'

import type { Message } from 'ai'
import { Bot, Loader2, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ChatPhotoDisplay } from './chat-photo-display'

type ChatMessageProps = {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  // Parse tool invocations from the message
  const toolInvocations = message.toolInvocations || []
  const hasToolResults = toolInvocations.some((tool: any) => tool.state === 'result')

  return (
    <div
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary">
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex flex-col gap-3',
          isUser ? 'max-w-[80%]' : 'max-w-[90%]'
        )}
      >
        {/* Text content */}
        {message.content && (
          <div
            className={cn(
              'rounded-lg px-4 py-2',
              isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {/* Tool invocations and results */}
        {!isUser && toolInvocations.length > 0 && (
          <div className="space-y-2">
            {toolInvocations.map((tool: any) => {
              // Show loading state for pending tools
              if (tool.state === 'call') {
                return (
                  <div
                    key={tool.toolCallId}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>
                      {tool.toolName === 'getUserAlbums' && 'Fetching your albums...'}
                      {tool.toolName === 'getAlbumPhotos' && 'Loading photos...'}
                      {tool.toolName === 'getTripStats' && 'Calculating statistics...'}
                      {tool.toolName === 'getPhotosByDate' && 'Searching photos by date...'}
                      {tool.toolName === 'getPhotosByLocation' && 'Finding photos by location...'}
                      {tool.toolName === 'getAlbumByName' && 'Searching albums...'}
                    </span>
                  </div>
                )
              }

              // Show result with visual display
              if (tool.state === 'result' && tool.result) {
                try {
                  // Parse the result (it comes as JSON string from MCP)
                  const data = typeof tool.result === 'string'
                    ? JSON.parse(tool.result)
                    : tool.result

                  return (
                    <div key={tool.toolCallId} className="mt-2">
                      <ChatPhotoDisplay data={data} />
                    </div>
                  )
                } catch (error) {
                  // If parsing fails, don't show anything
                  // The AI will explain the results in text
                  console.error('Failed to parse tool result:', error)
                  return null
                }
              }

              return null
            })}
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
