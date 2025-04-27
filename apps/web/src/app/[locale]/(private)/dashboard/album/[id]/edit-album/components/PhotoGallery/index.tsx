import { SkeletonList } from '@/components/SkeletonList';
import { type PhotoGalleryProps } from './types';
import { PhotoGalleryPagination } from '../PhotoGalleryPagination';
import { PhotoGalleryItem } from '../PhotoGalleryItem';
import { Trash2, X } from 'lucide-react';

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
  onPageChange,
  onDeletePhotos,
}: PhotoGalleryProps) {
  return (
    <div className="bg-background p-8 rounded-lg shadow-md">
      <div className="mb-3">
        <h2 className="font-title_three font-bold mb-1">Momentos da viagem</h2>
        <p className="font-body_two text-text/75">
          Para realizar a edição das informações de data e localidade, selecione os conteúdos
          abaixo.
        </p>
      </div>

      <div className="flex justify-between items-startmd:items-center mb-6 flex-col md:flex-row gap-4">
        <p className="font-body_two">
          <span className="text-primary font-bold">
            {pagination?.total || filteredPhotos.length}
            {(pagination?.total || filteredPhotos.length) === 1 ? ' foto' : ' fotos'}
          </span>
          {selectedDate ? ` em ${selectedDate}` : ' sem data definida'}
        </p>

        {selectedPhotos.length > 0 && (
          <div className="flex gap-4 flex-col md:flex-row mb-4">
            <button
              className="flex items-center gap-2 text-text/50 cursor-pointer hover:text-text/75"
              onClick={deselectAllPhotos}
            >
              <X size={18} />
              <span className="font-body_two">Limpar Seleção</span>
            </button>
            <button
              className="flex items-center gap-2 text-red-500 cursor-pointer hover:text-red-600"
              onClick={onDeletePhotos}
            >
              <Trash2 size={18} />
              <span className="font-body_two">Excluir Selecionadas</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredPhotos?.map(photo => {
          const isModified = getModifiedStatus(photo?.id);
          const isSelected = selectedPhotos?.includes(photo?.id);

          return (
            <PhotoGalleryItem
              key={photo?.id}
              photo={photo}
              isSelected={isSelected}
              isModified={isModified}
              togglePhotoSelection={togglePhotoSelection}
            />
          );
        })}

        {isLoading && (
          <div className="col-span-full">
            <SkeletonList count={5} className="h-[200px] w-[200px] rounded-sm" />
          </div>
        )}

        {filteredPhotos?.length === 0 && (
          <div className="col-span-full text-center py-12 text-text/50">
            Nenhuma foto encontrada para esta data.
          </div>
        )}
      </div>

      {pagination && (
        <PhotoGalleryPagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
