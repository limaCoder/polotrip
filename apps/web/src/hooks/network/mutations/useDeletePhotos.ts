'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deletePhotos } from '@/http/delete-photos';
import { albumKeys } from '../keys/albumKeys';
import { useTranslations } from 'next-intl';

interface UseDeletePhotosProps {
  albumId: string;
  onSuccess?: () => void;
}

interface DeletePhotosVariables {
  photoIds: string[];
}

export const useDeletePhotos = ({ albumId, onSuccess }: UseDeletePhotosProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations('DeletePhotosHook');

  return useMutation({
    mutationFn: async ({ photoIds }: DeletePhotosVariables) => {
      return deletePhotos({
        params: { albumId },
        body: { photoIds },
      });
    },
    onSuccess: data => {
      const description =
        data.deletedCount === 1
          ? t('description_singular', { count: data.deletedCount })
          : t('description_plural', { count: data.deletedCount });

      toast.success(t('success'), {
        description,
      });
      queryClient.invalidateQueries({ queryKey: albumKeys.detail(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.photos(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.dates(albumId) });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error(t('error_title'), {
        description: t('error_description'),
      });
    },
  });
};
