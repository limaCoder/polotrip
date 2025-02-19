import { Button } from '@/components/Button';
import { getTranslations } from 'next-intl/server';

export async function Hero() {
  const t = await getTranslations('Homepage');

  return (
    <section className="py-10">
      <div className="flex-col lg:flex-row container mx-auto flex justify-center w-full relative items-center px-4 lg:px-9">
        <div className="lg:w-1/2 flex flex-col text-center lg:text-left">
          <h1 className="font-heading text-gradient-primary">{t('title')}</h1>
          <p className="mt-6 font-title_three">{t('content')}</p>
          <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
            <Button text="Como funciona?" href={''} className="bg-primary text-white shadow-md" />
            <Button text="Comece agora" href={''} className="bg-yellow text-black shadow-md" />
          </div>
        </div>
        <div className="flex flex-col items-center w-full lg:w-1/2 lg:mt-0 mt-12">
          <img src="/img/hero-photos.png" alt="" className="w-2/3 2xl:w-2/3" />
        </div>
      </div>
    </section>
  );
}
