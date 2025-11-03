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
        className="button-shadow bg-primary text-white"
        href="#how-it-works"
        onClick={handleHowItWorksClick}
      >
        <span className="font-bold">{howItWorksText}</span>
      </ButtonNavigation>
      <ButtonNavigation
        aria-label={seeExampleAria}
        className="button-shadow bg-yellow text-black"
        href="/album/a9jrss8qhxerqnsglmpks2da"
        onClick={handleSeeExampleClick}
      >
        <span className="font-bold">{seeExampleText}</span>
      </ButtonNavigation>
    </>
  );
}
