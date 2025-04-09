import type { Album } from '@polotrip/db/models';
import type { Pagination } from '@/types/pagination';

type GetAlbumsRequest = {
  params: {
    page: number;
    limit: number;
  };
  signal: AbortSignal;
};

type GetAlbumsResponse = {
  albums: Album[];
  pagination: Pagination;
};

export type { GetAlbumsRequest, GetAlbumsResponse };
