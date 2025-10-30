import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function BackButton() {
  const t = await getTranslations('CreateAlbum');

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 font-body_one hover:text-primary transition-colors"
    >
      <ArrowLeft size={24} />
      <span>{t('back_button')}</span>
    </Link>
  );
}
