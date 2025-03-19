'use client';

import { ButtonNavigation } from '@/components/ButtonNavigation';
import { Album } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function HomeContent() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (!isHome) return null;

  return (
    <>
      <p className="block">Pronto para criar seus álbuns?</p>
      <ButtonNavigation href="/login" className="bg-gradient-primary text-white">
        <strong>Acessar conta</strong>
        <Album />
      </ButtonNavigation>
    </>
  );
}
