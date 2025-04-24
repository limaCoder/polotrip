import { Photo } from '@polotrip/db/models';
import { z } from 'zod';

const formSchema = z.object({
  dateTaken: z.date().optional().nullable(),
  locationName: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

type PhotoEditFormData = z.infer<typeof formSchema>;

interface PhotoEditFormProps {
  selectedPhotos: Photo[];
  onSave: (data: PhotoEditFormData) => void;
  onCancel?: () => void;
  isDisabled?: boolean;
}

export { formSchema };
export type { PhotoEditFormProps, PhotoEditFormData };
