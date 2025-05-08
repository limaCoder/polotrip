import { CurrencyEnum } from './currencyEnum';
import { PricingEnum } from './pricingEnum';

const AlbumStripePriceEnum = {
  [PricingEnum.BASIC]: {
    [CurrencyEnum.BRL]: 1290,
    [CurrencyEnum.USD]: 590,
  },
  [PricingEnum.STANDARD]: {
    [CurrencyEnum.BRL]: 1990,
    [CurrencyEnum.USD]: 990,
  },
  [PricingEnum.PREMIUM]: {
    [CurrencyEnum.BRL]: 2490,
    [CurrencyEnum.USD]: 1290,
  },
} as const;

export { AlbumStripePriceEnum };
