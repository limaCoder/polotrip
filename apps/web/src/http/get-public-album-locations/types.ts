type GetPublicAlbumLocationsRequest = {
  albumId: string;
  signal?: AbortSignal;
};

type Location = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  dateTaken: string | null;
  imageUrl: string;
};

type GetPublicAlbumLocationsResponse = {
  locations: Location[];
};

export type { GetPublicAlbumLocationsRequest, GetPublicAlbumLocationsResponse, Location };
