import { getTranslations } from "next-intl/server";
import { PricingEnum } from "@/constants/pricingEnum";
import { formatCurrency } from "@/utils/formatCurrency";
import { getAlbumPrice } from "@/utils/getAlbumPrice";
import { CtaButton } from "./cta-button";
import type { CtaProps } from "./types";

export async function Cta({ locale }: CtaProps) {
  const t = await getTranslations("Home.Cta");
  const albumPrice = getAlbumPrice(PricingEnum.BASIC, locale);

  return (
    <section className="relative flex items-center justify-center overflow-hidden py-8 sm:py-10 lg:py-20">
      <div className="absolute inset-4 z-0 overflow-hidden rounded-2xl border border-white/20 bg-background shadow-2xl lg:inset-8">
        <video
          autoPlay
          className="h-full w-full scale-105 object-cover"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/pages/home/cta/cta-section.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E\')',
          }}
        />
      </div>

      <div className="container relative z-10 px-6 py-12 sm:py-20 lg:px-9">
        <div className="flex flex-col items-center text-center text-white">
          <h2 className="mb-4 font-bold font-heading text-3xl text-white tracking-tight sm:mb-6 lg:text-7xl">
            {t("title")}
          </h2>
          <p className="mb-8 max-w-2xl font-body_one text-base text-white/90 sm:mb-12 lg:text-xl">
            {t.rich("description", {
              price: (_price) => (
                <strong>{formatCurrency(locale, albumPrice)}</strong>
              ),
            })}
          </p>
          <CtaButton
            buttonAria={t("start_now_button_aria")}
            buttonText={t("start_now_button")}
            locale={locale}
            price={albumPrice}
          />
        </div>
      </div>
    </section>
  );
}
