'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateAlbum } from '@/http/update-album';
import { albumKeys } from '../keys/albumKeys';

interface UsePublishAlbumProps {
  albumId: string;
  onSuccess?: () => void;
}

export const usePublishAlbum = ({ albumId, onSuccess }: UsePublishAlbumProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateAlbum({
        params: { id: albumId },
        body: {
          isPublished: true,
          currentStepAfterPayment: 'published',
        },
      });
    },
    onSuccess: async () => {
      toast.success('Álbum publicado com sucesso', {
        description: 'Todas as alterações foram salvas.',
      });

      await queryClient.invalidateQueries({
        queryKey: [albumKeys.all],
      });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error('Erro ao publicar álbum', {
        description: 'Não foi possível finalizar o álbum. Tente novamente.',
      });
    },
  });
};
