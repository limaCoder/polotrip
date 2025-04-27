import { type Photo } from '@polotrip/db/models';

interface PhotoGalleryItemProps {
  photo: Photo;
  isSelected: boolean;
  isModified: boolean;
  togglePhotoSelection: (photoId: string) => void;
}

export type { PhotoGalleryItemProps };
