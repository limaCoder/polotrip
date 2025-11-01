import { formatCurrency } from '@/utils/formatCurrency';
import { getAlbumPrice } from '@/utils/getAlbumPrice';
import { CtaProps } from './types';
import { PricingEnum } from '@/constants/pricingEnum';
import { getTranslations } from 'next-intl/server';
import { CtaButton } from './cta-button';

export async function Cta({ locale }: CtaProps) {
  const t = await getTranslations('Home.Cta');
  const albumPrice = getAlbumPrice(PricingEnum.BASIC, locale);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 w-full h-full z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/pages/home/cta/cta-section.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="container px-4 lg:px-9 relative z-10">
        <div className="flex flex-col items-center text-center text-white">
          <h2 className="font-title_two mb-6 font-extrabold">{t('title')}</h2>
          <p className="font-title_three mb-8">
            {t.rich('description', {
              price: _price => <strong>{formatCurrency(locale, albumPrice)}</strong>,
            })}
          </p>
          <CtaButton
            buttonText={t('start_now_button')}
            buttonAria={t('start_now_button_aria')}
            locale={locale}
            price={albumPrice}
          />
        </div>
      </div>
    </section>
  );
}
