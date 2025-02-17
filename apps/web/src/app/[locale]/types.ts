import { Locale } from '@/i18n/types';

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>;

export type { RootLayoutProps };
