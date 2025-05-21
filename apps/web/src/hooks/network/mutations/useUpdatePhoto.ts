'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateAlbum } from '@/http/update-album';
import { albumKeys } from '../keys/albumKeys';

interface PhotoUpdate {
  id: string;
  dateTaken?: string | null;
  locationName?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface UseUpdatePhotoProps {
  albumId: string;
}

export const useUpdatePhoto = ({ albumId }: UseUpdatePhotoProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoUpdate: PhotoUpdate) => {
      return updateAlbum({
        params: { id: albumId },
        body: {
          photoUpdates: [photoUpdate],
        },
      });
    },
    onSuccess: () => {
      toast.success('Foto atualizada com sucesso');
      queryClient.invalidateQueries({ queryKey: albumKeys.photos(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.dates(albumId) });
    },
    onError: () => {
      toast.error('Erro ao atualizar foto', {
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    },
  });
};
