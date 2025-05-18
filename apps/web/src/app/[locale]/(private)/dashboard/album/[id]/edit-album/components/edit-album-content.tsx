'use client';

import { MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';

import { Button } from '@/components/ui/button';
import { PhotoTimeline } from './PhotoTimeline';
import { PhotoMap } from './PhotoMap';
import { PhotoEditForm } from './PhotoEditForm';
import { PhotoGallery } from './PhotoGallery';
import { FinishEditDialog } from './FinishEditDialog';
import { DeletePhotosDialog } from './DeletePhotosDialog';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { AddMorePhotosCard } from './AddMorePhotosCard';
import { UndatedPhotosDialog } from './UndatedPhotosDialog';

import { useEditAlbum } from '../hooks/useEditAlbum';
import { FormProvider } from 'react-hook-form';
import { AlbumDetailsCard } from './AlbumDetailsCard';

export function EditAlbumContent() {
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

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 mb-4">
        {error}
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-9">
        <div className="flex flex-col gap-9">
          <PhotoTimeline
            dates={albumDates}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />

          <div className="bg-background p-8 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <MapPin size={24} className="text-primary" />
              <h2 className="font-title_three font-bold">Mapa</h2>
            </div>

            <p className="font-body_two text-text/75 mb-6">
              Selecione os momentos da viagem e verifique a localização abaixo no mapa.
            </p>

            <div className="w-full h-[300px] overflow-hidden rounded-md">
              <PhotoMap photos={filteredPhotos} onMarkerClick={handlePhotoClick} />
            </div>
          </div>

          <AlbumDetailsCard />

          <AddMorePhotosCard />
        </div>

        <div className="flex flex-col gap-9">
          <PhotoEditForm
            selectedPhotos={filteredPhotos?.filter(photo => selectedPhotos?.includes(photo?.id))}
            onSave={selectedPhotos?.length > 1 ? handleSaveBatchEdit : handleSavePhotoEdit}
            onCancel={handleCancelEdit}
            isDisabled={selectedPhotos?.length === 0}
            deselectAllPhotos={deselectAllPhotos}
          />

          <PhotoGallery
            filteredPhotos={filteredPhotos}
            isLoading={isPhotosLoading}
            selectedDate={selectedDate}
            selectedPhotos={selectedPhotos}
            pagination={photoPagination}
            currentPage={currentPage}
            getModifiedStatus={getModifiedStatus}
            togglePhotoSelection={togglePhotoSelection}
            deselectAllPhotos={deselectAllPhotos}
            onPageChange={handlePageChange}
            onDeletePhotos={openDeleteDialog}
          />

          <div className="flex justify-end">
            <Button
              onClick={openFinishDialog}
              disabled={isLoading}
              className={cn(
                'bg-primary text-background rounded px-8 py-3 hover:bg-primary/90 font-body_two flex items-center gap-2',
                isLoading && 'opacity-50 cursor-not-allowed',
              )}
              aria-label="Finalizar edição do álbum"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <span>Publicar álbum</span>
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
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeletePhotos}
          photoCount={selectedPhotos.length}
          isDeleting={isDeletingPhotos}
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
