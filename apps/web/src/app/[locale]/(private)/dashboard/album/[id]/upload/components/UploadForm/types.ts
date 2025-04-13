type PhotoFile = {
  id: string;
  file: File;
  preview: string;
  size: number;
  loading: boolean;
  error?: string;
  metadata?: {
    dateTaken: string | null;
    latitude: number | null;
    longitude: number | null;
  };
};

type PhotoPreview = PhotoFile;

type Params = {
  id: string;
  locale: string;
};

interface UseUploadFormOptions {
  onSuccess?: () => void;
  maxConcurrentUploads?: number;
  redirectPath?: string;
}

interface UploadFormState {
  files: PhotoFile[];
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export type { PhotoFile, PhotoPreview, UseUploadFormOptions, Params, UploadFormState };
