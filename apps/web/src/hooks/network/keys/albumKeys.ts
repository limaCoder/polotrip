export const albumKeys = {
  all: ['albums'] as const,
  lists: () => [...albumKeys.all, 'list'] as const,
  list: (filters: string) => [...albumKeys.lists(), { filters }] as const,
  details: () => [...albumKeys.all, 'detail'] as const,
  detail: (id: string) => [...albumKeys.details(), id] as const,
  dates: (albumId: string) => [...albumKeys.detail(albumId), 'dates'] as const,
  photos: (albumId: string) => [...albumKeys.detail(albumId), 'photos'] as const,
  photosByDate: (albumId: string, date?: string, page?: number) =>
    [...albumKeys.photos(albumId), { date, page }] as const,

  publicPhotos: 'publicPhotos' as const,
  publicPhotosList: (albumId: string) => [albumKeys.publicPhotos, 'list', albumId] as const,
} as const;
