import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Image src="/brand/logo.svg" alt={t('logo_alt')} width={400} height={200} />
      <h1 className="text-2xl mt-4">{t('title')}</h1>
      <p className="text-sm mt-2">{t('description')}</p>
      <Link href="/" className="text-sm mt-4 text-primary font-bold hover:underline">
        {t('back_to_home')}
      </Link>
    </main>
  );
}
