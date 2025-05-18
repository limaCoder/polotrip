'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateAlbum } from '@/http/update-album';
import { albumKeys } from '../keys/albumKeys';

interface UpdateAlbumDetailsData {
  albumId: string;
  title?: string;
  description?: string | null;
  coverImageUrl?: string | null;
}

export function useUpdateAlbumDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, ...data }: UpdateAlbumDetailsData) => {
      const response = await updateAlbum({
        params: { id: albumId },
        body: data,
      });

      return response;
    },
    onSuccess: (_, variables) => {
      toast.success('Álbum atualizado com sucesso!');

      queryClient.invalidateQueries({
        queryKey: [albumKeys.all],
      });
      queryClient.invalidateQueries({
        queryKey: [albumKeys.detail(variables.albumId)],
      });
    },
    onError: () => {
      toast.error('Erro ao atualizar o álbum. Tente novamente.');
    },
  });
}
