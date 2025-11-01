'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { usePostHog } from '@/hooks/usePostHog';
import { FaqAccordionProps } from './types';

export function FaqAccordion({ questions }: FaqAccordionProps) {
  const { capture } = usePostHog();

  const handleValueChange = (value: string) => {
    if (value) {
      const index = parseInt(value.replace('item-', '')) - 1;
      const question = questions[index];

      if (question) {
        capture('faq_item_clicked', {
          question_index: index + 1,
          question_text: question.question,
          total_questions: questions.length,
        });
      }
    }
  };

  return (
    <Accordion type="single" collapsible onValueChange={handleValueChange}>
      {questions.map((q, i) => (
        <AccordionItem key={i} value={`item-${i + 1}`}>
          <AccordionTrigger>{q.question}</AccordionTrigger>
          <AccordionContent>{q.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
