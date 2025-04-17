import { Album, Photo } from '@polotrip/db/models';

export type PhotoUpdate = {
  id: string;
  dateTaken?: string | null;
  locationName?: string | null;
  description?: string | null;
  order?: string | null;
};

export type UpdateAlbumRequest = {
  params: {
    id: string;
  };
  body: {
    title?: string;
    description?: string | null;
    coverImageUrl?: string | null;
    isPublished?: boolean;
    photoUpdates?: PhotoUpdate[];
    currentStepAfterPayment?: string;
  };
};

export type UpdateAlbumResponse = {
  album: Album;
  photos: Photo[];
};
