import { type Photo } from '@polotrip/db/models';

interface PhotoMapProps {
  photos: Photo[];
  onMarkerClick?: (photoId: string) => void;
}

export type { PhotoMapProps };
