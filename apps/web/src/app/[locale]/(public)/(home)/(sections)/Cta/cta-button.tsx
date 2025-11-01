'use client';

import { ButtonNavigation } from '@/components/ButtonNavigation';
import { usePostHog } from '@/hooks/usePostHog';
import { CtaButtonProps } from './types';

export function CtaButton({ buttonText, buttonAria, locale, price }: CtaButtonProps) {
  const { capture } = usePostHog();

  const handleClick = () => {
    capture('cta_section_clicked', {
      button_text: buttonText,
      target: '/sign-in',
      section: 'footer_cta',
      locale,
      shown_price: price,
    });
  };

  return (
    <ButtonNavigation
      href="/sign-in"
      className="h-[60px] bg-primary text-white hover:bg-primary/90"
      aria-label={buttonAria}
      onClick={handleClick}
    >
      <span className="font-bold">{buttonText}</span>
    </ButtonNavigation>
  );
}
