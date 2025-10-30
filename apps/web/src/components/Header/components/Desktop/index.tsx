'use client';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { HomeContent } from './home-content';
import { DashboardContent } from '../../dashboard-content';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { HeaderDesktopProps } from '../../types';
import { useTranslations } from 'next-intl';

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderDesktop({ isHome }: HeaderDesktopProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith(`/dashboard`);

  const logoHref = isDashboard ? `/dashboard` : `/`;
  const logoSrc = isHome ? '/brand/logo-white.svg' : '/brand/logo.svg';

  return (
    <div className="hidden lg:flex py-4 container relative justify-between items-center px-4">
      <Link className="cursor-pointer" href={logoHref}>
        <Image
          src={logoSrc}
          alt={t('logo_alt')}
          width={180}
          height={40}
          sizes="(max-width: 768px) 150px, 180px"
          priority
        />
      </Link>

      <div className="flex gap-4 items-center">
        <HomeContent isHome={isHome} />
        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher />}
        <DashboardContent />
      </div>
    </div>
  );
}
