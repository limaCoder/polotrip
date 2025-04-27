'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateAlbum } from '@/http/update-album';
import { albumKeys } from '@/hooks/network/keys/albumKeys';

interface PhotoBatchUpdate {
  ids: string[];
  data: {
    dateTaken?: string | null;
    locationName?: string | null;
    description?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

interface UseUpdatePhotoBatchProps {
  albumId: string;
}

export const useUpdatePhotoBatch = ({ albumId }: UseUpdatePhotoBatchProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, data }: PhotoBatchUpdate) => {
      const photoUpdates = ids.map(id => ({
        id,
        ...data,
      }));

      return updateAlbum({
        params: { id: albumId },
        body: {
          photoUpdates,
        },
      });
    },
    onSuccess: () => {
      toast.success('Fotos atualizadas com sucesso');

      queryClient.invalidateQueries({ queryKey: albumKeys.photos(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.dates(albumId) });
    },
    onError: () => {
      toast.error('Erro ao atualizar fotos', {
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    },
  });
};
