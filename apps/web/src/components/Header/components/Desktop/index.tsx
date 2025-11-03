"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/routing";
import { DashboardContent } from "../../dashboard-content";
import type { HeaderDesktopProps } from "../../types";
import { HomeContent } from "./home-content";

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderDesktop({ isHome }: HeaderDesktopProps) {
  const t = useTranslations("Header");
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");

  const logoHref = isDashboard ? "/dashboard" : "/";
  const logoSrc = isHome ? "/brand/logo-white.svg" : "/brand/logo.svg";

  return (
    <div className="container relative hidden items-center justify-between px-4 py-4 lg:flex">
      <Link className="cursor-pointer" href={logoHref}>
        <Image
          alt={t("logo_alt")}
          height={40}
          priority
          sizes="(max-width: 768px) 150px, 180px"
          src={logoSrc}
          width={180}
        />
      </Link>

      <div className="flex items-center gap-4">
        <HomeContent isHome={isHome} />
        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher />}
        <DashboardContent />
      </div>
    </div>
  );
}
