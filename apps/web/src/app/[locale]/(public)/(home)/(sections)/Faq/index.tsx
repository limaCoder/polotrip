import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MotionSection } from "@/lib/motion/motion-components";
import { faqData } from "./data";
import { FaqAccordion } from "./faq-accordion";

export async function Faq() {
  const t = await getTranslations("Home.Faq");
  const tQuestions = await getTranslations("Home.Faq.questions");

  const questions = faqData.map((q) => ({
    question: tQuestions(q.questionKey),
    answer: tQuestions(q.answerKey),
  }));

  return (
    <MotionSection
      className="bg-secondary-10 py-12 lg:bg-background"
      id="faq"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto flex flex-col gap-12 px-4 lg:flex-row lg:px-9">
        <div className="flex w-full flex-col lg:w-2/5">
          <h2 className="font-bold font-title_two text-primary">
            {t("title")}
          </h2>
          <p className="mt-4 font-body_one">
            {t("description")}
            <a className="ml-2 font-bold" href="mailto:help@polotrip.com">
              help@polotrip.com
            </a>
          </p>
          <div className="flex justify-center">
            <Image
              alt={t("image_alt")}
              className="mt-6 h-[250px] lg:h-[330px]"
              height={327}
              src="/pages/home/faq/question.svg"
              width={232}
            />
          </div>
        </div>

        <div className="flex w-full flex-col justify-center lg:w-3/5">
          <FaqAccordion questions={questions} />
        </div>
      </div>
    </MotionSection>
  );
}
