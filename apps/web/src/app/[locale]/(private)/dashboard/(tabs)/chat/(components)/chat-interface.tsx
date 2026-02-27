"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { env } from "@/lib/env";
import { useChatRateLimit } from "../(hooks)/use-chat-rate-limit";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { RateLimitBanner } from "./RateLimitBanner";

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

  const rateLimit = useChatRateLimit(error || null);
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
    if (!input.trim() || isLoading || rateLimit.isLimited) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-280px)] flex-col overflow-hidden rounded-4xl border border-background/60 bg-background/40 shadow-[0_8px_40px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 backdrop-blur-xl">
      <ScrollArea className="grow p-6" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="fade-in mt-2 flex h-full animate-in flex-col items-center justify-center text-slate-500 duration-700">
            <div className="space-y-3 px-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="32"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="font-bold font-title_two text-2xl text-text">
                {t("start_conversation")}
              </p>
              <p className="mx-auto max-w-sm text-base text-text leading-relaxed">
                {t("start_conversation_description")}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((message: UIMessage) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="slide-in-from-bottom-2 flex animate-in items-center gap-3 pl-4 text-text duration-300">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-background/20 bg-background/40 shadow-sm">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                </div>
                <span className="font-medium text-sm tracking-wide">
                  {t("ai_thinking")}
                </span>
              </div>
            )}
          </div>
        )}
        {error && !rateLimit.isLimited && (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {t("error")}
            </div>
            <p className="mt-1 text-destructive/90 text-sm">{error.message}</p>
          </div>
        )}
      </ScrollArea>

      <div className="flex flex-col space-y-3 border-background/50 border-t bg-background/50 p-4 backdrop-blur-md">
        <RateLimitBanner
          isLimited={rateLimit.isLimited}
          limit={rateLimit.limit}
          remaining={rateLimit.remaining}
          resetAt={rateLimit.resetAt}
          timeUntilReset={rateLimit.timeUntilReset}
        />
        <ChatInput
          handleInputChange={(e) => {
            setInput(e.currentTarget.value);
          }}
          handleSubmit={handleSubmit}
          input={input}
          isLoading={isLoading || rateLimit.isLimited}
        />
      </div>
    </div>
  );
}
