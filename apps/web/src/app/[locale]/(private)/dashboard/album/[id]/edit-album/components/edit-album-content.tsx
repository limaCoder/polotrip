"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useEditAlbum } from "../hooks/useEditAlbum";
import { AddMorePhotosCard } from "./AddMorePhotosCard";
import { AlbumDetailsCard } from "./AlbumDetailsCard";
import { DeletePhotosDialog } from "./DeletePhotosDialog";
import { FinishEditDialog } from "./FinishEditDialog";
import { MusicCard } from "./MusicCard";
import { PhotoEditForm } from "./PhotoEditForm";
import { PhotoGallery } from "./PhotoGallery";
import { PhotoMap } from "./PhotoMap";
import { PhotoTimeline } from "./PhotoTimeline";
import { UndatedPhotosDialog } from "./UndatedPhotosDialog";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";

export function EditAlbumContent() {
  const t = useTranslations("EditAlbum");

  const {
    albumDates,
    selectedDate,
    filteredPhotos,
    selectedPhotos,
    isLoading,
    isPhotosLoading,
    error,
    photoPagination,
    currentPage,
    isFinishDialogOpen,
    isDeleteDialogOpen,
    isUndatedPhotosDialogOpen,
    isUnsavedChangesDialogOpen,
    isDeletingPhotos,
    isUpdatingPhoto,
    isUpdatingPhotoBatch,
    isPublishingAlbum,
    form,

    handleDateSelect,
    handlePhotoClick,
    handleSavePhotoEdit,
    handleSaveBatchEdit,
    handleFinish,
    handleCancelEdit,
    handlePageChange,
    handleDeletePhotos,
    handleUnsavedChanges,
    getModifiedStatus,
    togglePhotoSelection,
    deselectAllPhotos,
    openFinishDialog,
    closeFinishDialog,
    openDeleteDialog,
    closeDeleteDialog,
    closeUnsavedChangesDialog,
    closeUndatedPhotosDialog,
  } = useEditAlbum();

  const isGlobalLoading =
    isLoading ||
    isUpdatingPhoto ||
    isUpdatingPhotoBatch ||
    isDeletingPhotos ||
    isPublishingAlbum;

  if (isLoading) {
    return (
      <div className="my-12 flex justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      {isGlobalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="h-16 w-16 animate-spin rounded-full border-primary border-b-4" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1fr_3fr]">
        <div className="flex flex-col gap-9">
          <PhotoTimeline
            dates={albumDates}
            onSelectDate={handleDateSelect}
            selectedDate={selectedDate}
          />

          <div className="rounded-lg bg-card p-8 shadow">
            <div className="mb-3 flex items-center gap-3">
              <MapPin className="text-primary" size={24} />
              <h2 className="font-bold font-title_three">{t("map_title")}</h2>
            </div>

            <p className="mb-6 font-body_two text-text/75">
              {t("map_description")}
            </p>

            <div className="h-[300px] w-full overflow-hidden rounded-md">
              <PhotoMap
                onMarkerClick={handlePhotoClick}
                photos={filteredPhotos}
              />
            </div>
          </div>

          <AlbumDetailsCard />

          <MusicCard />

          <AddMorePhotosCard />
        </div>

        <div className="flex flex-col gap-9">
          <PhotoEditForm
            deselectAllPhotos={deselectAllPhotos}
            isDisabled={selectedPhotos?.length === 0}
            onCancel={handleCancelEdit}
            onSave={
              selectedPhotos?.length > 1
                ? handleSaveBatchEdit
                : handleSavePhotoEdit
            }
            selectedPhotos={filteredPhotos?.filter((photo) =>
              selectedPhotos?.includes(photo?.id)
            )}
          />

          <PhotoGallery
            currentPage={currentPage}
            deselectAllPhotos={deselectAllPhotos}
            filteredPhotos={filteredPhotos}
            getModifiedStatus={getModifiedStatus}
            isLoading={isPhotosLoading}
            onDeletePhotos={openDeleteDialog}
            onPageChange={handlePageChange}
            pagination={photoPagination}
            selectedDate={selectedDate}
            selectedPhotos={selectedPhotos}
            togglePhotoSelection={togglePhotoSelection}
          />

          <div className="flex justify-end">
            <Button
              aria-label={t("publish_album_button_aria")}
              className={cn(
                "flex items-center gap-2 rounded bg-primary px-8 py-3 font-body_two text-background hover:bg-primary/90",
                isLoading && "cursor-not-allowed opacity-50"
              )}
              disabled={isLoading}
              onClick={openFinishDialog}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                  <span>{t("publishing_album_button")}</span>
                </>
              ) : (
                <span>{t("publish_album_button")}</span>
              )}
            </Button>
          </div>
        </div>

        <FinishEditDialog
          isOpen={isFinishDialogOpen}
          onClose={closeFinishDialog}
          onConfirm={handleFinish}
        />

        <DeletePhotosDialog
          isDeleting={isDeletingPhotos}
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeletePhotos}
          photoCount={selectedPhotos.length}
        />

        <UnsavedChangesDialog
          isOpen={isUnsavedChangesDialogOpen}
          onClose={closeUnsavedChangesDialog}
          onConfirm={handleUnsavedChanges}
        />

        <UndatedPhotosDialog
          isOpen={isUndatedPhotosDialogOpen}
          onClose={closeUndatedPhotosDialog}
        />
      </div>
    </FormProvider>
  );
}
