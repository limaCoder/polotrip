import { Photo } from '@polotrip/db/models';
import { z } from 'zod';

type PhotoEditFormData = {
  dateTaken: Date | null;
  locationName: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
};

const formSchema = z
  .object({
    dateTaken: z.date().nullable(),
    locationName: z.string().nullable(),
    description: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  })
  .strict();

type PhotoEditFormSchemaData = z.infer<typeof formSchema>;

interface PhotoEditFormProps {
  selectedPhotos: Photo[];
  onSave: (data: PhotoEditFormSchemaData) => void;
  deselectAllPhotos: (skipUnsavedCheck?: boolean) => void;
  onCancel?: () => void;
  isDisabled?: boolean;
  isPublished?: boolean;
}

interface UsePhotoEditFormProps {
  selectedPhotos: Photo[];
  onSave: (data: PhotoEditFormSchemaData) => void;
  deselectAllPhotos: (skipUnsavedCheck?: boolean) => void;
}

export { formSchema };

export type {
  PhotoEditFormProps,
  PhotoEditFormData,
  UsePhotoEditFormProps,
  PhotoEditFormSchemaData,
};
