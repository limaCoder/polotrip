import type { ComponentProps, ReactNode } from "react";

interface ButtonNavigationProps extends ComponentProps<"a"> {
  href: string;
  children: ReactNode;
  className?: string;
}

export type { ButtonNavigationProps };
