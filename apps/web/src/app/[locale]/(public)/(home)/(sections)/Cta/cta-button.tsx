"use client";

import { ButtonNavigation } from "@/components/ButtonNavigation";
import { usePostHog } from "@/hooks/use-posthog";
import type { CtaButtonProps } from "./types";

export function CtaButton({
  buttonText,
  buttonAria,
  locale,
  price,
}: CtaButtonProps) {
  const { capture } = usePostHog();

  const handleClick = () => {
    capture("cta_section_clicked", {
      button_text: buttonText,
      target: "/sign-in",
      section: "footer_cta",
      locale,
      shown_price: price,
    });
  };

  return (
    <ButtonNavigation
      aria-label={buttonAria}
      className="h-[60px] bg-primary text-white hover:bg-primary/90"
      href="/sign-in"
      onClick={handleClick}
    >
      <span className="font-bold">{buttonText}</span>
    </ButtonNavigation>
  );
}
