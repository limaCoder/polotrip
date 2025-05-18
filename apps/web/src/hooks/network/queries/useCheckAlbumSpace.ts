'use client';

import { useQuery } from '@tanstack/react-query';

import { checkAlbumSpace } from '@/http/check-album-space';
import { albumKeys } from '../keys/albumKeys';

interface UseCheckAlbumSpaceOptions {
  albumId: string;
  enabled?: boolean;
}

export function useCheckAlbumSpace({ albumId, enabled = true }: UseCheckAlbumSpaceOptions) {
  return useQuery({
    queryKey: albumKeys.space(albumId),
    queryFn: () => checkAlbumSpace({ params: { albumId } }),
    enabled,
  });
}
