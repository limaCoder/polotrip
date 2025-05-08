import { LocaleTypesEnum } from './localesEnum';
import { PricingEnum } from './pricingEnum';

const AlbumPriceEnum = {
  [PricingEnum.BASIC]: {
    [LocaleTypesEnum.PT]: 12.9,
    [LocaleTypesEnum.EN]: 5.9,
  },
  [PricingEnum.STANDARD]: {
    [LocaleTypesEnum.PT]: 19.9,
    [LocaleTypesEnum.EN]: 9.9,
  },
  [PricingEnum.PREMIUM]: {
    [LocaleTypesEnum.PT]: 24.9,
    [LocaleTypesEnum.EN]: 12.9,
  },
} as const;

const AlbumStripePriceEnum = {
  [PricingEnum.BASIC]: {
    [LocaleTypesEnum.PT]: 1290,
    [LocaleTypesEnum.EN]: 590,
  },
  [PricingEnum.STANDARD]: {
    [LocaleTypesEnum.PT]: 1990,
    [LocaleTypesEnum.EN]: 990,
  },
  [PricingEnum.PREMIUM]: {
    [LocaleTypesEnum.PT]: 2490,
    [LocaleTypesEnum.EN]: 1290,
  },
} as const;

export { AlbumPriceEnum, AlbumStripePriceEnum };
