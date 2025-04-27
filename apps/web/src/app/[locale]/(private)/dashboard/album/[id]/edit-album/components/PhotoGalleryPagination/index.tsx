import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { type PhotoGalleryPaginationProps } from './types';

export function PhotoGalleryPagination({
  pagination,
  currentPage,
  onPageChange,
}: PhotoGalleryPaginationProps) {
  return (
    <div className="mt-6">
      <Pagination className="justify-end">
        <PaginationContent>
          {pagination.hasPrevPage && (
            <PaginationItem className="hover:bg-primary/10 transition-colors">
              <PaginationPrevious
                className="hover:bg-primary/10 transition-colors"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
          )}

          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const pageNumber = i + 1;

            if (
              pageNumber === 1 ||
              pageNumber === pagination.totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber} className="hover:bg-primary/10 transition-colors">
                  <PaginationLink
                    className="hover:bg-primary/10 transition-colors"
                    href="#"
                    isActive={pageNumber === currentPage}
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (
              (pageNumber === 2 && currentPage > 3) ||
              (pageNumber === pagination.totalPages - 1 && currentPage < pagination.totalPages - 2)
            ) {
              return <PaginationEllipsis key={pageNumber} />;
            }

            return null;
          })}

          {pagination.hasNextPage && (
            <PaginationItem className="hover:bg-primary/10 transition-colors">
              <PaginationNext
                className="hover:bg-primary/10 transition-colors"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
