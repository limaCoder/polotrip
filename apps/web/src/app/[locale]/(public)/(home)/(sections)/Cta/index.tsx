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
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 z-0 h-full w-full">
        <video
          autoPlay
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/pages/home/cta/cta-section.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="container relative z-10 px-4 lg:px-9">
        <div className="flex flex-col items-center text-center text-white">
          <h2 className="mb-6 font-extrabold font-title_two">{t("title")}</h2>
          <p className="mb-8 font-title_three">
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
