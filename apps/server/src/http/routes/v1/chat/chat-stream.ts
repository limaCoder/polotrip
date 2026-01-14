import { fromNodeHeaders } from 'better-auth/node'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createChatCompletion } from '@/app/functions/create-chat-completion'
import { BadRequestError, UnauthorizedError } from '@/http/errors'
import { authenticate } from '@/http/middlewares/authenticate'

// Validation schema with strict limits
const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message too long (max 4000 characters)')
    .transform((content) => {
      // Sanitize content: trim whitespace and remove null bytes
      return content.trim().replace(/\0/g, '')
    }),
})

// Detect potential prompt injection attempts
function detectPromptInjection(message: string): boolean {
  const suspiciousPatterns = [
    /ignore\s+(previous|prior|all|above)\s+instructions?/i,
    /forget\s+(everything|all|previous|prior)/i,
    /you\s+are\s+now\s+/i,
    /new\s+instructions?:/i,
    /system\s*:\s*/i,
    /\[system\]/i,
    /pretend\s+(to\s+be|you\s+are)/i,
    /roleplay\s+as/i,
    /act\s+as\s+(a\s+)?(?!travel|photo|album)/i,
    /your\s+new\s+role/i,
    /disregard\s+/i,
    /override\s+/i,
    /<\|im_start\|>/i,
    /<\|im_end\|>/i,
    /\[INST\]/i,
    /\[\/INST\]/i,
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(message))
}

const chatStreamRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/chat',
    {
      onRequest: [authenticate],
      schema: {
        body: z.object({
          messages: z
            .array(messageSchema)
            .min(1, 'At least one message required')
            .max(50, 'Too many messages in conversation (max 50)'),
        }),
      },
    },
    async (request, reply) => {
      try {
        const session = await request.server.auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        })

        if (!session) {
          throw new UnauthorizedError()
        }

        const { messages } = request.body

        // Validate message count and detect injection attempts
        const userMessages = messages.filter((m) => m.role === 'user')
        if (userMessages.length === 0) {
          throw new BadRequestError('No user messages found')
        }

        // Check last user message for prompt injection
        const lastUserMessage = userMessages[userMessages.length - 1]
        if (detectPromptInjection(lastUserMessage.content)) {
          app.log.warn(
            `Potential prompt injection detected from user ${session.user.id}`
          )
          throw new BadRequestError(
            'Your message contains patterns that are not allowed. Please rephrase your question about travel albums.'
          )
        }

        // Limit total conversation length to prevent context overflow
        const totalLength = messages.reduce(
          (sum, m) => sum + m.content.length,
          0
        )
        if (totalLength > 50000) {
          throw new BadRequestError(
            'Conversation too long. Please start a new conversation.'
          )
        }

        const result = await createChatCompletion({
          userId: session.user.id,
          messages,
        })

        // Set headers for SSE streaming
        reply.raw.setHeader('Content-Type', 'text/event-stream')
        reply.raw.setHeader('Cache-Control', 'no-cache')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Access-Control-Allow-Origin', request.headers.origin || '*')
        reply.raw.setHeader('Access-Control-Allow-Credentials', 'true')

        // Stream the response using Vercel AI SDK's toDataStreamResponse
        const stream = result.toDataStreamResponse()

        // Pipe the stream to the response
        return reply.send(stream.body)
      } catch (error) {
        app.log.error('Error in chat stream:', error)

        if (error instanceof UnauthorizedError) {
          throw error
        }

        return reply.status(500).send({
          error: 'Failed to process chat request.',
          details: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}

export { chatStreamRoute }
