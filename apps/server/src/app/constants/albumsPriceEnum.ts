import { CurrencyEnum } from './currencyEnum';

const AlbumStripePriceEnum = {
  [CurrencyEnum.BRL]: 1999,
  [CurrencyEnum.USD]: 999,
} as const;

export { AlbumStripePriceEnum };
