"use client";

import { Album, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ButtonNavigation } from "@/components/ButtonNavigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { DashboardContent } from "../../dashboard-content";

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderMobile() {
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isDashboardPage = pathname === "/dashboard";
  const isDashboardDirectory = pathname.startsWith("/dashboard");

  const logoHref = isDashboardDirectory ? "/dashboard" : "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container relative flex items-center justify-between bg-background px-4 py-4 lg:hidden">
      <Link href={logoHref}>
        <Logo
          alt={t("logo_alt")}
          className="w-[150px] md:w-[180px]"
          height={40}
          priority
          sizes="(max-width: 768px) 150px, 180px"
          width={180}
        />
      </Link>

      <div className="flex items-center gap-2">
        {!isHomePage && <ThemeSwitcher />}
        {!isHomePage && IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher />}
        {isDashboardPage && <DashboardContent />}
      </div>

      {isHomePage && (
        <div className="flex items-center gap-6">
          <ThemeSwitcher />
          <button
            aria-label={t("open_menu_aria")}
            className="z-20 text-primary"
            onClick={toggleMenu}
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      )}

      <div
        className={cn(
          "absolute top-0 left-0 z-10 flex w-full flex-col items-start justify-center gap-4 bg-background p-6 shadow-lg transition-transform duration-700",
          isMenuOpen ? "translate-y-16" : "-translate-y-full"
        )}
      >
        <a
          aria-label={t("advantages_aria")}
          className="text-foreground"
          href="#benefits"
          onClick={toggleMenu}
        >
          {t("advantages")}
        </a>
        <a
          aria-label={t("how_it_works_aria")}
          className="text-foreground"
          href="#how-it-works"
          onClick={toggleMenu}
        >
          {t("how_it_works")}
        </a>
        <a
          aria-label={t("faq_aria")}
          className="text-foreground"
          href="#faq"
          onClick={toggleMenu}
        >
          {t("faq")}
        </a>
        <ButtonNavigation
          aria-label={t("access_account_aria")}
          className="mt-3 w-full justify-center bg-gradient-primary text-white"
          href="/sign-in"
        >
          <span className="font-semibold">{t("access_account")}</span>
          <Album />
        </ButtonNavigation>

        {IS_INTERNATIONALIZATION_ENABLED && (
          <div className="flex w-full justify-center">
            <LocaleSwitcher />
          </div>
        )}
      </div>
    </div>
  );
}
