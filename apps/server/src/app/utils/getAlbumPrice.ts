import { AlbumStripePriceEnum } from '@/app/constants/albumsPriceEnum';

const getAlbumStripePrice = (plan: string, currency: string) => {
  return AlbumStripePriceEnum[plan as keyof typeof AlbumStripePriceEnum]?.[
    currency as keyof (typeof AlbumStripePriceEnum)[keyof typeof AlbumStripePriceEnum]
  ] as number;
};

export { getAlbumStripePrice };
