import { getTranslations } from "next-intl/server";
import { Card, Carousel } from "@/components/ui/apple-cards-carousel";
import { MotionSection } from "@/lib/motion/motion-components";
import { howItWorksData } from "./data";

export async function HowItWorks() {
  const t = await getTranslations("Home.HowItWorks");
  const tSteps = await getTranslations("Home.HowItWorks.steps");

  const steps = howItWorksData.map((step) => ({
    ...step,
    category: tSteps(step.categoryKey),
    title: tSteps(step.titleKey),
  }));

  const cards = steps.map((card, index) => (
    <Card card={card} index={index} key={card.src} />
  ));

  return (
    <MotionSection
      className="py-10"
      id="how-it-works"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="mb-6 text-center font-title_one text-foreground">
          {t("title")}
        </h2>
        <p className="mx-auto mb-16 text-center font-body_one text-muted-foreground">
          {t("description")}
        </p>

        <Carousel items={cards} />
      </div>
    </MotionSection>
  );
}
