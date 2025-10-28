'use client';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { HomeContent } from './home-content';
import { DashboardContent } from '../../dashboard-content';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { HeaderDesktopProps } from '../../types';

const IS_INTERNATIONALIZATION_ENABLED = false;

export function HeaderDesktop({ isHome }: HeaderDesktopProps) {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith(`/dashboard`);

  const logoHref = isDashboard ? `/dashboard` : `/`;
  const logoSrc = isHome ? '/brand/logo-white.svg' : '/brand/logo.svg';

  return (
    <div className="hidden lg:flex py-4 container relative justify-between items-center px-4">
      <Link className="cursor-pointer" href={logoHref}>
        <Image
          src={logoSrc}
          alt="Logo"
          width={180}
          height={40}
          sizes="(max-width: 768px) 150px, 180px"
          priority
        />
      </Link>

      <div className="flex gap-4 items-center">
        <HomeContent isHome={isHome} />
        <DashboardContent />
        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher />}
      </div>
    </div>
  );
}
