import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('Homepage');

  return (
    <div className="min-h-screen">
      <div className="container w-full items-center justify-center">
        <h1>{t('title')}</h1>
        <p>{t('content')}</p>
        <LocaleSwitcher />
      </div>
    </div>
  );
}
