import { NetworkKeys } from './index';

export const albumKeys = {
  all: [NetworkKeys.ALBUMS] as const,
  lists: () => [...albumKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...albumKeys.lists(), { ...filters }] as const,
  details: () => [...albumKeys.all, 'detail'] as const,
  detail: (id: string) => [...albumKeys.details(), id] as const,
  dates: (albumId: string) => [...albumKeys.detail(albumId), 'dates'] as const,
  photos: (albumId: string) => [...albumKeys.detail(albumId), 'photos'] as const,
  photosByDate: (albumId: string, date?: string, page?: number) =>
    [...albumKeys.photos(albumId), { date, page }] as const,
};
