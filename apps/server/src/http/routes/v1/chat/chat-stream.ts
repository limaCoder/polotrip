import { Readable } from "node:stream";
import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createChatCompletion } from "@/app/functions/create-chat-completion";
import {
  convertUiMessagesToApiFormat,
  validateChatRequest,
} from "@/app/helpers/ai/message-utils";
import { uiMessageSchema } from "@/app/schemas/ai";
import { UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const chatStreamRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/chat",
    {
      onRequest: [authenticate],
      schema: {
        body: z.object({
          messages: z
            .array(uiMessageSchema)
            .min(1, "At least one message required")
            .max(50, "Too many messages in conversation (max 50)"),
        }),
      },
    },
    async (request, reply) => {
      try {
        const session = await request.server.auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          throw new UnauthorizedError();
        }

        const body = request.body as {
          messages: z.infer<typeof uiMessageSchema>[];
        };
        const { messages: uiMessages } = body;

        const convertedMessages = convertUiMessagesToApiFormat(uiMessages);
        validateChatRequest(convertedMessages);

        const result = await createChatCompletion({
          userId: session.user.id,
          messages: convertedMessages,
        });

        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader(
          "Access-Control-Allow-Origin",
          request.headers.origin || "*"
        );
        reply.raw.setHeader("Access-Control-Allow-Credentials", "true");

        const response = result.toUIMessageStreamResponse();

        if (!response.body) {
          app.log.error("Stream body is null");
          throw new Error("Stream body is null");
        }

        // biome-ignore lint/suspicious/noExplicitAny: ReadableStream type conversion for Node.js
        const nodeStream = Readable.fromWeb(response.body as any);

        nodeStream.on("error", (error) => {
          app.log.error({ error }, "Stream error in chat response");
        });

        return reply.send(nodeStream);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        app.log.error({ error: errorMessage }, "Error in chat stream");

        if (error instanceof UnauthorizedError) {
          throw error;
        }

        return reply.status(500).send({
          error: "Failed to process chat request.",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );
};

export { chatStreamRoute };
