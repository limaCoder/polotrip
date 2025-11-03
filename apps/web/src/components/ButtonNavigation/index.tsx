"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { ButtonNavigationProps } from "./types";

export function ButtonNavigation({
  href,
  className = "",
  children,
  ...rest
}: ButtonNavigationProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "flex items-center justify-center gap-2 rounded-[10px] px-4 py-4 text-center font-bold transition-all duration-300 ease-in-out hover:brightness-110",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
