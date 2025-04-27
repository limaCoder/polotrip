'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';

import { Button } from '@/components/Button';
import { MetadataDialog } from '../MetadataDialog';
import { cn } from '@/lib/cn';

import { formatFileSize } from '@/helpers/uploadHelpers';
import { useUploadForm } from '@/app/[locale]/(private)/dashboard/album/[id]/upload/components/UploadForm/useUploadForm';
import { Params } from './types';

export function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id: albumId, locale } = useParams<Params>();

  const redirectPath = `/${locale}/dashboard/album/${albumId}/edit-album`;
  const {
    uploadFormState,
    handleFiles,
    removeFile,
    clearAll,
    handleUploadClick,
    handleKeepMetadata,
    handleRemoveMetadata,
    handleCloseMetadataDialog,
  } = useUploadForm(albumId, {
    redirectPath,
  });

  const getTotalSize = () => uploadFormState?.files?.reduce((total, file) => total + file?.size, 0);

  const uploadButtonDisabled =
    uploadFormState?.files?.length === 0 ||
    uploadFormState?.files?.some(photo => photo?.loading) ||
    uploadFormState?.isUploading ||
    uploadFormState?.files?.every(photo => photo?.error);

  const clearAllButtonDisabled =
    uploadFormState?.files?.length === 0 || uploadFormState?.isUploading;

  return (
    <div className="bg-background p-8 rounded-lg shadow-md">
      <h1 className="font-title_three font-bold mb-6">Upload de Fotos</h1>

      {uploadFormState?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 mb-4">
          {uploadFormState?.error}
        </div>
      )}

      <div
        className={cn(
          'border border-dashed border-text/25 rounded-md p-3 h-[116px] flex flex-col items-center justify-center text-center relative mb-6',
          uploadFormState?.isUploading ? 'opacity-50 pointer-events-none' : '',
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          multiple
          onChange={e => handleFiles(e.target.files)}
          disabled={uploadFormState?.isUploading}
        />
        <Upload size={24} className="text-text/25 mb-2" />
        <p className="font-body_two text-sm">
          <span className="text-primary font-bold">Faça upload de fotos</span>
          <br />
          ou arraste e solte
        </p>
        <span className="text-primary text-xs mt-1">Aceita imagens JPG e PNG</span>
      </div>

      {uploadFormState?.files?.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <span className="font-body_two">
              {uploadFormState?.files?.length} foto
              {uploadFormState?.files?.length !== 1 ? 's' : ''} selecionada
            </span>
            <span className="font-body_two">{formatFileSize(getTotalSize())}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {uploadFormState?.files?.map(photo => (
              <div
                key={photo?.id}
                className="relative rounded overflow-hidden w-full h-[300px] md:h-[160px] group"
              >
                <Image
                  src={photo?.preview}
                  alt={photo?.file?.name}
                  fill
                  className="object-cover rounded-sm"
                />
                {photo?.loading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
                {photo?.error && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <p className="text-white text-xs p-2 text-center">{photo?.error}</p>
                  </div>
                )}
                <button
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                  onClick={() => removeFile(photo?.id)}
                  disabled={uploadFormState?.isUploading}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {uploadFormState?.isUploading && (
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${uploadFormState?.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-center">Fazendo upload... {uploadFormState?.progress}%</p>
        </div>
      )}

      <div className="w-full flex justify-end gap-4">
        <Button
          type="button"
          className="font-bold border border-text-opacity-25 rounded px-4 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={clearAll}
          disabled={clearAllButtonDisabled}
        >
          Limpar tudo
        </Button>

        <Button
          type="button"
          className="font-bold border border-text-opacity-25 bg-primary text-background rounded px-4 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUploadClick}
          disabled={uploadButtonDisabled}
        >
          {uploadFormState?.isUploading ? 'Enviando...' : 'Continuar'}
        </Button>
      </div>

      <MetadataDialog
        isOpen={uploadFormState?.showMetadataDialog}
        onClose={handleCloseMetadataDialog}
        onKeepMetadata={handleKeepMetadata}
        onRemoveMetadata={handleRemoveMetadata}
      />
    </div>
  );
}
