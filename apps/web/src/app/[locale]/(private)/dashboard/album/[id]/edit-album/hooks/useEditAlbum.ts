'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Photo } from '@polotrip/db/models';
import { type PhotoEditFormData } from '../components/PhotoEditForm/types';
import { dateToAPIString } from '@/utils/dates';

import { useGetAlbumDates } from '@/hooks/network/queries/useGetAlbumDates';
import { useGetPhotosByDate } from '@/hooks/network/queries/useGetPhotosByDate';
import { useUpdatePhoto } from '@/hooks/network/mutations/useUpdatePhoto';
import { useUpdatePhotoBatch } from '@/hooks/network/mutations/useUpdatePhotoBatch';
import { usePublishAlbum } from '@/hooks/network/mutations/usePublishAlbum';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { useQueryClient } from '@tanstack/react-query';

interface Params extends Record<string, string> {
  id: string;
  locale: string;
}

export function useEditAlbum() {
  const params = useParams<Params>();
  const router = useRouter();

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

  const initializedRef = useRef(false);

  const [selectedDateLocal, setSelectedDateLocal] = useState<string | null>(null);

  const [dateParam, setDateParam] = useQueryState('date');
  const [pageParam, setPageParam] = useQueryState('page', { defaultValue: '1' });

  const currentPage = Number(pageParam) || 1;

  const albumDatesQuery = useGetAlbumDates({
    albumId: params.id,
  });

  const deselectAllPhotos = () => {
    setSelectedPhotos([]);
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });

    setSelectedPhoto(null);
  };

  useEffect(() => {
    if (initializedRef.current || albumDatesQuery?.isLoading || !albumDatesQuery?.data?.dates) {
      return;
    }

    const dates = albumDatesQuery?.data?.dates;

    if (dates.length === 0) {
      initializedRef.current = true;
      return;
    }

    let oldestDate: string | null = null;

    const nonNullDates = dates?.filter(date => date?.date !== null);

    if (nonNullDates?.length > 0) {
      nonNullDates?.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      oldestDate = nonNullDates[0]?.date;
    } else {
      const nullDateEntry = dates.find(d => d.date === null);
      if (nullDateEntry) {
        oldestDate = null;
      }
    }

    if (oldestDate !== undefined) {
      setSelectedDateLocal(oldestDate);

      setDateParam(oldestDate);
    }

    initializedRef.current = true;
  }, [albumDatesQuery?.data, albumDatesQuery?.isLoading, setDateParam]);

  useEffect(() => {
    if (dateParam !== undefined) {
      setSelectedDateLocal(dateParam);
    }
  }, [dateParam]);

  const photosQuery = useGetPhotosByDate({
    albumId: params.id,
    date: selectedDateLocal || undefined,
    noDate: selectedDateLocal === null,
    page: currentPage,
    enabled: !!params.id && (selectedDateLocal !== undefined || initializedRef.current),
  });

  const updatePhotoMutation = useUpdatePhoto({
    albumId: params.id,
  });

  const updatePhotoBatchMutation = useUpdatePhotoBatch({
    albumId: params.id,
  });

  const queryClient = useQueryClient();

  const publishAlbumMutation = usePublishAlbum({
    albumId: params.id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [albumKeys.all],
      });
      router.push(`/${params.locale}/album/${params.id}`);
    },
  });

  const handleDateSelect = async (date: string | null) => {
    setSelectedDateLocal(date);

    await setPageParam('1');

    await setDateParam(date);

    deselectAllPhotos();
    setSelectedPhoto(null);
  };

  const handlePageChange = async (page: number) => {
    await setPageParam(page.toString());
  };

  const handlePhotoClick = (photoId: string) => {
    const photo = photosQuery.data?.photos.find(p => p.id === photoId);
    if (photo) {
      setSelectedPhoto(photo);
      deselectAllPhotos();
    }
  };

  const getModifiedStatus = (photoId: string) => {
    // As this is a real time update, we can use the mutation status to show changes in progress
    return updatePhotoMutation.isPending && updatePhotoMutation.variables?.id === photoId;
  };

  const handleSavePhotoEdit = (data: PhotoEditFormData) => {
    if (!selectedPhoto) return;

    updatePhotoMutation.mutate({
      id: selectedPhoto.id,
      dateTaken: dateToAPIString(data.dateTaken),
      locationName: data.locationName || null,
      description: data.description || null,
    });
  };

  const handleSaveBatchEdit = (data: PhotoEditFormData) => {
    if (selectedPhotos.length === 0) return;

    updatePhotoBatchMutation.mutate({
      ids: selectedPhotos,
      data: {
        dateTaken: dateToAPIString(data.dateTaken),
        locationName: data.locationName || null,
        description: data.description || null,
      },
    });
  };

  const handleCancelEdit = () => {
    setSelectedPhoto(null);
    deselectAllPhotos();
  };

  const handleFinish = () => {
    publishAlbumMutation.mutate();
  };

  const openFinishDialog = () => {
    setIsFinishDialogOpen(true);
  };

  const closeFinishDialog = () => {
    setIsFinishDialogOpen(false);
  };

  const isLoading = albumDatesQuery.isLoading || photosQuery.isLoading;
  const isPhotosLoading = photosQuery.isLoading;

  const error = albumDatesQuery.error?.message || photosQuery.error?.message;

  return {
    albumDates: albumDatesQuery.data?.dates || [],
    selectedDate: selectedDateLocal,
    selectedPhoto,
    filteredPhotos: photosQuery.data?.photos || [],
    selectedPhotos,
    isLoading,
    isPhotosLoading,
    isFinishDialogOpen,

    error,
    photoPagination: photosQuery.data?.pagination || null,
    currentPage,

    handleDateSelect,
    handlePhotoClick,
    handleSavePhotoEdit,
    handleSaveBatchEdit,
    handleFinish,
    handleCancelEdit,
    handlePageChange,
    getModifiedStatus,
    togglePhotoSelection,
    deselectAllPhotos,
    openFinishDialog,
    closeFinishDialog,
  };
}
