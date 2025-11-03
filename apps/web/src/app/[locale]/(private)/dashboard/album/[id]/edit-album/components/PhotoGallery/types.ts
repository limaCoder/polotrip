import type { Photo } from "@polotrip/db/models";
import type { Pagination as PaginationType } from "@/types/pagination";

type PhotoGalleryProps = {
  filteredPhotos: Photo[];
  isLoading: boolean;
  selectedDate: string | null;
  selectedPhotos: string[];
  pagination: PaginationType | null;
  currentPage: number;
  getModifiedStatus: (photoId: string) => boolean;
  togglePhotoSelection: (photoId: string) => void;
  deselectAllPhotos: () => void;
  onPageChange: (page: number) => void;
  onDeletePhotos: () => void;
};

export type { PhotoGalleryProps };
