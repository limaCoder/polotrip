import type { Photo } from "@polotrip/db/models";
import type { Pagination } from "@/types/pagination";

export type DateCount = {
  date: string | null;
  count: number;
};

export type GetPhotosByDateRequest = {
  params: {
    albumId: string;
  };
  query?: {
    date?: string;
    noDate?: boolean;
    page?: number;
    limit?: number;
  };
};

export type GetPhotosByDateResponse = {
  photos: Photo[];
  pagination: Pagination;
};
