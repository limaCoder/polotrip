import { Plane } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MotionDiv } from "@/lib/motion/motion-components";
import { HeroButtons } from "./hero-buttons";

export async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden bg-background pt-32 pb-20 lg:pt-40">
      {/* Dynamic Atmospheric Background 🪄 */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Abstract blurred shapes */}
        <div className="-top-[20%] -translate-x-1/2 absolute left-[10%] h-[600px] w-[800px] rounded-[100%] bg-primary/20 opacity-60 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] h-[500px] w-[500px] rounded-[100%] bg-secondary/20 opacity-50 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[20%] h-[400px] w-[600px] rounded-[100%] bg-primary/10 opacity-40 blur-[120px]" />

        {/* Subtle dot grid for depth and texture */}
        <div className="mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)] absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="container relative z-10 flex flex-col items-center px-4">
        {/* Decorative Memory/Travel Indicator */}
        <MotionDiv
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-background/50 px-4 py-2 shadow-sm backdrop-blur-md"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Origin Dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>

          {/* Flight Path */}
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

          {/* Destination Dot */}
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/30" />
          </span>
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
            className="mt-6 max-w-2xl font-body_one font-light text-foreground/70 text-lg leading-relaxed sm:text-lg md:text-xl lg:text-2xl"
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

        <MotionDiv
          className="relative mt-16 w-full max-w-md origin-bottom sm:max-w-lg lg:mt-24 lg:max-w-2xl"
          initial={{ opacity: 1, y: 80, scale: 0.9 }}
          transition={{
            opacity: { duration: 1, delay: 0.7, ease: "easeOut" },
            y: { duration: 1, delay: 0.7, type: "spring", bounce: 0.4 },
            scale: { duration: 1, delay: 0.7, type: "spring", bounce: 0.4 },
          }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
        >
          {/* Decorative glow behind image */}
          <div className="-z-10 absolute inset-0 scale-[1.2] rounded-full bg-primary/20 blur-[100px]" />

          <MotionDiv
            animate={{
              y: [0, -15, 0],
              rotate: [0, -1, 1, 0],
            }}
            className="relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              alt={t("hero_bear_alt")}
              className="h-auto w-full object-contain"
              height={800}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              src="/pages/home/hero/hero-bear.png"
              width={800}
            />
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
