import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('Homepage');

  return (
    <div className="min-h-screen">
      <h1>{t('title')}</h1>
      <p>{t('content')}</p>
    </div>
  );
}
