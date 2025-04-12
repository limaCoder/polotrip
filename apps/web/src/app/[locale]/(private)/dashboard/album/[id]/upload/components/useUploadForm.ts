import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import pLimit from 'p-limit';
import { toast } from 'sonner';

import { getSignedUrls, saveUploadedPhotos } from '@/http/upload-photos';
import { PhotoMetadata } from '@/http/upload-photos/types';
import {
  extractExifData,
  compressImage,
  createPreviewUrl,
  generateUniqueId,
  revokePreviewUrl,
} from '@/helpers/uploadHelpers';
import { PhotoFile, UseUploadFormOptions } from './types';

export function useUploadForm(albumId: string, options?: UseUploadFormOptions) {
  const router = useRouter();

  const [files, setFiles] = useState<PhotoFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        revokePreviewUrl(file.preview);
      });
    };
  }, [files]);

  const handleFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles?.length) return;

    const imageFiles = Array.from(newFiles)
      .filter(file => file?.type?.startsWith('image/'))
      .slice(0, 100);

    const newPhotos: PhotoFile[] = imageFiles?.map(file => ({
      id: generateUniqueId(),
      file,
      preview: createPreviewUrl(file),
      size: file?.size,
      loading: true,
      error: undefined,
      metadata: undefined,
    }));

    setFiles(prev => [...prev, ...newPhotos]);
    setError(null);

    for (const photo of newPhotos) {
      try {
        const compressedFile = await compressImage(photo?.file);

        const metadata = await extractExifData(photo?.file);

        setFiles(prev =>
          prev.map(p =>
            p?.id === photo?.id
              ? {
                  ...p,
                  file: compressedFile,
                  size: compressedFile?.size,
                  loading: false,
                  metadata,
                }
              : p,
          ),
        );
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Erro ao processar imagem', {
          description: 'Por favor, tente novamente.',
          duration: 5000,
          richColors: true,
        });

        setFiles(prev =>
          prev.map(p =>
            p?.id === photo?.id ? { ...p, loading: false, error: 'Erro ao processar imagem' } : p,
          ),
        );
      }
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        revokePreviewUrl(fileToRemove.preview);
      }

      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach(file => {
      revokePreviewUrl(file.preview);
    });

    setFiles([]);
  }, [files]);

  const upload = useCallback(async () => {
    if (!files || files?.length === 0 || isUploading) return;

    const validFiles = files?.filter(file => !file?.error && !file?.loading);

    if (!validFiles?.length) {
      setError(
        'Não há arquivos válidos para upload. Remova os arquivos com erro e tente novamente.',
      );
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const fileNames = validFiles?.map(file => file?.file?.name || '');
      const fileTypes = validFiles?.map(file => file?.file?.type || 'image/jpeg');

      const validFileNames = fileNames?.filter(
        name => name && typeof name === 'string' && name.trim() !== '',
      );

      const validFileTypes = fileTypes?.filter(
        (type, index) =>
          fileNames[index] &&
          typeof fileNames[index] === 'string' &&
          fileNames[index]?.trim() !== '' &&
          type &&
          typeof type === 'string',
      );

      if (!validFileNames?.length) {
        throw new Error('No valid files to upload');
      }

      if (validFileNames?.length !== validFileTypes?.length) {
        throw new Error('File names and types quantity do not match');
      }

      const { urls } = await getSignedUrls({
        params: {
          albumId,
          count: validFileNames?.length,
        },
        body: {
          fileNames: validFileNames,
          fileTypes: validFileTypes,
        },
      });

      const limit = pLimit(options?.maxConcurrentUploads || 5);
      let completedUploads = 0;
      const totalFiles = validFiles?.length;

      const photoMetadata: PhotoMetadata[] = [];
      const uploadTasks = [];

      for (let i = 0; i < validFiles?.length; i++) {
        const file = validFiles[i];
        if (!file || !file?.file) continue;

        const urlData = urls[i];
        if (!urlData) continue;

        photoMetadata.push({
          filePath: urlData.filePath,
          originalFileName: file?.file?.name || `photo-${i}.jpg`,
          dateTaken: file?.metadata?.dateTaken || null,
          latitude: file?.metadata?.latitude !== undefined ? file?.metadata?.latitude : null,
          longitude: file?.metadata?.longitude !== undefined ? file?.metadata?.longitude : null,
        });

        const uploadTask = limit(async () => {
          try {
            const uploadResponse = await fetch(urlData?.signedUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': file?.file?.type || 'image/jpeg',
              },
              body: file?.file,
            });

            if (!uploadResponse.ok) {
              throw new Error(`Failed to upload ${file?.file?.name || 'file'}`);
            }

            completedUploads++;
            setProgress(Math.round((completedUploads / totalFiles) * 100));

            return true;
          } catch (error) {
            console.error(`Error uploading ${file?.file?.name || 'file'}:`, error);
            throw error;
          }
        });

        uploadTasks.push(uploadTask);
      }

      await Promise.all(uploadTasks);

      const validPhotos = photoMetadata?.filter(
        photo =>
          photo &&
          typeof photo === 'object' &&
          typeof photo.filePath === 'string' &&
          photo.filePath.trim() !== '',
      );

      if (!validPhotos.length) {
        throw new Error('No valid photos to save');
      }

      await saveUploadedPhotos({
        body: {
          albumId,
          photos: validPhotos,
        },
      });

      clearAll();

      if (options?.redirectPath) {
        router.push(options?.redirectPath);
      } else if (options?.onSuccess) {
        options?.onSuccess();
      }

      setIsUploading(false);
      setProgress(100);
      toast.success('Upload realizado com sucesso!', {
        description: 'As imagens foram enviadas com sucesso.',
        duration: 5000,
        richColors: true,
      });
    } catch (error) {
      console.error('Error during upload:', error);

      setError('Falha ao fazer upload das imagens. Por favor, tente novamente.');
      setIsUploading(false);
    }
  }, [albumId, files, clearAll, router, options, isUploading]);

  return {
    files,
    isUploading,
    progress,
    error,
    handleFiles,
    removeFile,
    clearAll,
    upload,
  };
}
