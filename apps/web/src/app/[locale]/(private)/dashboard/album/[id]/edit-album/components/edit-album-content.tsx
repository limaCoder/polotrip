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
import {
  PhotoGallerySkeleton,
  PhotoMapSkeleton,
  PhotoTimelineSkeleton,
} from "./skeletons";
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
    selectAllPhotos,
    openFinishDialog,
    closeFinishDialog,
    openDeleteDialog,
    closeDeleteDialog,
    closeUnsavedChangesDialog,
    closeUndatedPhotosDialog,
  } = useEditAlbum();

  const isGlobalLoading =
    isUpdatingPhoto ||
    isUpdatingPhotoBatch ||
    isDeletingPhotos ||
    isPublishingAlbum;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-primary border-b-4 shadow-[0_0_15px_rgba(41,128,185,0.5)]" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2.5fr] xl:grid-cols-[1fr_3fr]">
        <div className="flex flex-col gap-8">
          {isLoading ? (
            <PhotoTimelineSkeleton />
          ) : (
            <PhotoTimeline
              dates={albumDates}
              onSelectDate={handleDateSelect}
              selectedDate={selectedDate}
            />
          )}

          {isLoading ? (
            <PhotoMapSkeleton />
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-background/20 bg-background/40 p-6 shadow-xl backdrop-blur-xl transition-all duration-300">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="font-bold font-title_three text-xl tracking-tight">
                    {t("map_title")}
                  </h2>
                  <p className="mt-1 font-body_two text-sm text-text/70">
                    {t("map_description")}
                  </p>
                </div>
              </div>

              <div className="h-[300px] w-full overflow-hidden rounded-md">
                <PhotoMap
                  onMarkerClick={handlePhotoClick}
                  photos={filteredPhotos}
                />
              </div>
            </div>
          )}

          <AlbumDetailsCard />

          <MusicCard />

          <AddMorePhotosCard />
        </div>

        <div className="flex flex-col gap-8">
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

          {isPhotosLoading ? (
            <PhotoGallerySkeleton />
          ) : (
            <PhotoGallery
              currentPage={currentPage}
              deselectAllPhotos={deselectAllPhotos}
              filteredPhotos={filteredPhotos}
              getModifiedStatus={getModifiedStatus}
              isLoading={isPhotosLoading}
              onDeletePhotos={openDeleteDialog}
              onPageChange={handlePageChange}
              pagination={photoPagination}
              selectAllPhotos={selectAllPhotos}
              selectedDate={selectedDate}
              selectedPhotos={selectedPhotos}
              togglePhotoSelection={togglePhotoSelection}
            />
          )}

          <div className="flex justify-end pt-4">
            <Button
              aria-label={t("publish_album_button_aria")}
              className={cn(
                "group hover:-translate-y-0.5 relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-primary px-10 py-6 font-body_one font-semibold text-white shadow-[0_4px_14px_0_rgba(41,128,185,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(41,128,185,0.23)]",
                isGlobalLoading && "pointer-events-none opacity-80"
              )}
              disabled={isGlobalLoading}
              onClick={openFinishDialog}
            >
              <div className="absolute inset-0 z-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              {isGlobalLoading ? (
                <div className="relative z-10 flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-white/30 border-t-2 border-b-white" />
                  <span>{t("publishing_album_button")}</span>
                </div>
              ) : (
                <span className="relative z-10">
                  {t("publish_album_button")}
                </span>
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
