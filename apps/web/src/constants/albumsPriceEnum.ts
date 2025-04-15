import { LocaleTypesEnum } from './localesEnum';

const AlbumPriceEnum = {
  [LocaleTypesEnum.PT]: 19.99,
  [LocaleTypesEnum.EN]: 9.99,
} as const;

const AlbumStripePriceEnum = {
  [LocaleTypesEnum.PT]: 1999,
  [LocaleTypesEnum.EN]: 999,
} as const;

export { AlbumPriceEnum, AlbumStripePriceEnum };
