"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatInputProps } from "./types";

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  const t = useTranslations("Chat.input");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      className="relative flex items-end gap-3"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <Textarea
        className="min-h-[64px] resize-none rounded-2xl border-background/20 bg-background/40 p-4 pr-16 text-base shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md transition-all placeholder:text-text focus-visible:bg-background focus-visible:ring-primary/30"
        disabled={isLoading}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
        placeholder={t("placeholder")}
        value={input}
      />
      <Button
        className="absolute right-2 bottom-3 h-12 w-12 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        disabled={isLoading || !input.trim()}
        size="icon"
        type="submit"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
