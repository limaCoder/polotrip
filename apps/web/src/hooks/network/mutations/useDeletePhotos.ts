'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deletePhotos } from '@/http/delete-photos';
import { albumKeys } from '../keys/albumKeys';

interface UseDeletePhotosProps {
  albumId: string;
  onSuccess?: () => void;
}

interface DeletePhotosVariables {
  photoIds: string[];
}

export const useDeletePhotos = ({ albumId, onSuccess }: UseDeletePhotosProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoIds }: DeletePhotosVariables) => {
      return deletePhotos({
        params: { albumId },
        body: { photoIds },
      });
    },
    onSuccess: data => {
      toast.success('Fotos excluídas com sucesso', {
        description: `${data.deletedCount} ${data.deletedCount === 1 ? 'foto foi excluída' : 'fotos foram excluídas'}.`,
      });
      queryClient.invalidateQueries({ queryKey: albumKeys.detail(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.photos(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.dates(albumId) });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error('Erro ao excluir fotos', {
        description: 'Não foi possível excluir as fotos selecionadas. Tente novamente.',
      });
    },
  });
};
