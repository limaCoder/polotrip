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
    width: number | null;
    height: number | null;
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
  showMetadataDialog: boolean;
  keepMetadata: boolean | null;
  willMetadataBeRemoved: boolean | null;
}

export type { PhotoFile, PhotoPreview, UseUploadFormOptions, Params, UploadFormState };
