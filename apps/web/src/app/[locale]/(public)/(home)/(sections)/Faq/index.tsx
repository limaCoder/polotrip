import { MotionSection } from '@/lib/motion/motion-components';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { faqData } from './data';
import { FaqAccordion } from './faq-accordion';

export async function Faq() {
  const t = await getTranslations('Home.Faq');
  const tQuestions = await getTranslations('Home.Faq.questions');

  const questions = faqData.map(q => ({
    question: tQuestions(q.questionKey),
    answer: tQuestions(q.answerKey),
  }));

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
          <h2 className="font-title_two text-primary font-bold">{t('title')}</h2>
          <p className="mt-4 font-body_one">
            {t('description')}
            <a href="mailto:help@polotrip.com" className="ml-2 font-bold">
              help@polotrip.com
            </a>
          </p>
          <div className="flex justify-center">
            <Image
              src="/pages/home/faq/question.svg"
              alt={t('image_alt')}
              className="h-[250px] lg:h-[330px] mt-6"
              width={232}
              height={327}
            />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-3/5 justify-center">
          <FaqAccordion questions={questions} />
        </div>
      </div>
    </MotionSection>
  );
}
