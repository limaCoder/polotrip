import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoEditFormData, UsePhotoEditFormProps } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './types';
import { apiStringToDate } from '@/utils/dates';

export function usePhotoEditForm({
  selectedPhotos,
  onSave,
  deselectAllPhotos,
}: UsePhotoEditFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [preserveFields, setPreserveFields] = useState({
    location: true,
    description: true,
  });

  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMultipleSelection = selectedPhotos?.length > 1;

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

  function onSubmit(data: PhotoEditFormData) {
    const showSuccess = () => {
      setShowSuccess(true);

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      deselectAllPhotos();
    };

    if (isMultipleSelection) {
      let formData = { ...data };

      if (preserveFields?.location) {
        const { locationName, latitude, longitude, ...rest } = formData;
        formData = rest as PhotoEditFormData;
      }

      if (preserveFields?.description) {
        const { description, ...rest } = formData;
        formData = rest as PhotoEditFormData;
      }

      onSave(formData);
      showSuccess();
      return;
    }

    onSave(data);
    showSuccess();
  }

  const selectionText = isMultipleSelection
    ? `Editar ${selectedPhotos.length} fotos selecionadas`
    : selectedPhotos.length === 1
      ? 'Editar foto'
      : 'Selecione uma foto para editar';

  useEffect(() => {
    if (selectedPhotos.length === 0) {
      form.reset({
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
      form.reset({
        dateTaken: apiStringToDate(photo.dateTaken),
        locationName: photo.locationName || '',
        description: photo.description || '',
        latitude: photo.latitude,
        longitude: photo.longitude,
      });

      return;
    }

    const firstPhoto = selectedPhotos[0];
    form.reset(
      {
        dateTaken: apiStringToDate(firstPhoto.dateTaken),
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

    setPreserveFields({
      location: true,
      description: true,
    });
  }, [selectedPhotos, form]);

  return {
    form,
    onSubmit,
    selectionText,
    showSuccess,
    preserveFields,
    setPreserveFields,
    isMultipleSelection,
  };
}
