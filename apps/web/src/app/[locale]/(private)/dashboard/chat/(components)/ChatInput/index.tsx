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
    <form className="flex gap-2" onSubmit={handleSubmit} ref={formRef}>
      <Textarea
        className="min-h-[60px] resize-none"
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
        className="h-[60px] w-[60px] shrink-0"
        disabled={isLoading || !input.trim()}
        size="icon"
        type="submit"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
