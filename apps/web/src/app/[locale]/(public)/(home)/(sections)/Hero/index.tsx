import { Plane } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GITHUB_REPO_URL } from "@/constants/githubRepo";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MotionDiv } from "@/lib/motion/motion-components";
import { HeroBackground } from "./hero-background";
import { HeroButtons } from "./hero-buttons";

export async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-start overflow-hidden bg-background pt-28 pb-8 sm:pt-32 lg:pt-36">
      <HeroBackground alt={t("hero_scene_alt")} />

      <div className="container relative z-10 flex flex-1 flex-col items-center px-4">
        <MotionDiv
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <a
            aria-label={t("open_source_badge_aria")}
            className="mb-8 flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-background/60 px-4 py-2 shadow-sm backdrop-blur-md transition-colors hover:border-primary/40"
            href={GITHUB_REPO_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>

            <div className="relative flex w-16 items-center">
              <div className="w-full border-primary/30 border-t-[1.5px] border-dashed" />
              <MotionDiv
                animate={{ x: ["-150%", "300%"] }}
                className="absolute flex items-center justify-center text-primary"
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Plane
                  className="h-4 w-4 rotate-45 fill-primary/20 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                  strokeWidth={1.5}
                />
              </MotionDiv>
            </div>

            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/30" />
            </span>

            <span className="font-body_one text-foreground/80 text-sm">
              {t("open_source_badge")}
            </span>
          </a>
        </MotionDiv>

        <div className="flex w-full max-w-4xl flex-col items-center text-center">
          <TextGenerateEffect
            className="font-title_one text-5xl text-foreground tracking-tight drop-shadow-sm sm:text-6xl md:text-7xl lg:text-[5rem] lg:leading-[1.1]"
            duration={1.5}
            filter={true}
            tag="h1"
            words={t("title")}
          />
          <TextGenerateEffect
            className="mt-6 max-w-2xl font-body_one font-light text-foreground/75 text-lg leading-relaxed sm:text-lg md:text-xl lg:text-2xl"
            duration={1}
            filter={true}
            tag="p"
            words={t("subtitle")}
          />

          <MotionDiv
            className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:mt-12"
            initial={{ opacity: 0, y: 30 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <HeroButtons
              howItWorksAria={t("how_it_works_button_aria")}
              howItWorksText={t("how_it_works_button")}
              seeExampleAria={t("see_example_button_aria")}
              seeExampleText={t("see_example_button")}
            />
          </MotionDiv>
        </div>

        <div
          aria-hidden
          className="pointer-events-none mt-auto min-h-[38vh] w-full sm:min-h-[42vh] lg:min-h-[46vh]"
        />
      </div>
    </section>
  );
}
