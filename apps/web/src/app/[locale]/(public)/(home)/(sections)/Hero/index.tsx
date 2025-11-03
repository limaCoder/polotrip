import { getTranslations } from "next-intl/server";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MotionDiv } from "@/lib/motion/motion-components";
import { HeroButtons } from "./hero-buttons";
import { HeroPhotos } from "./photos";

export async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <section className="relative overflow-hidden py-10 pt-30 lg:min-h-screen lg:pt-20">
      <div className="absolute inset-0 z-0 hidden h-full w-full lg:block">
        <video
          autoPlay
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/pages/home/hero/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="container relative z-10 flex h-full w-full flex-col items-center justify-between px-4 lg:min-h-screen lg:flex-row lg:px-9">
        <div className="flex max-w-2xl flex-col text-center lg:h-full lg:justify-center lg:text-left">
          <TextGenerateEffect
            className="text-primary lg:w-[582px] lg:text-secondary lg:drop-shadow-lg"
            duration={2}
            filter={false}
            tag="h1"
            words={t("title")}
          />
          <TextGenerateEffect
            className="lg:w-[526px] lg:text-white lg:drop-shadow-lg"
            duration={1.2}
            filter={false}
            tag="p"
            words={t("subtitle")}
          />
          <MotionDiv
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.7 }}
          >
            <HeroButtons
              howItWorksAria={t("how_it_works_button_aria")}
              howItWorksText={t("how_it_works_button")}
              seeExampleAria={t("see_example_button_aria")}
              seeExampleText={t("see_example_button")}
            />
          </MotionDiv>
        </div>

        <div className="lg:hidden">
          <HeroPhotos />
        </div>
      </div>
    </section>
  );
}
