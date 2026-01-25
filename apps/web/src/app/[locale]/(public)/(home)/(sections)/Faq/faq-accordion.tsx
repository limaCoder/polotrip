"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePostHog } from "@/hooks/use-posthog";
import type { FaqAccordionProps } from "./types";

export function FaqAccordion({ questions }: FaqAccordionProps) {
  const { capture } = usePostHog();

  const handleValueChange = (value: string) => {
    if (value) {
      const index = Number.parseInt(value.replace("item-", ""), 10) - 1;
      const question = questions[index];

      if (question) {
        capture("faq_item_clicked", {
          question_index: index + 1,
          question_text: question.question,
          total_questions: questions.length,
        });
      }
    }
  };

  return (
    <Accordion collapsible onValueChange={handleValueChange} type="single">
      {questions.map((q) => (
        <AccordionItem key={q.question} value={`item-${q.question}`}>
          <AccordionTrigger>{q.question}</AccordionTrigger>
          <AccordionContent>{q.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
