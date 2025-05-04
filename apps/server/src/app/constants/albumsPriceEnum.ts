import { CurrencyEnum } from './currencyEnum';

const AlbumStripePriceEnum = {
  [CurrencyEnum.BRL]: 1990,
  [CurrencyEnum.USD]: 990,
} as const;

export { AlbumStripePriceEnum };
