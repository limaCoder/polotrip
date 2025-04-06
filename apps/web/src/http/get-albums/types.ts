import type { Album } from '@polotrip/db/models';

type GetAlbumsResponse = {
  albums: Album[];
};

export type { GetAlbumsResponse };
