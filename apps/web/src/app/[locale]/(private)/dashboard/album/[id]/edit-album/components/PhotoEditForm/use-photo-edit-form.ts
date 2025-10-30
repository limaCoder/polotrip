import { useEffect, useRef, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { PhotoEditFormData, UsePhotoEditFormProps } from './types';
import { apiStringToDate } from '@/utils/dates';
import { useTranslations } from 'next-intl';

export function usePhotoEditForm({
  selectedPhotos,
  onSave,
  deselectAllPhotos,
}: UsePhotoEditFormProps) {
  const t = useTranslations('PhotoEditFormHook');

  const [showSuccess, setShowSuccess] = useState(false);
  const [preserveFields, setPreserveFields] = useState({
    location: true,
    description: true,
  });

  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSelectionRef = useRef<string[]>([]);
  const isSavingRef = useRef(false);

  const isMultipleSelection = selectedPhotos?.length > 1;

  const form = useFormContext<PhotoEditFormData>();

  const resetForm = useCallback(
    (formData: Partial<PhotoEditFormData>) => {
      form.reset(formData, {
        keepDirty: false,
        keepTouched: false,
      });
    },
    [form],
  );

  const showSuccessFeedback = useCallback(() => {
    setShowSuccess(true);

    setPreserveFields({
      location: true,
      description: true,
    });

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = setTimeout(() => {
      setShowSuccess(false);
      isSavingRef.current = false;
    }, 2000);
  }, []);

  const handleSubmit = useCallback(
    (data: PhotoEditFormData) => {
      isSavingRef.current = true;

      form.clearErrors();

      const dataToUse = { ...data };

      if (isMultipleSelection) {
        let formData = { ...dataToUse };

        if (preserveFields?.location) {
          const { locationName, latitude, longitude, ...rest } = formData;
          formData = rest as PhotoEditFormData;
        }

        if (preserveFields?.description) {
          const { description, ...rest } = formData;
          formData = rest as PhotoEditFormData;
        }

        onSave(formData);

        resetForm(dataToUse);
        deselectAllPhotos(true);

        showSuccessFeedback();
        return;
      }

      onSave(dataToUse);

      resetForm(dataToUse);
      deselectAllPhotos(true);

      showSuccessFeedback();
    },
    [
      isMultipleSelection,
      onSave,
      preserveFields,
      form,
      resetForm,
      showSuccessFeedback,
      deselectAllPhotos,
    ],
  );

  const getSelectionText = useCallback(() => {
    if (isMultipleSelection) {
      return t('edit_multiple_photos', { count: selectedPhotos.length });
    }

    if (selectedPhotos.length === 1) {
      return t('edit_single_photo');
    }

    return t('no_photo_selected');
  }, [isMultipleSelection, selectedPhotos.length, t]);

  const selectionText = getSelectionText();

  useEffect(() => {
    if (isSavingRef.current) {
      return;
    }

    const currentSelectionIds =
      selectedPhotos
        ?.map(p => p?.id)
        .sort()
        .join(',') || '';

    const previousSelectionIds = previousSelectionRef.current.sort().join(',');

    if (currentSelectionIds === previousSelectionIds) {
      return;
    }

    previousSelectionRef.current = selectedPhotos?.map(p => p?.id) || [];

    if (selectedPhotos.length === 0) {
      resetForm({
        dateTaken: null,
        locationName: '',
        description: '',
        latitude: null,
        longitude: null,
      });
      return;
    }

    if (selectedPhotos.length === 1) {
      const photo = selectedPhotos[0];
      resetForm({
        dateTaken: apiStringToDate(photo.dateTaken),
        locationName: photo.locationName || '',
        description: photo.description || '',
        latitude: photo.latitude,
        longitude: photo.longitude,
      });
      return;
    }

    const firstPhoto = selectedPhotos[0];
    resetForm({
      dateTaken: apiStringToDate(firstPhoto.dateTaken),
      locationName: '',
      description: '',
      latitude: null,
      longitude: null,
    });

    setPreserveFields({
      location: true,
      description: true,
    });
  }, [selectedPhotos, resetForm]);

  const isSaving = useCallback(() => {
    return isSavingRef.current;
  }, []);

  return {
    form,
    onSubmit: handleSubmit,
    selectionText,
    showSuccess,
    preserveFields,
    setPreserveFields,
    isMultipleSelection,
    isSaving,
  };
}
