'use client';

import { CookieConsent } from './cookie-consent';
import { useParams } from 'next/navigation';

export function CookieConsentWrapper() {
  const { locale } = useParams();
  const privacyPolicyHref = `/${locale}/privacy-policy`;

  return <CookieConsent variant="mini" learnMoreHref={privacyPolicyHref} />;
}
