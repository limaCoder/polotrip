import { getTranslations } from "next-intl/server";
import { MotionSection } from "@/lib/motion/motion-components";
import { BenefitsGrid } from "./grid";

export async function Benefits() {
  const t = await getTranslations("Home.Benefits");

  return (
    <MotionSection
      className="bg-secondary-10 py-8 lg:bg-background lg:py-16"
      id="benefits"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="mb-4 text-center font-bold font-title_two text-primary md:mb-12">
          {t("title")}
        </h2>

        <BenefitsGrid />

        <p className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground text-sm md:mt-12">
          {t("description")}
        </p>
      </div>
    </MotionSection>
  );
}
