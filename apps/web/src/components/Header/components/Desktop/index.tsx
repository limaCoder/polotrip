'use client';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { HomeContent } from './home-content';
import { DashboardContent } from './dashboard-content';
import { Link, usePathname } from '@/i18n/routing';

export function HeaderDesktop() {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith(`/dashboard`);

  const logoHref = isDashboard ? `/dashboard` : `/`;

  return (
    <div className="hidden lg:flex py-4 container relative justify-between items-center px-4">
      <Link className="cursor-pointer" href={logoHref}>
        <img src="/brand/logo.svg" alt="Logo" className="w-[150px] sm:w-full md:w-[180px]" />
      </Link>

      <div className="flex gap-4 items-center">
        <HomeContent />
        <DashboardContent />
        <LocaleSwitcher />
      </div>
    </div>
  );
}
