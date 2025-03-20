'use client';

import { ButtonNavigation } from '@/components/ButtonNavigation';
import { Album } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

export function HomeContent() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale;

  const isHome = pathname === `/${locale}`;

  if (!isHome) return null;

  return (
    <>
      <p className="block">Pronto para criar seus álbuns?</p>
      <ButtonNavigation href="/login" className="bg-gradient-primary text-white button-shadow">
        <strong>Acessar conta</strong>
        <Album />
      </ButtonNavigation>
    </>
  );
}
