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
    <div
      className={cn(
        "slide-in-from-bottom-2 flex w-full animate-in gap-4 px-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="mt-1 h-9 w-9 shrink-0 border border-background/20 shadow-sm ring-2 ring-white">
          <AvatarFallback className="flex items-center justify-center bg-background/40">
            <Image
              alt="Polotrip"
              height={20}
              src="/brand/polotrip-icon.png"
              width={20}
            />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex min-w-0 flex-col gap-3",
          isUser ? "max-w-[75%]" : "w-full flex-1"
        )}
      >
        {text.length > 0 && (
          <div
            className={cn(
              "w-fit px-5 py-3.5 text-base leading-relaxed tracking-wide shadow-sm",
              isUser
                ? "inline-block self-end rounded-2xl rounded-tr-sm bg-primary text-text"
                : "max-w-[90%] self-start rounded-2xl rounded-tl-sm border border-background/20 bg-background/40 text-text shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
            )}
          >
            <div className="whitespace-pre-wrap">
              {isUser ? text : renderMarkdownText(text)}
            </div>
          </div>
        )}

        {!isUser && toolParts.length > 0 && (
          <div className="fade-in mt-2 w-full animate-in duration-500">
            <ToolDisplay messageId={message.id} toolParts={toolParts} />
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="mt-1 h-9 w-9 shrink-0 border border-primary/20 shadow-sm ring-2 ring-white">
          {userData?.userAvatar || userData?.usernameInitials ? (
            <>
              <AvatarImage
                referrerPolicy="no-referrer"
                src={userData?.userAvatar}
              />
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {userData?.usernameInitials}
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary" />
          )}
        </Avatar>
      )}
    </div>
  );
}
