"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type LogoProps = {
  alt: string;
  height?: number;
  width?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  forceWhite?: boolean;
};

export function Logo({
  alt,
  height = 40,
  width = 180,
  className,
  priority = false,
  sizes,
  forceWhite = false,
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");
  const showWhiteLogo = forceWhite || isDarkMode;

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <Image
        alt={alt}
        className={cn(
          "absolute inset-0 transition-opacity duration-200",
          showWhiteLogo ? "opacity-0" : "opacity-100"
        )}
        height={height}
        priority={priority}
        sizes={sizes}
        src="/brand/logo.svg"
        width={width}
      />
      <Image
        alt={alt}
        className={cn(
          "absolute inset-0 transition-opacity duration-200",
          showWhiteLogo ? "opacity-100" : "opacity-0"
        )}
        height={height}
        priority={priority}
        sizes={sizes}
        src="/brand/logo-white.svg"
        width={width}
      />
    </div>
  );
}
