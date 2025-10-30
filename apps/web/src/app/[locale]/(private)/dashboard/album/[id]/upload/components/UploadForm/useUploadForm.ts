import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import pLimit from 'p-limit';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { getSignedUrls, saveUploadedPhotos } from '@/http/upload-photos';
import { PhotoMetadata } from '@/http/upload-photos/types';
import {
  extractExifData,
  compressImage,
  createPreviewUrl,
  generateUniqueId,
  revokePreviewUrl,
  createPreviewUrlAsync,
} from '@/helpers/uploadHelpers';
import { PhotoFile, UseUploadFormOptions, UploadFormState, Params } from './types';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { QueryClient } from '@tanstack/react-query';
import { getAlbum } from '@/http/get-album';
import { useTranslations } from 'next-intl';

export function useUploadForm(options?: UseUploadFormOptions) {
  const { id: albumId, locale } = useParams<Params>();
  const queryClient = useMemo(() => new QueryClient(), []);
  const t = useTranslations('UploadFormHook');

  const { data: albumData } = useQuery({
    queryKey: albumKeys.detail(albumId),
    queryFn: () => getAlbum({ albumId }),
    enabled: !!albumId,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFormState, setUploadFormState] = useState<UploadFormState>({
    files: [],
    isUploading: false,
    progress: 0,
    error: null,
    showMetadataDialog: false,
    keepMetadata: null,
    willMetadataBeRemoved: null,
  });
  const [isCompressingState, setIsCompressingState] = useState(false);

  const redirectPath = `/${locale}/dashboard/album/${albumId}/edit-album`;

  const getTotalSize = () => uploadFormState?.files?.reduce((total, file) => total + file?.size, 0);

  const uploadButtonDisabled =
    uploadFormState?.files?.length === 0 ||
    uploadFormState?.files?.some(photo => photo?.loading) ||
    uploadFormState?.isUploading ||
    uploadFormState?.files?.every(photo => photo?.error);

  const clearAllButtonDisabled =
    uploadFormState?.files?.length === 0 || uploadFormState?.isUploading;

  const updateUploadFormState = useCallback((newState: Partial<UploadFormState>) => {
    setUploadFormState(prev => ({ ...prev, ...newState }));
  }, []);

  const updateFiles = useCallback((filesUpdater: (prevFiles: PhotoFile[]) => PhotoFile[]) => {
    setUploadFormState(prev => ({
      ...prev,
      files: filesUpdater(prev.files),
    }));
  }, []);

  const handleFiles = useCallback(
    async (newFiles: FileList | null) => {
      if (!newFiles?.length || !albumData?.album?.photoLimit) return;

      const imageFiles = Array.from(newFiles).filter(file => file?.type?.startsWith('image/'));

      const remainingSlots = albumData?.album?.photoLimit - uploadFormState?.files?.length;

      if (remainingSlots <= 0) {
        toast.error(t('limit_exceeded_title'), {
          description: t('limit_exceeded_description', {
            photoLimit: albumData?.album?.photoLimit,
          }),
          duration: 5000,
          richColors: true,
        });
        return;
      }

      const filesToAdd = imageFiles.slice(0, remainingSlots);

      if (imageFiles.length > remainingSlots) {
        const description =
          remainingSlots === 1
            ? t('files_ignored_warning_description_singular', {
                remainingSlots,
                photoLimit: albumData?.album?.photoLimit,
              })
            : t('files_ignored_warning_description_plural', {
                remainingSlots,
                photoLimit: albumData?.album?.photoLimit,
              });
        toast.warning(t('files_ignored_warning_title'), {
          description,
          duration: 5000,
          richColors: true,
        });
      }

      const newPhotos: PhotoFile[] = filesToAdd?.map(file => ({
        id: generateUniqueId(),
        file,
        preview: createPreviewUrl(file),
        size: file?.size,
        loading: true,
        error: undefined,
        metadata: undefined,
      }));

      updateUploadFormState({
        files: [...uploadFormState.files, ...newPhotos],
        error: null,
      });

      for (const photo of newPhotos) {
        try {
          const preview = await createPreviewUrlAsync(photo.file);

          updateFiles(prev =>
            prev.map(p =>
              p?.id === photo?.id
                ? {
                    ...p,
                    preview,
                  }
                : p,
            ),
          );

          const compressedFile = await compressImage(photo?.file);
          const metadata = await extractExifData(photo?.file);

          updateFiles(prev =>
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
          if (error instanceof Error && error.message.includes('photos per album exceeded')) {
            const limitMatch = error.message.match(/Limit of (\d+) photos/);
            const photoLimit = limitMatch
              ? limitMatch[1]
              : albumData.album.photoLimit?.toString() || '100';

            toast.error(t('limit_exceeded_title'), {
              description: t('limit_exceeded_description', { photoLimit }),
              duration: 5000,
              richColors: true,
            });

            updateUploadFormState({
              isUploading: false,
              error: error.message,
            });
            return;
          }

          console.error('Error processing image:', error);
          toast.error(t('image_processing_error_title'), {
            description: t('image_processing_error_description'),
            duration: 5000,
            richColors: true,
          });

          updateFiles(prev =>
            prev.map(p =>
              p?.id === photo?.id
                ? { ...p, loading: false, error: t('image_processing_error') }
                : p,
            ),
          );
        }
      }
    },
    [uploadFormState?.files, updateFiles, updateUploadFormState, albumData, t],
  );

  const removeFile = useCallback(
    (fileId: string) => {
      updateFiles(prev => {
        const fileToRemove = prev.find(f => f.id === fileId);
        if (fileToRemove) {
          revokePreviewUrl(fileToRemove.preview);
        }

        return prev.filter(f => f.id !== fileId);
      });
    },
    [updateFiles],
  );

  const clearAll = useCallback(() => {
    uploadFormState?.files?.forEach(file => {
      revokePreviewUrl(file?.preview);
    });

    updateUploadFormState({ files: [] });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadFormState?.files, updateUploadFormState]);

  const checkForMetadata = useCallback(() => {
    const { files } = uploadFormState;

    const hasMetadataFiles = files.some(file => {
      const metadata = file?.metadata;

      return (
        metadata?.dateTaken !== null || metadata?.latitude !== null || metadata?.longitude !== null
      );
    });

    return hasMetadataFiles;
  }, [uploadFormState]);

  const startUpload = useCallback(async () => {
    const { files, isUploading } = uploadFormState;

    if (!files || files?.length === 0 || isUploading) return;

    const validFiles = files?.filter(file => !file?.error && !file?.loading);

    if (!validFiles?.length) {
      updateUploadFormState({
        error: t('no_valid_files_error'),
      });
      return;
    }

    updateUploadFormState({
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      const BATCH_SIZE = 5;
      let completedUploads = 0;
      const totalFiles = validFiles?.length;
      const photoMetadata: PhotoMetadata[] = [];

      for (let batchStart = 0; batchStart < validFiles?.length; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, validFiles.length);
        const batchFiles = validFiles.slice(batchStart, batchEnd);

        const fileNames = batchFiles?.map(file => file?.file?.name || '');
        const fileTypes = batchFiles?.map(file => file?.file?.type || 'image/jpeg');

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

        if (!validFileNames?.length) continue;

        let urls;
        try {
          const response = await getSignedUrls({
            params: {
              albumId,
              count: validFileNames?.length,
            },
            body: {
              fileNames: validFileNames,
              fileTypes: validFileTypes,
            },
          });
          urls = response.urls;
        } catch (error) {
          if (error instanceof Error && error.message.includes('photos per album exceeded')) {
            const limitMatch = error.message.match(/Limit of (\d+) photos/);
            const photoLimit = limitMatch ? limitMatch[1] : '100';

            toast.error(t('limit_exceeded_title'), {
              description: t('limit_exceeded_description', { photoLimit }),
              duration: 5000,
              richColors: true,
            });

            updateUploadFormState({
              isUploading: false,
            });

            return;
          }
          throw error;
        }

        const limit = pLimit(options?.maxConcurrentUploads || 5);
        const uploadTasks = [];

        for (let i = 0; i < batchFiles?.length; i++) {
          const file = batchFiles[i];
          if (!file || !file?.file) continue;

          const urlData = urls[i];
          if (!urlData) continue;

          photoMetadata.push({
            filePath: urlData.filePath,
            originalFileName: file?.file?.name || `photo-${i}.jpg`,
            dateTaken: file?.metadata?.dateTaken || null,
            latitude: file?.metadata?.latitude !== undefined ? file?.metadata?.latitude : null,
            longitude: file?.metadata?.longitude !== undefined ? file?.metadata?.longitude : null,
            width: file?.metadata?.width !== undefined ? file?.metadata?.width : null,
            height: file?.metadata?.height !== undefined ? file?.metadata?.height : null,
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
              updateUploadFormState({
                progress: Math.round((completedUploads / totalFiles) * 100),
              });

              return true;
            } catch (error) {
              console.error(`Error uploading ${file?.file?.name || 'file'}:`, error);
              throw error;
            }
          });

          uploadTasks.push(uploadTask);
        }

        await Promise.all(uploadTasks);
      }

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

      if (redirectPath) {
        window.location.href = redirectPath;
        clearAll();
      } else if (options?.onSuccess) {
        options?.onSuccess();
      }

      updateUploadFormState({
        isUploading: false,
        progress: 100,
      });

      await queryClient.refetchQueries({
        queryKey: [
          albumKeys.all,
          albumKeys.detail(albumId),
          albumKeys.dates(albumId),
          albumKeys.photosByDate(albumId),
          albumKeys.space(albumId),
        ],
        type: 'all',
      });

      toast.success(t('upload_success_title'), {
        description: t('upload_success_description'),
        duration: 5000,
        richColors: true,
      });
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('photos per album exceeded'))) {
        const limitMatch = (error as Error).message.match(/Limit of (\d+) photos/);
        const photoLimit = limitMatch
          ? limitMatch[1]
          : albumData?.album.photoLimit?.toString() || '100';

        toast.error(t('limit_exceeded_title'), {
          description: t('limit_exceeded_description', { photoLimit }),
          duration: 5000,
          richColors: true,
        });

        updateUploadFormState({
          isUploading: false,
        });
      }
    }
  }, [
    albumId,
    uploadFormState,
    clearAll,
    redirectPath,
    options,
    updateUploadFormState,
    albumData,
    queryClient,
    t,
  ]);

  const handleUploadClick = useCallback(() => {
    const { files, isUploading, keepMetadata } = uploadFormState;

    if (!files || files?.length === 0 || isUploading) return;

    if (keepMetadata === null && checkForMetadata()) {
      updateUploadFormState({ showMetadataDialog: true });
      return;
    }

    startUpload();
  }, [uploadFormState, checkForMetadata, updateUploadFormState, startUpload]);

  const handleKeepMetadata = useCallback(() => {
    updateUploadFormState({
      showMetadataDialog: false,
      keepMetadata: true,
    });

    startUpload();
  }, [startUpload, updateUploadFormState]);

  const handleRemoveMetadata = useCallback(() => {
    const filesWithoutMetadata = uploadFormState?.files?.map(file => ({
      ...file,
      metadata: {
        latitude: null,
        longitude: null,
      },
    }));

    updateUploadFormState({
      showMetadataDialog: false,
      keepMetadata: false,
      files: filesWithoutMetadata,
      willMetadataBeRemoved: true,
    });
  }, [updateUploadFormState, uploadFormState?.files]);

  const handleCloseMetadataDialog = useCallback(() => {
    updateUploadFormState({ showMetadataDialog: false });
  }, [updateUploadFormState]);

  const handleCompressProgress = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsCompressingState(true);
    try {
      await handleFiles(files);
    } finally {
      setIsCompressingState(false);
    }
  };

  useEffect(() => {
    return () => {
      uploadFormState?.files?.forEach(file => {
        revokePreviewUrl(file?.preview);
      });
    };
  }, [uploadFormState?.files]);

  useEffect(() => {
    if (uploadFormState?.willMetadataBeRemoved) {
      startUpload();
    }
  }, [uploadFormState?.willMetadataBeRemoved, startUpload, updateUploadFormState]);

  return {
    uploadFormState,
    isCompressingState,
    getTotalSize,
    uploadButtonDisabled,
    clearAllButtonDisabled,
    fileInputRef,
    handleFiles,
    handleCompressProgress,
    removeFile,
    clearAll,
    handleUploadClick,
    handleKeepMetadata,
    handleRemoveMetadata,
    handleCloseMetadataDialog,
  };
}
