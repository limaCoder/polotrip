import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MotionSection } from '@/lib/motion/motion-components';
import { questions } from './data';
import Image from 'next/image';
export function Faq() {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12 bg-secondary-10 lg:bg-background"
      id="faq"
    >
      <div className="container mx-auto lg:px-9 px-4 flex flex-col lg:flex-row gap-12">
        <div className="flex w-full lg:w-2/5 flex-col">
          <h2 className="font-title_two text-primary font-bold">Perguntas frequentes</h2>
          <p className="mt-4 font-body_one">
            Para maiores dúvidas, mande uma mensagem para o nosso contato de suporte
            <a href="mailto:help@polotrip.com" className="ml-2 font-bold">
              help@polotrip.com
            </a>
          </p>
          <div className="flex justify-center">
            <Image
              src="/pages/home/faq/question.svg"
              alt="Ilustração de uma mulher segurando um balao de pontos de interrogação"
              className="h-[250px] lg:h-[330px] mt-6"
              width={232}
              height={327}
            />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-3/5 justify-center">
          <Accordion type="single" collapsible>
            {questions.map((q, i) => (
              <AccordionItem key={i} value={`item-${i + 1}`}>
                <AccordionTrigger>{q.question}</AccordionTrigger>
                <AccordionContent>{q.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </MotionSection>
  );
}
