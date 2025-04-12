'use client';

import { Album } from 'lucide-react';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { usePathname } from '@/i18n/routing';

export function HomeContent() {
  const pathname = usePathname();

  const isHome = pathname === `/`;

  if (!isHome) return null;

  return (
    <>
      <p className="block">Pronto para criar seus álbuns?</p>
      <ButtonNavigation href="/sign-in" className="bg-gradient-primary text-white button-shadow">
        <strong>Acessar conta</strong>
        <Album />
      </ButtonNavigation>
    </>
  );
}
