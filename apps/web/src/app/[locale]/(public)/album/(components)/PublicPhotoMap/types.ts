type Location = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  dateTaken: string | null;
  imageUrl: string;
};

type PublicPhotoMapProps = {
  locationsPromise: Promise<{ locations: Location[] }>;
};

export type { Location, PublicPhotoMapProps };
