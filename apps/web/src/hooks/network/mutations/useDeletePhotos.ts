'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deletePhotos } from '@/http/delete-photos';
import { albumKeys } from '../keys/albumKeys';
import { useCallback } from 'react';
import { Photo } from '@polotrip/db/models';

interface UseDeletePhotosProps {
  albumId: string;
  onSuccess?: () => void;
}

interface DeletePhotosVariables {
  photoIds: string[];
}

interface PaginationData {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  perPage: number;
}

export const useDeletePhotos = ({ albumId, onSuccess }: UseDeletePhotosProps) => {
  const queryClient = useQueryClient();

  const getPhotosByDateQueryKey = albumKeys.photosByDate(albumId);
  const getAlbumDatesQueryKey = albumKeys.dates(albumId);

  const removePhotosFromCache = useCallback(
    (photoIds: string[]) => {
      queryClient.setQueryData<{ photos: Photo[]; pagination: PaginationData }>(
        getPhotosByDateQueryKey,
        oldData => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            photos: oldData.photos.filter(photo => !photoIds.includes(photo.id)),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: getAlbumDatesQueryKey });
    },
    [queryClient, getPhotosByDateQueryKey, getAlbumDatesQueryKey],
  );

  return useMutation({
    mutationFn: async ({ photoIds }: DeletePhotosVariables) => {
      return deletePhotos({
        params: { albumId },
        body: { photoIds },
      });
    },

    onMutate: async ({ photoIds }) => {
      await queryClient.cancelQueries({ queryKey: getPhotosByDateQueryKey });

      const previousPhotos = queryClient.getQueryData(getPhotosByDateQueryKey);

      removePhotosFromCache(photoIds);

      return { previousPhotos };
    },

    onSuccess: data => {
      toast.success('Fotos excluídas com sucesso', {
        description: `${data.deletedCount} ${data.deletedCount === 1 ? 'foto foi excluída' : 'fotos foram excluídas'}.`,
      });

      queryClient.invalidateQueries({ queryKey: albumKeys.detail(albumId) });

      if (onSuccess) {
        onSuccess();
      }
    },

    onError: (error, variables, context) => {
      if (context?.previousPhotos) {
        queryClient.setQueryData(getPhotosByDateQueryKey, context.previousPhotos);
      }

      toast.error('Erro ao excluir fotos', {
        description: 'Não foi possível excluir as fotos selecionadas. Tente novamente.',
      });
    },
  });
};
