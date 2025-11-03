import type { useTranslations } from "next-intl";
import {
  AlbumPriceEnum,
  AlbumStripePriceEnum,
} from "@/constants/albumsPriceEnum";
import type { AlbumPlan } from "@/constants/pricingEnum";

const getAlbumPrice = (plan: string, locale: string) => {
  return AlbumPriceEnum[plan as keyof typeof AlbumPriceEnum]?.[
    locale as keyof (typeof AlbumPriceEnum)[keyof typeof AlbumPriceEnum]
  ] as number;
};

const getAlbumStripePrice = (plan: string, locale: string) => {
  return AlbumStripePriceEnum[plan as keyof typeof AlbumStripePriceEnum]?.[
    locale as keyof (typeof AlbumStripePriceEnum)[keyof typeof AlbumStripePriceEnum]
  ] as number;
};

const getPlanName = (
  plan: AlbumPlan,
  t: ReturnType<typeof useTranslations<"PlanNames">>
) => {
  const names = {
    basic: t("basic"),
    standard: t("standard"),
    premium: t("premium"),
  };
  return names[plan];
};

const getPlanPhotoLimit = (plan: AlbumPlan) => {
  const limits = {
    basic: 50,
    standard: 100,
    premium: 150,
  };
  return limits[plan];
};

export { getAlbumPrice, getAlbumStripePrice, getPlanName, getPlanPhotoLimit };
