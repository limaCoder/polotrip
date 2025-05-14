import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Providers from '@/app/providers';
import '@/styles/globals.css';
import { fontEpilogueVariable } from '@/styles/fonts';

import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/types';
import { cn } from '@/lib/cn';
import { Toaster } from '@/components/ui/sooner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: 'Polotrip | Fotos e Memórias de Viagens',
  description:
    'Polotrip é uma plataforma para compartilhar fotos e memórias de viagens, permitindo organizar álbuns e compartilhar momentos especiais.',
  authors: {
    name: 'Polotrip',
  },
  creator: 'Polotrip',
  category: 'photo-sharing',
  keywords: 'fotos, viagens, álbuns, memórias, fotografia, compartilhamento, timeline, turismo',
  icons: {
    icon: '/brand/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'Polotrip',
    description:
      'Polotrip é uma plataforma para compartilhar fotos e memórias de viagens, permitindo organizar álbuns e compartilhar momentos especiais.',
    title: 'Polotrip | Fotos e Memórias de Viagens',
    url: 'https://polotrip.com',
    images: [
      {
        url: 'https://polotrip.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Polotrip - Fotos e Memórias de Viagens',
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <body className={cn(fontEpilogueVariable, 'antialiased font-epilogue')}>
          <Providers>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
          <Toaster />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
