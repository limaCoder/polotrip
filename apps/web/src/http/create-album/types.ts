import type { NewAlbum } from '@polotrip/db/models';
import { AlbumPlan } from '@/constants/pricingEnum';

type CreateAlbumRequest = {
  body: {
    title: string;
    date: string;
    description?: string | null | undefined;
    coverImageUrl?: string | null | undefined;
    plan: AlbumPlan;
  };
};

type CreateAlbumResponse = {
  album: NewAlbum;
};

export type { CreateAlbumRequest, CreateAlbumResponse };
