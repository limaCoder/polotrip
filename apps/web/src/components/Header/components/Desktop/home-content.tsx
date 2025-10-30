'use client';

import { Album } from 'lucide-react';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { cn } from '@/lib/cn';
import { HomeContentProps } from '../../types';
import { useTranslations } from 'next-intl';

export function HomeContent({ isHome: isHomeFromParent = false }: HomeContentProps) {
  const t = useTranslations('Header');

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
      >
        <span className="font-bold">{t('access_account')}</span>
        <Album />
      </ButtonNavigation>
    </>
  );
}
