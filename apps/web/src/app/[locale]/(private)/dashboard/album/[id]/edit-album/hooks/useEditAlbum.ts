'use client';

import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { formSchema } from '../components/PhotoEditForm/types';
import type { PhotoEditFormData } from '../components/PhotoEditForm/types';
import { dateToAPIString } from '@/utils/dates';

import { useGetAlbumDates } from '@/hooks/network/queries/useGetAlbumDates';
import { useGetPhotosByDate } from '@/hooks/network/queries/useGetPhotosByDate';
import { useUpdatePhoto } from '@/hooks/network/mutations/useUpdatePhoto';
import { useUpdatePhotoBatch } from '@/hooks/network/mutations/useUpdatePhotoBatch';
import { usePublishAlbum } from '@/hooks/network/mutations/usePublishAlbum';
import { useDeletePhotos } from '@/hooks/network/mutations/useDeletePhotos';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import {
  PendingActionTypeEnum,
  UnsavedChangesActionEnum,
  unsavedChangesReducer,
} from '../reducers/unsavedChangesReducer';
import { Params } from './types';

export function useEditAlbum() {
  const { id, locale } = useParams<Params>();
  const router = useRouter();
  const queryClient = new QueryClient();

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedDateLocal, setSelectedDateLocal] = useState<string | null>(null);

  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [unsavedChangesState, dispatch] = useReducer(unsavedChangesReducer, {
    isDialogOpen: false,
    pendingAction: null,
  });

  const initializedRef = useRef(false);
  const deselectPhotosRef = useRef<(skipCheck?: boolean) => void>(() => {});

  const [dateParam, setDateParam] = useQueryState('date');
  const [pageParam, setPageParam] = useQueryState('page', { defaultValue: '1' });

  const form = useForm<PhotoEditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTaken: null,
      locationName: '',
      description: '',
      latitude: null,
      longitude: null,
    },
  });

  const currentPage = Number(pageParam) || 1;

  const albumDatesQuery = useGetAlbumDates({
    albumId: id,
  });

  const photosQuery = useGetPhotosByDate({
    albumId: id,
    date: selectedDateLocal || undefined,
    noDate: selectedDateLocal === null,
    page: currentPage,
    enabled: !!id && (selectedDateLocal !== undefined || initializedRef.current),
  });

  const updatePhotoMutation = useUpdatePhoto({
    albumId: id,
  });

  const updatePhotoBatchMutation = useUpdatePhotoBatch({
    albumId: id,
  });

  const publishAlbumMutation = usePublishAlbum({
    albumId: id,
    onSuccess: () => {
      router.push(`/${locale}/album/${id}`);
    },
  });

  const deletePhotosMutation = useDeletePhotos({
    albumId: id,
    onSuccess: () => {
      deselectPhotosRef.current(true);
      setIsDeleteDialogOpen(false);
    },
  });

  const hasUnsavedChanges = useCallback(() => {
    if (
      updatePhotoMutation.isPending ||
      updatePhotoBatchMutation.isPending ||
      deletePhotosMutation.isPending ||
      publishAlbumMutation.isPending
    ) {
      return false;
    }

    if (selectedPhotos.length === 0) {
      return false;
    }

    const { isDirty, dirtyFields } = form.formState;

    if (!isDirty) {
      return false;
    }

    const dirtyFieldsKeys = Object.keys(dirtyFields);

    if (dirtyFieldsKeys.length === 1 && dirtyFieldsKeys[0] === 'locationName') {
      return false;
    }

    return true;
  }, [
    form.formState,
    selectedPhotos.length,
    updatePhotoMutation.isPending,
    updatePhotoBatchMutation.isPending,
    deletePhotosMutation.isPending,
    publishAlbumMutation.isPending,
  ]);

  const deselectAllPhotos = useCallback(
    (skipUnsavedCheck = false) => {
      if (selectedPhotos.length === 0) {
        return;
      }

      if (!skipUnsavedCheck && hasUnsavedChanges()) {
        dispatch({
          type: UnsavedChangesActionEnum.SHOW_DIALOG,
          action: { type: PendingActionTypeEnum.DESELECT_ALL },
        });
        return;
      }

      setSelectedPhotos([]);
    },
    [hasUnsavedChanges, selectedPhotos.length, dispatch],
  );

  const updateDateSelection = useCallback(
    async (date: string | null) => {
      setSelectedDateLocal(date);
      await setPageParam('1');
      await setDateParam(date);
      setSelectedPhotos([]);
    },
    [setDateParam, setPageParam],
  );

  const handlePhotoClick = useCallback(
    (photoId: string) => {
      if (selectedPhotos.length === 1 && selectedPhotos[0] === photoId) {
        return;
      }

      if (hasUnsavedChanges()) {
        dispatch({
          type: UnsavedChangesActionEnum.SHOW_DIALOG,
          action: { type: PendingActionTypeEnum.SELECT_PHOTO, photoId },
        });
        return;
      }

      const photos = photosQuery.data?.photos.filter(p => p.id === photoId);
      if (!photos || photos.length === 0) {
        return;
      }

      setSelectedPhotos(photos.map(p => p.id));
    },
    [hasUnsavedChanges, photosQuery.data?.photos, selectedPhotos],
  );

  const togglePhotoSelection = useCallback(
    (photoId: string) => {
      if (selectedPhotos.includes(photoId)) {
        setSelectedPhotos(prev => prev.filter(id => id !== photoId));
        return;
      }

      if (hasUnsavedChanges()) {
        dispatch({
          type: UnsavedChangesActionEnum.SHOW_DIALOG,
          action: { type: PendingActionTypeEnum.TOGGLE_PHOTO, photoId },
        });
        return;
      }

      setSelectedPhotos(prev => [...prev, photoId]);
    },
    [hasUnsavedChanges, selectedPhotos],
  );

  const handleDateSelect = useCallback(
    async (date: string | null) => {
      if (date === selectedDateLocal) {
        return;
      }

      if (hasUnsavedChanges()) {
        dispatch({
          type: UnsavedChangesActionEnum.SHOW_DIALOG,
          action: { type: PendingActionTypeEnum.SELECT_DATE, date },
        });
        return;
      }

      await updateDateSelection(date);
    },
    [hasUnsavedChanges, selectedDateLocal, updateDateSelection],
  );

  const closeUnsavedChangesDialog = useCallback(() => {
    dispatch({ type: UnsavedChangesActionEnum.CLOSE_DIALOG });
  }, []);

  const handleUnsavedChanges = useCallback(async () => {
    const action = unsavedChangesState.pendingAction;

    form.reset(form.getValues(), {
      keepDirty: false,
      keepTouched: false,
    });

    dispatch({ type: UnsavedChangesActionEnum.CONFIRM_ACTION });

    if (!action) {
      return;
    }

    switch (action.type) {
      case PendingActionTypeEnum.SELECT_PHOTO: {
        if (!action.photoId) return;

        const photos = photosQuery.data?.photos.filter(p => p.id === action.photoId);
        if (!photos || photos.length === 0) return;

        setSelectedPhotos(photos.map(p => p.id));
        return;
      }
      case PendingActionTypeEnum.TOGGLE_PHOTO: {
        if (!action.photoId) return;

        setSelectedPhotos(prev => [...prev, action.photoId!]);
        return;
      }
      case PendingActionTypeEnum.SELECT_DATE: {
        if (action.date === undefined) return;

        await updateDateSelection(action.date);
        return;
      }
      case PendingActionTypeEnum.DESELECT_ALL: {
        setSelectedPhotos([]);
        return;
      }
    }
  }, [
    form,
    unsavedChangesState.pendingAction,
    photosQuery.data?.photos,
    updateDateSelection,
    dispatch,
  ]);

  const handlePageChange = useCallback(
    async (page: number) => {
      await setPageParam(page.toString());
    },
    [setPageParam],
  );

  const getModifiedStatus = useCallback(
    (photoId: string) => {
      // As this is a real time update, we can use the mutation status to show changes in progress
      return updatePhotoMutation.isPending && updatePhotoMutation.variables?.id === photoId;
    },
    [updatePhotoMutation.isPending, updatePhotoMutation.variables?.id],
  );

  const handleSavePhotoEdit = useCallback(
    (data: PhotoEditFormData) => {
      if (selectedPhotos.length === 0 || selectedPhotos.length > 1) {
        return;
      }

      if (unsavedChangesState.isDialogOpen) {
        dispatch({ type: UnsavedChangesActionEnum.CLOSE_DIALOG });
      }

      form.reset(data, {
        keepDirty: false,
        keepTouched: false,
      });

      updatePhotoMutation.mutate({
        id: selectedPhotos[0],
        dateTaken: dateToAPIString(data.dateTaken),
        locationName: data.locationName || null,
        description: data.description || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
    },
    [form, selectedPhotos, updatePhotoMutation, unsavedChangesState.isDialogOpen, dispatch],
  );

  const handleSaveBatchEdit = useCallback(
    (data: PhotoEditFormData) => {
      if (selectedPhotos.length === 0) {
        return;
      }

      if (unsavedChangesState.isDialogOpen) {
        dispatch({ type: UnsavedChangesActionEnum.CLOSE_DIALOG });
      }

      form.reset(data, {
        keepDirty: false,
        keepTouched: false,
      });

      const fieldsToCheck = {
        dateTaken: data.dateTaken ? dateToAPIString(data.dateTaken) : undefined,
        locationName: data.locationName ?? undefined,
        description: data.description ?? undefined,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
      };

      const updateData = Object.entries(fieldsToCheck).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value === '' ? null : value;
          }
          return acc;
        },
        {} as Record<string, string | number | null>,
      );

      if (Object.keys(updateData).length === 0) {
        return;
      }

      updatePhotoBatchMutation.mutate({
        ids: selectedPhotos,
        data: updateData,
      });
    },
    [form, selectedPhotos, updatePhotoBatchMutation, unsavedChangesState.isDialogOpen, dispatch],
  );

  const handleDeletePhotos = useCallback(() => {
    if (selectedPhotos.length === 0) {
      return;
    }

    deletePhotosMutation.mutate({
      photoIds: selectedPhotos,
    });
  }, [deletePhotosMutation, selectedPhotos]);

  const handleCancelEdit = useCallback(() => {
    form.reset(
      {
        dateTaken: null,
        locationName: '',
        description: '',
        latitude: null,
        longitude: null,
      },
      {
        keepDirty: false,
        keepTouched: false,
      },
    );

    setSelectedPhotos([]);
  }, [form]);

  const handleFinish = useCallback(() => {
    publishAlbumMutation.mutate();
  }, [publishAlbumMutation]);

  const openFinishDialog = useCallback(() => {
    setIsFinishDialogOpen(true);
  }, []);

  const closeFinishDialog = useCallback(() => {
    setIsFinishDialogOpen(false);
  }, []);

  const openDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const isLoading = albumDatesQuery.isLoading || photosQuery.isLoading;
  const isPhotosLoading = photosQuery.isLoading;
  const error = albumDatesQuery.error?.message || photosQuery.error?.message;

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

  useEffect(() => {
    deselectPhotosRef.current = deselectAllPhotos;
  }, [deselectAllPhotos]);

  return {
    albumDates: albumDatesQuery.data?.dates || [],
    selectedDate: selectedDateLocal,
    filteredPhotos: photosQuery.data?.photos || [],
    selectedPhotos,
    isLoading,
    isPhotosLoading,
    isFinishDialogOpen,
    isDeleteDialogOpen,
    isUnsavedChangesDialogOpen: unsavedChangesState.isDialogOpen,
    isDeletingPhotos: deletePhotosMutation.isPending,
    form,

    error,
    photoPagination: photosQuery.data?.pagination || null,
    currentPage,

    handleDateSelect,
    handlePhotoClick,
    handleSavePhotoEdit,
    handleSaveBatchEdit,
    handleDeletePhotos,
    handleFinish,
    handleCancelEdit,
    handlePageChange,
    getModifiedStatus,
    togglePhotoSelection,
    deselectAllPhotos,
    openFinishDialog,
    closeFinishDialog,
    openDeleteDialog,
    closeDeleteDialog,
    closeUnsavedChangesDialog,
    handleUnsavedChanges,
  };
}
