import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { redirect } from '@/i18n/routing';

import { getCurrentUser } from '@/lib/auth/server';

export const metadata: Metadata = {
  title: 'Auth',
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
