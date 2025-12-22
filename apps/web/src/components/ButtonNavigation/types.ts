import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface ButtonNavigationProps
  extends Omit<
    ComponentPropsWithoutRef<"a">,
    "popover" | "children" | "href" | "className"
  > {
  href: string;
  children: ReactNode;
  className?: string;
}

export type { ButtonNavigationProps };
