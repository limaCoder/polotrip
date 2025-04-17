'use client';

import { useQuery } from '@tanstack/react-query';

import { getAlbumDates } from '@/http/get-album-dates';
import { albumKeys } from '../keys/albumKeys';

interface UseGetAlbumDatesProps {
  albumId: string;
  enabled?: boolean;
}

export const useGetAlbumDates = ({ albumId, enabled = true }: UseGetAlbumDatesProps) => {
  return useQuery({
    queryKey: albumKeys.dates(albumId),
    queryFn: async () => {
      if (!albumId) {
        throw new Error('Album ID is required');
      }

      const response = await getAlbumDates({
        params: { albumId },
      });

      return response;
    },
    enabled: enabled && !!albumId,
  });
};
