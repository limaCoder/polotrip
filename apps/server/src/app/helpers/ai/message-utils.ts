import type { z } from "zod";
import type { uiMessageSchema } from "@/app/schemas/ai";
import { BadRequestError } from "@/http/errors";
import { detectPromptInjection } from "./prompt-injection";

type UiMessage = z.infer<typeof uiMessageSchema>;

export function extractTextFromUIMessage(message: UiMessage): string {
  if (message?.content) {
    return message?.content;
  }

  if (message?.parts && Array.isArray(message?.parts)) {
    const textParts = message?.parts?.filter(
      (part): part is { type: "text"; text: string } =>
        part &&
        typeof part === "object" &&
        "type" in part &&
        part.type === "text" &&
        "text" in part &&
        typeof part.text === "string"
    );
    return textParts?.map((p) => p?.text).join("");
  }
  return "";
}

export type ApiMessage = { role: "user" | "assistant"; content: string };

export function convertUiMessagesToApiFormat(
  uiMessages: UiMessage[]
): ApiMessage[] {
  return uiMessages
    ?.map((uiMsg) => {
      let text = extractTextFromUIMessage(uiMsg);
      text = text.trim().replace(/\0/g, "");

      if (!text || text.length === 0) {
        return null;
      }

      if (text.length > 4000) {
        throw new BadRequestError("Message too long (max 4000 characters)");
      }

      if (uiMsg?.role !== "user" && uiMsg?.role !== "assistant") {
        return null;
      }

      return {
        role: uiMsg?.role as "user" | "assistant",
        content: text,
      };
    })
    .filter((msg): msg is ApiMessage => msg !== null);
}

export function validateChatRequest(convertedMessages: ApiMessage[]): void {
  const userMessages = convertedMessages?.filter((m) => m?.role === "user");
  if (userMessages?.length === 0) {
    throw new BadRequestError("No user messages found");
  }

  const lastUserMessage = userMessages?.at(-1);
  if (!lastUserMessage) {
    throw new BadRequestError("No user messages found");
  }

  if (detectPromptInjection(lastUserMessage?.content)) {
    throw new BadRequestError(
      "Your message contains patterns that are not allowed. Please rephrase your question about travel albums."
    );
  }

  const totalLength = convertedMessages?.reduce(
    (sum, m) => sum + m?.content?.length,
    0
  );
  if (totalLength > 50_000) {
    throw new BadRequestError(
      "Conversation too long. Please start a new conversation."
    );
  }
}
