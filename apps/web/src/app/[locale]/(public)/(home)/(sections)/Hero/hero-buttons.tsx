"use client";

import { ButtonNavigation } from "@/components/ButtonNavigation";
import { usePostHog } from "@/hooks/usePostHog";
import type { HeroButtonsProps } from "./types";

export function HeroButtons({
  howItWorksText,
  howItWorksAria,
  seeExampleText,
  seeExampleAria,
}: HeroButtonsProps) {
  const { capture } = usePostHog();

  const handleHowItWorksClick = () => {
    capture("hero_how_it_works_clicked", {
      button_text: howItWorksText,
      target: "#how-it-works",
    });
  };

  const handleSeeExampleClick = () => {
    capture("hero_see_example_clicked", {
      button_text: seeExampleText,
      target: "/album/a9jrss8qhxerqnsglmpks2da",
    });
  };

  return (
    <>
      <ButtonNavigation
        aria-label={howItWorksAria}
        className="group hover:-translate-y-1 relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-primary-foreground shadow-primary/20 shadow-xl transition-all duration-400 hover:shadow-2xl hover:shadow-primary/40 sm:w-auto"
        href="#how-it-works"
        onClick={handleHowItWorksClick}
      >
        <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-400 ease-out group-hover:translate-y-0" />
        <span className="relative z-10 font-bold font-heading text-sm uppercase tracking-[0.15em]">
          {howItWorksText}
        </span>
      </ButtonNavigation>
      <ButtonNavigation
        aria-label={seeExampleAria}
        className="group hover:-translate-y-1 relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full border border-foreground/10 bg-background/50 px-8 text-foreground shadow-sm backdrop-blur-xl transition-all duration-400 hover:border-foreground/20 hover:bg-background/80 hover:shadow-xl sm:w-auto"
        href="/album/a9jrss8qhxerqnsglmpks2da"
        onClick={handleSeeExampleClick}
      >
        <span className="absolute inset-0 bg-foreground/5 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
        <span className="relative z-10 font-bold font-heading text-foreground/80 text-sm uppercase tracking-widest transition-colors duration-400 group-hover:text-foreground">
          {seeExampleText}
        </span>
      </ButtonNavigation>
    </>
  );
}
