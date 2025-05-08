import { useQuery } from '@tanstack/react-query';
import { getAlbum } from '@/http/get-album';
import { albumKeys } from '../keys/albumKeys';

interface UseAlbumDetailsOptions {
  enabled?: boolean;
}

export function useAlbumDetails(albumId: string, options?: UseAlbumDetailsOptions) {
  return useQuery({
    queryKey: [albumKeys.detail(albumId)],
    queryFn: async () => {
      const response = await getAlbum({
        albumId,
      });

      return response.album;
    },
    enabled: options?.enabled,
  });
}
