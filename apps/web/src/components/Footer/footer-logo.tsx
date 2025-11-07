"use client";

import { Logo } from "@/components/Logo";

type FooterLogoProps = {
  alt: string;
};

export function FooterLogo({ alt }: FooterLogoProps) {
  return <Logo alt={alt} width={150} />;
}
