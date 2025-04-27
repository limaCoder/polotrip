'use client';

import { useQuery } from '@tanstack/react-query';

import { getPhotosByDate } from '@/http/get-photos-by-date';
import { albumKeys } from '@/hooks/network/keys/albumKeys';

interface UseGetPhotosByDateProps {
  albumId: string;
  date?: string | null;
  noDate?: boolean;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const useGetPhotosByDate = ({
  albumId,
  date,
  noDate,
  page = 1,
  limit = 20,
  enabled = true,
}: UseGetPhotosByDateProps) => {
  return useQuery({
    queryKey: albumKeys.photosByDate(albumId, date || undefined, page),
    queryFn: async () => {
      const query: Record<string, string | number | boolean> = { page, limit };

      if (date) {
        query.date = date;
      } else if (noDate) {
        query.noDate = true;
      }

      const response = await getPhotosByDate({
        params: { albumId },
        query,
      });

      return response;
    },
    enabled: enabled && !!albumId && (!!date || !!noDate || page > 0),
  });
};
