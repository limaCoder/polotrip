import type { NewAlbum } from '@polotrip/db/models';

type CreateAlbumRequest = {
  body: {
    title: string;
    date: string;
    description?: string | null | undefined;
    coverImageUrl?: string | null | undefined;
  };
};

type CreateAlbumResponse = {
  album: NewAlbum;
};

export type { CreateAlbumRequest, CreateAlbumResponse };
