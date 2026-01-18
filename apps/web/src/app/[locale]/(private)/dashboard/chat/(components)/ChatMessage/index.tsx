"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/cn";
import { renderMarkdownText } from "./render-markdown-text";
import { ToolDisplay } from "./tool-display";
import type { ChatMessageProps } from "./types";
import { isTextPart, isToolPart } from "./utils";

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message?.role === "user";
  const userData = useUserData();

  const parts = (message?.parts ?? []) as unknown[];
  const toolParts = parts?.filter(isToolPart);
  const textParts = parts?.filter(isTextPart);
  const rawText = textParts?.map((part) => part?.text).join("");
  const text = isUser ? rawText.trim() : rawText;

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="flex items-center justify-center bg-primary">
            <Image
              alt="Polotrip"
              height={16}
              src="/brand/polotrip-icon.png"
              width={16}
            />
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
            <p className="whitespace-pre-wrap text-sm">
              {isUser ? text : renderMarkdownText(text)}
            </p>
          </div>
        )}

        {!isUser && toolParts.length > 0 && (
          <ToolDisplay messageId={message.id} toolParts={toolParts} />
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          {userData?.userAvatar || userData?.usernameInitials ? (
            <>
              <AvatarImage
                referrerPolicy="no-referrer"
                src={userData?.userAvatar}
              />
              <AvatarFallback className="bg-secondary font-bold text-white">
                {userData?.usernameInitials}
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-secondary" />
          )}
        </Avatar>
      )}
    </div>
  );
}
