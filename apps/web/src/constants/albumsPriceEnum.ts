import { LocaleTypesEnum } from './localesEnum';

const AlbumPriceEnum = {
  [LocaleTypesEnum.PT]: 19.9,
  [LocaleTypesEnum.EN]: 9.9,
} as const;

const AlbumStripePriceEnum = {
  [LocaleTypesEnum.PT]: 1990,
  [LocaleTypesEnum.EN]: 990,
} as const;

export { AlbumPriceEnum, AlbumStripePriceEnum };
