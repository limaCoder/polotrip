"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatPhotoDisplay } from "../ChatPhotoDisplay";
import { TOOL_LOADING_MESSAGES } from "./constants";
import type { ToolDisplayProps, ToolLoadingMessageKey } from "./types";
import { filterToolsToShow } from "./utils";

export function ToolDisplay({ toolParts, messageId }: ToolDisplayProps) {
  const t = useTranslations("Chat.message");

  if (toolParts.length === 0) {
    return null;
  }

  const toolsToShow = filterToolsToShow(toolParts);

  return (
    <div className="space-y-2">
      {toolsToShow.map((tool) => {
        const toolName = tool.toolName;
        const key = `${messageId}:${tool.toolCallId}:${tool.state}`;

        if (tool.state === "input-available") {
          const messageKey =
            TOOL_LOADING_MESSAGES[
              toolName as keyof typeof TOOL_LOADING_MESSAGES
            ] ?? "working";

          return (
            <div
              className="flex items-center gap-2 text-muted-foreground text-xs"
              key={key}
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t(messageKey as ToolLoadingMessageKey)}</span>
            </div>
          );
        }

        if (tool.state === "output-available" && tool.output != null) {
          return (
            <div className="mt-2" key={key}>
              <ChatPhotoDisplay data={tool.output} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
