'use client';

import { Album } from 'lucide-react';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { cn } from '@/lib/cn';
import { HomeContentProps } from '../../types';
import { useTranslations } from 'next-intl';
import { usePostHog } from '@/hooks/usePostHog';

export function HomeContent({ isHome: isHomeFromParent = false }: HomeContentProps) {
  const t = useTranslations('Header');
  const { capture } = usePostHog();

  const handleCtaClick = () => {
    capture('header_cta_clicked', {
      button_text: t('access_account'),
      target: '/sign-in',
      section: 'header',
    });
  };

  if (!isHomeFromParent) return null;

  return (
    <>
      <p className={cn('block', isHomeFromParent && 'text-white drop-shadow-lg')}>
        {t('create_albums_prompt')}
      </p>
      <ButtonNavigation
        href="/sign-in"
        className="bg-gradient-primary text-white button-shadow"
        aria-label={t('access_account_aria')}
        onClick={handleCtaClick}
      >
        <span className="font-bold">{t('access_account')}</span>
        <Album />
      </ButtonNavigation>
    </>
  );
}
