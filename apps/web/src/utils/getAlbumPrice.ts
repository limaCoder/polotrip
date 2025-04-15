import { AlbumPriceEnum, AlbumStripePriceEnum } from '@/constants/albumsPriceEnum';

const getAlbumPrice = (locale: string) => {
  return AlbumPriceEnum[locale as keyof typeof AlbumPriceEnum] as number;
};

const getAlbumStripePrice = (locale: string) => {
  return AlbumStripePriceEnum[locale as keyof typeof AlbumStripePriceEnum] as number;
};

export { getAlbumPrice, getAlbumStripePrice };
