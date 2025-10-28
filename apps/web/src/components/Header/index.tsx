'use client';

import { HeaderDesktop } from './components/Desktop';
import { HeaderMobile } from './components/Mobile';
import { usePathname } from '@/i18n/routing';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header
      className={cn(
        'w-full z-50',
        isHome
          ? 'fixed bg-transparent shadow-none lg:absolute'
          : 'fixed lg:relative bg-background shadow-md',
      )}
    >
      <HeaderDesktop isHome={isHome} />
      <HeaderMobile />
    </header>
  );
}
