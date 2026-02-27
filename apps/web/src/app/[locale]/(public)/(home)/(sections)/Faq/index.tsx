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
      className="bg-background py-12"
      id="faq"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto flex flex-col gap-12 px-4 lg:flex-row lg:px-9">
        <div className="flex w-full flex-col lg:w-2/5">
          <h2 className="font-title_one text-foreground">{t("title")}</h2>
          <p className="mt-6 font-body_one text-muted-foreground">
            {t("description")}
            <a className="ml-2 font-bold" href="mailto:help@polotrip.com">
              help@polotrip.com
            </a>
          </p>
          <div className="flex justify-center">
            <Image
              alt={t("image_alt")}
              className="mt-6 h-auto w-full max-w-[300px] lg:max-w-[400px]"
              height={400}
              src="/pages/home/faq/question-plushie.png"
              width={400}
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
