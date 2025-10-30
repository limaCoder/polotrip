import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AuthLayout.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: 'https://polotrip.com/opengraph-image',
          width: 1200,
          height: 630,
          alt: t('og_alt'),
        },
      ],
    },
  };
}

export default async function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
