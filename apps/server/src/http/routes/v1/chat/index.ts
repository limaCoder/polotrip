import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { chatStreamRoute } from './chat-stream.js'

const chatController: FastifyPluginAsyncZod = async (app) => {
  app.register(chatStreamRoute)
}

export default chatController
