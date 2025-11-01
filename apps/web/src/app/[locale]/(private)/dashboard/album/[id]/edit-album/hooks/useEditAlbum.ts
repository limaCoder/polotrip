'use client';

import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useParams } from 'next/navigation';
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
import {
  PendingActionTypeEnum,
  UnsavedChangesActionEnum,
  unsavedChangesReducer,
} from '../reducers/unsavedChangesReducer';
import { Params } from './types';
import { usePostHog } from '@/hooks/usePostHog';

export function useEditAlbum() {
  const { id, locale } = useParams<Params>();
  const { capture } = usePostHog();

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedDateLocal, setSelectedDateLocal] = useState<string | null>(null);

  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUndatedPhotosDialogOpen, setIsUndatedPhotosDialogOpen] = useState(false);

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
      window.location.href = `/${locale}/album/${id}`;
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

      capture('photo_selected', {
        album_id: id,
        photo_id: photoId,
        selection_mode: 'single',
      });
    },
    [hasUnsavedChanges, selectedPhotos, capture, id],
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

      capture('timeline_viewed', {
        album_id: id,
        selected_date: date,
      });

      await updateDateSelection(date);
    },
    [hasUnsavedChanges, selectedDateLocal, updateDateSelection, capture, id],
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

      const editedFields = [];
      if (data.dateTaken) editedFields.push('date');
      if (data.locationName) editedFields.push('location');
      if (data.description) editedFields.push('description');
      if (data.latitude && data.longitude) editedFields.push('coordinates');

      capture('photo_edited', {
        album_id: id,
        photo_id: selectedPhotos[0],
        edited_fields: editedFields,
        edit_mode: 'single',
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
    [
      form,
      selectedPhotos,
      updatePhotoMutation,
      unsavedChangesState.isDialogOpen,
      dispatch,
      capture,
      id,
    ],
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

      capture('photo_edited', {
        album_id: id,
        photos_count: selectedPhotos.length,
        edited_fields: Object.keys(updateData),
        edit_mode: 'batch',
      });

      updatePhotoBatchMutation.mutate({
        ids: selectedPhotos,
        data: updateData,
      });
    },
    [
      form,
      selectedPhotos,
      updatePhotoBatchMutation,
      unsavedChangesState.isDialogOpen,
      dispatch,
      capture,
      id,
    ],
  );

  const handleDeletePhotos = useCallback(() => {
    if (selectedPhotos.length === 0) {
      return;
    }

    capture('photo_deleted', {
      album_id: id,
      photos_count: selectedPhotos.length,
    });

    deletePhotosMutation.mutate({
      photoIds: selectedPhotos,
    });
  }, [deletePhotosMutation, selectedPhotos, capture, id]);

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
    capture('edit_completed', {
      album_id: id,
    });

    publishAlbumMutation.mutate();
  }, [publishAlbumMutation, capture, id]);

  const hasUndatedPhotos = useCallback(() => {
    const dates = albumDatesQuery.data?.dates || [];
    const undatedPhotos = dates.find(dateCount => dateCount?.date === null);
    return Boolean(undatedPhotos?.count);
  }, [albumDatesQuery.data?.dates]);

  const openFinishDialog = useCallback(() => {
    capture('finish_edit_clicked', {
      album_id: id,
      has_undated_photos: hasUndatedPhotos(),
    });

    if (hasUndatedPhotos()) {
      capture('undated_photos_dialog_opened', {
        album_id: id,
      });
      setIsUndatedPhotosDialogOpen(true);
      return;
    }
    setIsFinishDialogOpen(true);
  }, [hasUndatedPhotos, capture, id]);

  const closeFinishDialog = useCallback(() => {
    setIsFinishDialogOpen(false);
  }, []);

  const openDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const closeUndatedPhotosDialog = useCallback(() => {
    setIsUndatedPhotosDialogOpen(false);
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
    isUndatedPhotosDialogOpen,
    isUnsavedChangesDialogOpen: unsavedChangesState.isDialogOpen,
    isDeletingPhotos: deletePhotosMutation.isPending,
    isUpdatingPhoto: updatePhotoMutation.isPending,
    isUpdatingPhotoBatch: updatePhotoBatchMutation.isPending,
    isPublishingAlbum: publishAlbumMutation.isPending,
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
    closeUndatedPhotosDialog,
  };
}
