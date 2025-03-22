'use client';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { HomeContent } from './home-content';
import { DashboardContent } from './dashboard-content';
import { useParams, usePathname } from 'next/navigation';

export function HeaderDesktop() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale;

  const isDashboard = pathname === `/${locale}/dashboard`;

  const logoHref = isDashboard ? `/${locale}/dashboard` : `/${locale}`;

  return (
    <div className="hidden lg:flex py-4 container relative justify-between items-center px-4">
      <a className="cursor-pointer" href={logoHref}>
        <img src="/brand/logo.svg" alt="Logo" className="w-[150px] sm:w-full md:w-[180px]" />
      </a>

      <div className="flex gap-4 items-center">
        <HomeContent />
        <DashboardContent />
        <LocaleSwitcher />
      </div>
    </div>
  );
}
