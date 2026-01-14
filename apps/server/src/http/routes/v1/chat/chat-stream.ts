import { fromNodeHeaders } from 'better-auth/node'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createChatCompletion } from '@/app/functions/create-chat-completion'
import { UnauthorizedError } from '@/http/errors'
import { authenticate } from '@/http/middlewares/authenticate'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const chatStreamRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/chat',
    {
      onRequest: [authenticate],
      schema: {
        body: z.object({
          messages: z.array(messageSchema),
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
