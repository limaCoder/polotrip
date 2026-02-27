import { getTranslations } from "next-intl/server";
import { MotionSection } from "@/lib/motion/motion-components";
import { BenefitsGrid } from "./grid";

export async function Benefits() {
  const t = await getTranslations("Home.Benefits");

  return (
    <MotionSection
      className="bg-background py-8 lg:py-16"
      id="benefits"
      initial={{ opacity: 0, y: 35 }}
      transition={{ duration: 0.7 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="mb-6 text-center font-title_one text-foreground md:mb-16">
          {t("title")}
        </h2>

        <BenefitsGrid />

        <p className="mx-auto mt-12 max-w-2xl text-center font-body_one text-muted-foreground md:mt-16">
          {t("description")}
        </p>
      </div>
    </MotionSection>
  );
}
