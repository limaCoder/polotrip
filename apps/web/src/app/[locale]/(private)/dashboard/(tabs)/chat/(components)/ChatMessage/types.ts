import type { UIMessage } from "@ai-sdk/react";
import type { TOOL_LOADING_MESSAGES } from "./constants";

export type ChatMessageProps = {
  message: UIMessage;
};

export type ToolPartState = "input-available" | "output-available";

export type ToolPart = {
  type: "dynamic-tool";
  toolName: string;
  toolCallId: string;
  state: ToolPartState;
  input?: unknown;
  output?: unknown;
};

export type ToolDisplayProps = {
  toolParts: ToolPart[];
  messageId: string;
};

export type ToolLoadingMessageKey =
  | (typeof TOOL_LOADING_MESSAGES)[keyof typeof TOOL_LOADING_MESSAGES]
  | "working";
