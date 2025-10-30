import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="py-8">
      <div className="container mx-auto lg:px-9 px-4 flex flex-col lg:flex-row gap-4 justify-between text-center lg:text-left">
        <div className="flex flex-col justify-center items-center lg:items-start">
          <Image src="/brand/logo.svg" alt={t('logo_alt')} width={150} height={150} />
          <p className="font-body_two mt-1">{t('copyright')}</p>
          <p className="font-body_two mt-1">
            {t('made_by')}
            <a
              href="https://marioaugustolima.com.br/"
              target="_blank"
              title="Mario Lima"
              className="ml-1"
              rel="noreferrer"
            >
              Mario Lima
            </a>
          </p>
        </div>
        <div className="flex flex-col">
          <p className="font-body_one font-bold">{t('legal')}</p>
          <Link href="/terms-of-use" className="font-body_one text-primary mt-2">
            {t('terms_of_use')}
          </Link>
          <Link href="/privacy-policy" className="font-body_one text-primary mt-1">
            {t('privacy_policy')}
          </Link>
          <a href="" className="font-body_one text-primary mt-1">
            {t('cnpj')}
          </a>
        </div>
      </div>
    </footer>
  );
}
