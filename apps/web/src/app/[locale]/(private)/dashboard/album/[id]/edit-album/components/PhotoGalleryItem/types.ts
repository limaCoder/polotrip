import type { Photo } from "@polotrip/db/models";

type PhotoGalleryItemProps = {
  photo: Photo;
  isSelected: boolean;
  isModified: boolean;
  togglePhotoSelection: (photoId: string) => void;
};

export type { PhotoGalleryItemProps };
