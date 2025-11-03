"use client";

import { Album } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonNavigation } from "@/components/ButtonNavigation";
import { usePostHog } from "@/hooks/usePostHog";
import { cn } from "@/lib/cn";
import type { HomeContentProps } from "../../types";

export function HomeContent({
  isHome: isHomeFromParent = false,
}: HomeContentProps) {
  const t = useTranslations("Header");
  const { capture } = usePostHog();

  const handleCtaClick = () => {
    capture("header_cta_clicked", {
      button_text: t("access_account"),
      target: "/sign-in",
      section: "header",
    });
  };

  if (!isHomeFromParent) return null;

  return (
    <>
      <p
        className={cn("block", isHomeFromParent && "text-white drop-shadow-lg")}
      >
        {t("create_albums_prompt")}
      </p>
      <ButtonNavigation
        aria-label={t("access_account_aria")}
        className="button-shadow bg-gradient-primary text-white"
        href="/sign-in"
        onClick={handleCtaClick}
      >
        <span className="font-bold">{t("access_account")}</span>
        <Album />
      </ButtonNavigation>
    </>
  );
}
