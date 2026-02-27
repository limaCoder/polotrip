export type ChatPhotoDisplayProps = {
  data: unknown;
};

export type AlbumLike = {
  id: string;
  title: string;
  date?: string;
  createdAt?: string;
  coverImageUrl?: string;
  photoCount?: number;
  isPublished?: boolean;
};

export type PhotoLike = {
  id: string;
  thumbnailUrl?: string;
  imageUrl: string;
  description?: string;
  locationName?: string;
};

export type AlbumsGridProps = {
  albums: unknown;
};

export type AlbumWithPhotosProps = {
  data: unknown;
};

export type PhotosWithContextProps = {
  data: unknown;
};

export type SearchResultsProps = {
  data: unknown;
};

export type TripStatsProps = {
  data: unknown;
};
