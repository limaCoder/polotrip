import { ReactNode } from 'react';
import type { Metadata } from 'next';

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

export default async function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
