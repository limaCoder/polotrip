import { ButtonNavigation } from '@/components/ButtonNavigation';
import { formatCurrency } from '@/utils/formatCurrency';
import { getAlbumPrice } from '@/utils/getAlbumPrice';
import { CtaProps } from './types';

export async function Cta({ locale }: CtaProps) {
  const albumPrice = getAlbumPrice(locale);

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
          <h2 className="font-title_two mb-6 font-extrabold">
            Pronto para criar seu primeiro álbum?
          </h2>
          <p className="font-title_three mb-8">
            Por apenas <strong>{formatCurrency(locale, albumPrice)}</strong>, crie um álbum de
            viagem digital único e memorável.
          </p>
          <ButtonNavigation
            href="/sign-in"
            className="h-[60px] bg-primary text-white hover:bg-primary/90"
          >
            <span className="font-bold">Comece agora</span>
          </ButtonNavigation>
        </div>
      </div>
    </section>
  );
}
