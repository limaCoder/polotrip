import { AlbumStripePriceEnum } from '@/app/constants/albumsPriceEnum';

const getAlbumStripePrice = (currency: string) => {
  return AlbumStripePriceEnum[currency as keyof typeof AlbumStripePriceEnum] as number;
};

export { getAlbumStripePrice };
