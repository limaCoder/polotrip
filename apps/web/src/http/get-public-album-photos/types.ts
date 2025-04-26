type GetPublicAlbumPhotosRequest = {
  albumId: string;
  date: string;
  cursor?: string;
  limit?: number;
  signal?: AbortSignal;
};

type Photo = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  dateTaken: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  order: string | null;
};

type GetPublicAlbumPhotosResponse = {
  photos: Photo[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export type { GetPublicAlbumPhotosRequest, GetPublicAlbumPhotosResponse, Photo };
