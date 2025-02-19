import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export async function Faq() {
  return (
    <section className="py-12 bg-secondary-10 lg:bg-background">
      <div className="container mx-auto lg:px-9 px-4 flex flex-col lg:flex-row gap-12">
        <div className="flex w-full lg:w-2/5 flex-col">
          <h2 className="font-title_two text-primary font-bold">Perguntas frequentes</h2>
          <p className="mt-4 font-body_one">
            Para maiores dúvidas, mande uma mensagem para o nosso contato de suporte
            <a href="mailto:help@polotrip.com" className="ml-2 font-bold">
              help@polotrip.com
            </a>
          </p>
          <img src="/img/question.svg" alt="" className="h-[250px] lg:h-[330px] mt-6" />
        </div>
        <div className="flex flex-col w-full lg:w-3/5 justify-center">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionTrigger>
              <AccordionContent>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionTrigger>
              <AccordionContent>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionTrigger>
              <AccordionContent>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionTrigger>
              <AccordionContent>
                Lorem Ipsumis simply dummy text of the printing and typesetting industry.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
