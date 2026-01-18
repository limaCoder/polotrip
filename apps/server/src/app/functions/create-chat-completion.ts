import { openai } from "@ai-sdk/openai";
import { stepCountIs, streamText, type ToolSet } from "ai";
import {
  closeMCPClient,
  getMCPToolsWithUserId,
} from "@/app/lib/ai/mcp/mcp-client";
import { CHAT_SYSTEM_PROMPT } from "@/app/lib/ai/prompts/chat-system-prompt";
import { ApiError } from "@/http/errors/api-error";

type CreateChatCompletionRequest = {
  userId: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
};

async function createChatCompletionInternal({
  userId,
  messages,
}: CreateChatCompletionRequest): Promise<
  Awaited<ReturnType<typeof streamText>>
> {
  let tools: ToolSet | undefined;

  try {
    tools = await getMCPToolsWithUserId(userId);
  } catch (_mcpError) {
    throw new ApiError(
      503,
      "MCP server unavailable. Please try again later.",
      "SERVICE_UNAVAILABLE"
    );
  }

  try {
    const result = streamText({
      model: openai("gpt-4o"),
      system: CHAT_SYSTEM_PROMPT,
      messages,
      tools,
      stopWhen: stepCountIs(5),
      onError: async (error) => {
        if (
          error instanceof Error &&
          (error.message.includes("Connection closed") ||
            error.message.includes("MCP error"))
        ) {
          await closeMCPClient();
        }
      },
    });

    return result;
  } catch (_error) {
    throw new ApiError(
      500,
      "Error creating chat completion",
      "INTERNAL_SERVER_ERROR"
    );
  }
}

export const createChatCompletion =
  createChatCompletionInternal as typeof createChatCompletionInternal;
