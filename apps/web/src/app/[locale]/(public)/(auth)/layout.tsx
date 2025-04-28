import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { redirect } from '@/i18n/routing';

import { getCurrentUser } from '@/lib/auth/server';

export const metadata: Metadata = {
  title: 'Acesso à plataforma | Polotrip',
  description:
    'Faça login ou crie sua conta na Polotrip para começar a compartilhar suas memórias de viagem.',
  keywords: 'login, cadastro, acesso, conta, polotrip, álbuns, fotos, viagens',
  openGraph: {
    title: 'Acesso à plataforma | Polotrip',
    description:
      'Faça login ou crie sua conta na Polotrip para começar a compartilhar suas memórias de viagem.',
    images: [
      {
        url: 'https://polotrip.com/openGraph/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;

  const user = await getCurrentUser();

  if (user) {
    redirect({ href: '/dashboard', locale });
  }

  return <>{children}</>;
}
