"use client";

import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { HeaderDesktop } from "./components/Desktop";
import { HeaderMobile } from "./components/Mobile";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "z-50 w-full",
        isHome
          ? "fixed bg-transparent shadow-none lg:absolute"
          : "fixed bg-background shadow-md lg:relative"
      )}
    >
      <HeaderDesktop isHome={isHome} />
      <HeaderMobile />
    </header>
  );
}
