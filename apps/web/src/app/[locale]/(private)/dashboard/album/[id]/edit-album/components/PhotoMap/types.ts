import type { Photo } from "@polotrip/db/models";

type PhotoMapProps = {
  photos: Photo[];
  onMarkerClick?: (photoId: string) => void;
};

export type { PhotoMapProps };
