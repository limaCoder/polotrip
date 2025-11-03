"use client";

import { useParams } from "next/navigation";
import { CookieConsent } from "./cookie-consent";

export function CookieConsentWrapper() {
  const { locale } = useParams();
  const privacyPolicyHref = `/${locale}/privacy-policy`;

  return <CookieConsent learnMoreHref={privacyPolicyHref} variant="mini" />;
}
