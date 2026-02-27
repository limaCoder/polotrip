"use client";

import { ButtonNavigation } from "@/components/ButtonNavigation";
import { usePostHog } from "@/hooks/usePostHog";
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
      className="group relative overflow-hidden rounded-full border-2 border-primary bg-primary px-10 py-4 text-primary-foreground transition-all duration-300 hover:bg-transparent hover:text-primary"
      href="/sign-in"
      onClick={handleClick}
    >
      <span className="relative z-10 font-heading font-semibold text-sm uppercase tracking-widest">
        {buttonText}
      </span>
    </ButtonNavigation>
  );
}
