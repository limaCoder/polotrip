'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateAlbum } from '@/http/update-album';
import { Photo } from '@polotrip/db/models';
import { albumKeys } from '../keys/albumKeys';
import { DateCount } from '@/http/get-photos-by-date/types';

interface PhotoUpdate {
  id: string;
  dateTaken?: string | null;
  locationName?: string | null;
  description?: string | null;
}

interface PhotosResponse {
  photos: Photo[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
    onMutate: async newPhotoData => {
      // Cancel ongoing queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: albumKeys.photos(albumId) });

      // Get current album dates state for possible rollback
      const previousDates = queryClient.getQueryData<{ dates: DateCount[] }>(
        albumKeys.dates(albumId),
      );

      // Get current photo state for possible rollback
      const allPhotoQueries = queryClient.getQueriesData<PhotosResponse>({
        queryKey: albumKeys.photos(albumId),
      });

      // Find the photo in all possible photo queries
      let originalPhoto: Photo | undefined;
      let originalDateQueryKey: unknown[] = [];

      for (const [queryKey, data] of allPhotoQueries) {
        if (!data?.photos) continue;

        const photo = data.photos.find(p => p.id === newPhotoData.id);
        if (photo) {
          originalPhoto = photo;
          originalDateQueryKey = Array.isArray(queryKey) ? [...queryKey] : [queryKey];
          break;
        }
      }

      if (!originalPhoto || !originalDateQueryKey) {
        return { previousDates };
      }

      const originalDate = originalPhoto.dateTaken;
      const newDate = newPhotoData.dateTaken;

      // If the date changed, we need to update counters and move the photo
      if (originalDate !== newDate) {
        // Update date counters optimistically
        if (previousDates?.dates) {
          const updatedDates = [...previousDates.dates];

          // Decrement date counter
          const originalDateIndex = updatedDates.findIndex(d => d.date === (originalDate || null));

          if (originalDateIndex >= 0 && updatedDates[originalDateIndex].count > 0) {
            updatedDates[originalDateIndex] = {
              ...updatedDates[originalDateIndex],
              count: updatedDates[originalDateIndex].count - 1,
            };
          }

          // Increment date counter
          const newDateIndex = updatedDates.findIndex(d => d.date === (newDate || null));

          if (newDateIndex >= 0) {
            updatedDates[newDateIndex] = {
              ...updatedDates[newDateIndex],
              count: updatedDates[newDateIndex].count + 1,
            };
          } else if (newDate) {
            // Add new date if it doesn't exist
            updatedDates.push({
              date: newDate,
              count: 1,
            });
          }

          // Update dates optimistically
          queryClient.setQueryData(albumKeys.dates(albumId), { dates: updatedDates });
        }

        // Remove photo from original query
        queryClient.setQueryData(originalDateQueryKey, (old: PhotosResponse | undefined) => {
          if (!old?.photos) return old;

          return {
            ...old,
            photos: old.photos.filter((p: Photo) => p.id !== newPhotoData.id),
          };
        });

        // If the new date has an active query, add photo there
        const newDateQueryKey = newDate
          ? albumKeys.photosByDate(albumId, newDate)
          : albumKeys.photosByDate(albumId, undefined);

        const newDateData = queryClient.getQueryData(newDateQueryKey);

        if (newDateData) {
          queryClient.setQueryData(newDateQueryKey, (old: PhotosResponse | undefined) => {
            if (!old?.photos) return old;

            return {
              ...old,
              photos: [...old.photos, { ...originalPhoto, ...newPhotoData }],
            };
          });
        }
      } else {
        // If only updating metadata without changing the date, update the photo in the current query
        queryClient.setQueryData(originalDateQueryKey, (old: PhotosResponse | undefined) => {
          if (!old?.photos) return old;

          return {
            ...old,
            photos: old.photos.map((p: Photo) =>
              p.id === newPhotoData.id ? { ...p, ...newPhotoData } : p,
            ),
          };
        });
      }

      return { previousDates, originalDateQueryKey, originalPhoto };
    },
    onError: (err, newPhotoData, context) => {
      // Revert changes in case of error
      if (context?.previousDates) {
        queryClient.setQueryData(albumKeys.dates(albumId), context.previousDates);
      }

      if (context?.originalDateQueryKey && context.originalPhoto) {
        queryClient.setQueryData(
          context.originalDateQueryKey,
          (old: PhotosResponse | undefined) => {
            if (!old?.photos) return old;

            // Check if the photo still exists in the list
            const photoExists = old.photos.some((p: Photo) => p.id === newPhotoData.id);

            if (photoExists) {
              // Revert to original state
              return {
                ...old,
                photos: old.photos.map((p: Photo) =>
                  p.id === newPhotoData.id ? context.originalPhoto : p,
                ),
              };
            } else {
              // Add back if it was removed
              return {
                ...old,
                photos: [...old.photos, context.originalPhoto],
              };
            }
          },
        );
      }

      // Notify user
      toast.error('Erro ao atualizar foto', {
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    },
    onSettled: () => {
      //Revalidate data and photos after operation (success or error)
      queryClient.invalidateQueries({ queryKey: albumKeys.photos(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.dates(albumId) });
    },
  });
};
