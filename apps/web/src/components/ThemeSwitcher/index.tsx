"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ThemeSwitcherProps = {
  className?: string;
  whiteIcon?: boolean;
  brightnessHover?: boolean;
};

export function ThemeSwitcher({
  className,
  whiteIcon = false,
  brightnessHover = false,
}: ThemeSwitcherProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        className={cn("h-9 w-9", className)}
        disabled
        size="icon"
        type="button"
        variant="ghost"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      aria-label={
        resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className={cn(
        "h-9 w-9",
        whiteIcon && "text-text hover:text-text",
        brightnessHover &&
          "transition-all hover:bg-transparent hover:brightness-125",
        className
      )}
      onClick={toggleTheme}
      size="icon"
      type="button"
      variant="ghost"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
