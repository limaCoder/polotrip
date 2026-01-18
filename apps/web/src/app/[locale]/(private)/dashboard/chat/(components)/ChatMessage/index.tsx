"use client";

import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { ToolDisplay } from "./tool-display";
import type { ChatMessageProps } from "./types";
import { isTextPart, isToolPart } from "./utils";

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message?.role === "user";

  const parts = (message?.parts ?? []) as unknown[];
  const toolParts = parts?.filter(isToolPart);
  const textParts = parts?.filter(isTextPart);
  const text = textParts?.map((part) => part?.text).join("");

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary">
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-3",
          isUser ? "max-w-[80%]" : "max-w-[90%]"
        )}
      >
        {text.length > 0 && (
          <div
            className={cn(
              "rounded-lg px-4 py-2",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <p className="whitespace-pre-wrap text-sm">{text}</p>
          </div>
        )}

        {!isUser && toolParts.length > 0 && (
          <ToolDisplay messageId={message.id} toolParts={toolParts} />
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
