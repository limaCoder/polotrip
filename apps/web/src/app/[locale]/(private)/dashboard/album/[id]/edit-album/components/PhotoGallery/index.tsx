import { CheckSquare, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SkeletonList } from "@/components/SkeletonList";
import { PhotoGalleryItem } from "../PhotoGalleryItem";
import { PhotoGalleryPagination } from "../PhotoGalleryPagination";
import type { PhotoGalleryProps } from "./types";

export function PhotoGallery({
  filteredPhotos,
  isLoading = false,
  selectedDate,
  selectedPhotos,
  pagination,
  currentPage,
  getModifiedStatus,
  togglePhotoSelection,
  deselectAllPhotos,
  selectAllPhotos,
  onPageChange,
  onDeletePhotos,
}: PhotoGalleryProps) {
  const t = useTranslations("EditAlbum.PhotoGallery");
  const { locale } = useParams();

  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate)
        .toLocaleDateString(locale as string, {
          month: "long",
          year: "numeric",
        })
        .charAt(0)
        .toUpperCase() +
      new Date(selectedDate)
        .toLocaleDateString(locale as string, {
          month: "long",
          year: "numeric",
        })
        .slice(1)
    : t("no_date_defined");

  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-3">
        <h2 className="mb-1 font-bold font-title_three">{t("title")}</h2>
        <p className="font-body_two text-text/75">{t("description")}</p>
      </div>

      <div className="mb-6 flex flex-col items-startmd:items-center justify-between gap-4 md:flex-row">
        <p className="font-body_two">
          <span className="font-bold text-primary">
            {(pagination?.total || filteredPhotos.length) === 1
              ? t("photo_count_in_date_singular", {
                  count: pagination?.total || filteredPhotos.length,
                  date: formattedSelectedDate,
                })
              : t("photo_count_in_date_plural", {
                  count: pagination?.total || filteredPhotos.length,
                  date: formattedSelectedDate,
                })}
          </span>
        </p>

        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          {filteredPhotos.length > 0 && selectAllPhotos && (
            <button
              aria-label={t("select_all_aria")}
              className="flex cursor-pointer items-center gap-2 text-text/50 hover:text-text/75"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof selectAllPhotos === "function") {
                  selectAllPhotos();
                }
              }}
              type="button"
            >
              <CheckSquare size={18} />
              <span className="font-body_two">{t("select_all")}</span>
            </button>
          )}
          {selectedPhotos.length > 0 && (
            <>
              <button
                aria-label={t("clear_selection_aria")}
                className="flex cursor-pointer items-center gap-2 text-text/50 hover:text-text/75"
                onClick={deselectAllPhotos}
                type="button"
              >
                <X size={18} />
                <span className="font-body_two">{t("clear_selection")}</span>
              </button>
              <button
                aria-label={t("delete_selected_aria")}
                className="flex cursor-pointer items-center gap-2 text-red-500 hover:text-red-600"
                onClick={onDeletePhotos}
                type="button"
              >
                <Trash2 size={18} />
                <span className="font-body_two">{t("delete_selected")}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredPhotos?.map((photo) => {
          const isModified = getModifiedStatus(photo?.id);
          const isSelected = selectedPhotos?.includes(photo?.id);

          return (
            <PhotoGalleryItem
              isModified={isModified}
              isSelected={isSelected}
              key={photo?.id}
              photo={photo}
              togglePhotoSelection={togglePhotoSelection}
            />
          );
        })}

        {isLoading && (
          <div className="col-span-full">
            <SkeletonList
              className="h-[200px] w-[200px] rounded-sm"
              count={5}
            />
          </div>
        )}

        {filteredPhotos?.length === 0 && (
          <div className="col-span-full py-12 text-center text-text/50">
            {t("no_photos_for_date")}
          </div>
        )}
      </div>

      {pagination && (
        <PhotoGalleryPagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          pagination={pagination}
        />
      )}
    </div>
  );
}
