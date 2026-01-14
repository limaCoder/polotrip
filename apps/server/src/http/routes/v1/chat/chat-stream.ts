import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createChatCompletion } from "@/app/functions/create-chat-completion";
import { BadRequestError, UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message too long (max 4000 characters)")
    .transform((content) => {
      // Sanitize content: trim whitespace and remove null bytes
      return content.trim().replace(/\0/g, "");
    }),
});

// Regex patterns for prompt injection detection (defined at top level for performance)
const IGNORE_INSTRUCTIONS_PATTERN =
  /ignore\s+(previous|prior|all|above)\s+instructions?/i;
const FORGET_PATTERN = /forget\s+(everything|all|previous|prior)/i;
const YOU_ARE_NOW_PATTERN = /you\s+are\s+now\s+/i;
const NEW_INSTRUCTIONS_PATTERN = /new\s+instructions?:/i;
const SYSTEM_PATTERN = /system\s*:\s*/i;
const SYSTEM_BRACKETS_PATTERN = /\[system\]/i;
const PRETEND_PATTERN = /pretend\s+(to\s+be|you\s+are)/i;
const ROLEPLAY_PATTERN = /roleplay\s+as/i;
const ACT_AS_PATTERN = /act\s+as\s+(a\s+)?(?!travel|photo|album)/i;
const NEW_ROLE_PATTERN = /your\s+new\s+role/i;
const DISREGARD_PATTERN = /disregard\s+/i;
const OVERRIDE_PATTERN = /override\s+/i;
const IM_START_PATTERN = /<\|im_start\|>/i;
const IM_END_PATTERN = /<\|im_end\|>/i;
const INST_START_PATTERN = /\[INST\]/i;
const INST_END_PATTERN = /\[\/INST\]/i;

// Detect potential prompt injection attempts
function detectPromptInjection(message: string): boolean {
  const suspiciousPatterns = [
    IGNORE_INSTRUCTIONS_PATTERN,
    FORGET_PATTERN,
    YOU_ARE_NOW_PATTERN,
    NEW_INSTRUCTIONS_PATTERN,
    SYSTEM_PATTERN,
    SYSTEM_BRACKETS_PATTERN,
    PRETEND_PATTERN,
    ROLEPLAY_PATTERN,
    ACT_AS_PATTERN,
    NEW_ROLE_PATTERN,
    DISREGARD_PATTERN,
    OVERRIDE_PATTERN,
    IM_START_PATTERN,
    IM_END_PATTERN,
    INST_START_PATTERN,
    INST_END_PATTERN,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(message));
}

const chatStreamRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/chat",
    {
      onRequest: [authenticate],
      schema: {
        body: z.object({
          messages: z
            .array(messageSchema)
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

        const { messages } = request.body;

        // Validate message count and detect injection attempts
        const userMessages = messages.filter((m) => m.role === "user");
        if (userMessages.length === 0) {
          throw new BadRequestError("No user messages found");
        }

        const lastUserMessage = userMessages.at(-1);
        if (!lastUserMessage) {
          throw new BadRequestError("No user messages found");
        }

        if (detectPromptInjection(lastUserMessage.content)) {
          app.log.warn(
            `Potential prompt injection detected from user ${session.user.id}`
          );
          throw new BadRequestError(
            "Your message contains patterns that are not allowed. Please rephrase your question about travel albums."
          );
        }

        // Limit total conversation length to prevent context overflow
        const totalLength = messages.reduce(
          (sum, m) => sum + m.content.length,
          0
        );

        if (totalLength > 50_000) {
          throw new BadRequestError(
            "Conversation too long. Please start a new conversation."
          );
        }

        const result = await createChatCompletion({
          userId: session.user.id,
          messages,
        });

        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader(
          "Access-Control-Allow-Origin",
          request.headers.origin || "*"
        );
        reply.raw.setHeader("Access-Control-Allow-Credentials", "true");

        const stream = result.toDataStreamResponse();

        return reply.send(stream.body);
      } catch (error) {
        app.log.error("Error in chat stream:", error);

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
