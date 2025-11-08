import { getTranslations } from "next-intl/server";
import { MotionDiv } from "@/lib/motion/motion-components";
import { benefitsData } from "./data";

export async function BenefitsGrid() {
  const t = await getTranslations("Home.Benefits.cards");

  const benefits = benefitsData.map((benefit) => ({
    ...benefit,
    title: t(benefit.titleKey),
    description: t(benefit.descriptionKey),
  }));

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit, index) => (
        <MotionDiv
          className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          key={benefit.id}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-50 text-primary">
            {benefit.icon}
          </div>
          <h3 className="mt-4 font-semibold text-lg">{benefit.title}</h3>
          <p className="mt-2">{benefit.description}</p>
        </MotionDiv>
      ))}
    </div>
  );
}
