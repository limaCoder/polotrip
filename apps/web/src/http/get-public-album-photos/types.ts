type GetPublicAlbumPhotosRequest = {
  albumId: string;
  cursor?: string;
  limit?: number;
  signal?: AbortSignal;
};

type Photo = {
  id: string;
  imageUrl: string;
  dateTaken: string | null;
  description: string | null;
  locationName: string | null;
  order: string | null;
};

type TimelineEvent = {
  date: string;
  photos: Photo[];
};

type GetPublicAlbumPhotosResponse = {
  timelineEvents: TimelineEvent[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export type { GetPublicAlbumPhotosRequest, GetPublicAlbumPhotosResponse, Photo, TimelineEvent };
