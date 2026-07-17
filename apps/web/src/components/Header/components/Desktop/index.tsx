"use client";

import { Github } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { GITHUB_REPO_URL } from "@/constants/githubRepo";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { DashboardContent } from "../../dashboard-content";
import type { HeaderDesktopProps } from "../../types";
import { HomeContent } from "./home-content";

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderDesktop({ isHome }: HeaderDesktopProps) {
  const t = useTranslations("Header");
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");

  const logoHref = isDashboard ? "/dashboard" : "/";

  return (
    <div className="container relative hidden items-center justify-between px-4 py-4 lg:flex">
      <Link className="cursor-pointer" href={logoHref}>
        <Logo
          alt={t("logo_alt")}
          height={40}
          priority
          sizes="(max-width: 768px) 150px, 180px"
          width={180}
        />
      </Link>

      <div className="flex items-center gap-4">
        <a
          aria-label={t("github_aria")}
          className={cn(
            "transition-opacity hover:opacity-70",
            isHome ? "text-white drop-shadow-lg" : "text-foreground"
          )}
          href={GITHUB_REPO_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github className="h-5 w-5" />
        </a>
        <HomeContent isHome={isHome} />
        <ThemeSwitcher whiteIcon={isHome} />
        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher />}
        <DashboardContent />
      </div>
    </div>
  );
}
