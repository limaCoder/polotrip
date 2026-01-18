"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { env } from "@/lib/env";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatInterface() {
  const t = useTranslations("Chat.interface");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${env.NEXT_PUBLIC_API_URL}/api/v1/chat`,
        credentials: "include",
      }),
    []
  );

  const { messages, sendMessage, status, error } = useChat<UIMessage>({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const [input, setInput] = useState("");

  // Auto-scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to scroll when message count changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
      }
    }
  }, [messages.length]);

  useEffect(() => {
    if (error) {
      toast.error(t("error_sending"));
    }
  }, [error, t]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-300px)] flex-col rounded-lg border bg-card">
      <ScrollArea className="grow p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="space-y-2 text-center">
              <p className="font-medium text-lg">{t("start_conversation")}</p>
              <p className="text-sm">{t("start_conversation_description")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message: UIMessage) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-pulse">●</div>
                <span className="text-sm">{t("ai_thinking")}</span>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {t("error")}: {error.message}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <ChatInput
          handleInputChange={(e) => {
            setInput(e.currentTarget.value);
          }}
          handleSubmit={handleSubmit}
          input={input}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
