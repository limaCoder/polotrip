'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateAlbum } from '@/http/update-album';
import { albumKeys } from '../keys/albumKeys';
import { useTranslations } from 'next-intl';

interface UpdateAlbumDetailsData {
  albumId: string;
  title?: string;
  description?: string | null;
  coverImageUrl?: string | null;
}

export function useUpdateAlbumDetails() {
  const queryClient = useQueryClient();
  const t = useTranslations('UpdateAlbumDetailsHook');

  return useMutation({
    mutationFn: async ({ albumId, ...data }: UpdateAlbumDetailsData) => {
      const response = await updateAlbum({
        params: { id: albumId },
        body: data,
      });

      return response;
    },
    onSuccess: (_, variables) => {
      toast.success(t('success'));

      queryClient.invalidateQueries({
        queryKey: [albumKeys.all],
      });
      queryClient.invalidateQueries({
        queryKey: [albumKeys.detail(variables.albumId)],
      });
    },
    onError: () => {
      toast.error(t('error'));
    },
  });
}
