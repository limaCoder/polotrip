"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePostHog } from "@/hooks/usePostHog";
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
      {questions.map((q, index) => (
        <AccordionItem
          className="border-border/50 border-b-2 py-2 transition-colors data-[state=open]:border-primary"
          key={q.question}
          value={`item-${index + 1}`}
        >
          <AccordionTrigger className="py-6 text-left font-heading text-xl hover:no-underline lg:text-3xl">
            <span className="flex items-start gap-6 lg:gap-8">
              <span className="mt-1 font-body_one text-muted-foreground text-sm lg:mt-2 lg:text-base">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground">{q.question}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pr-4 pb-8 pl-12 font-body_two text-base text-muted-foreground leading-relaxed lg:pl-16 lg:text-lg">
            {q.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
