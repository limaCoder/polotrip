import type { Pagination as PaginationType } from "@/types/pagination";

type PhotoGalleryPaginationProps = {
  pagination: PaginationType;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export type { PhotoGalleryPaginationProps };
