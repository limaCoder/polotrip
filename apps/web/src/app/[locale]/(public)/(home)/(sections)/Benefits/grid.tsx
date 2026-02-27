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
          className="group hover:-translate-y-1 relative flex flex-col justify-between overflow-hidden rounded-md border border-border bg-card p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(30,30,30,0.1)]"
          initial={{ opacity: 0, y: 20 }}
          key={benefit.id}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 p-4 font-heading text-8xl opacity-5 transition-opacity group-hover:opacity-10">
            {index + 1}
          </div>
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
            {benefit.icon}
          </div>
          <div className="relative z-10 mt-8">
            <h3 className="font-heading text-2xl text-foreground tracking-tight">
              {benefit.title}
            </h3>
            <p className="mt-3 font-body_two text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
}
