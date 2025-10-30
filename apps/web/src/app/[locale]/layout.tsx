import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Providers from '@/app/providers';
import '@/styles/globals.css';
import { fontEpilogueVariable } from '@/styles/fonts';

import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/types';
import { cn } from '@/lib/cn';
import { Toaster } from '@/components/ui/sooner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RootLayout' });

  return {
    title: t('title'),
    description: t('description'),
    authors: {
      name: 'Polotrip',
    },
    creator: 'Polotrip',
    category: 'photo-sharing',
    keywords: t('keywords'),
    icons: {
      icon: '/brand/favicon.ico',
    },
    openGraph: {
      type: 'website',
      siteName: 'Polotrip',
      description: t('description'),
      title: t('title'),
      url: 'https://polotrip.com',
      images: [
        {
          url: 'https://polotrip.com/opengraph-image',
          alt: t('og_alt'),
        },
      ],
    },
  };
}

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
