type PhotoFile = {
  id: string;
  file: File;
  preview: string;
  size: number;
  loading: boolean;
  error?: string;
  metadata?: {
    dateTaken?: string | null;
    latitude: number | null;
    longitude: number | null;
    width?: number | null;
    height?: number | null;
  };
};

type PhotoPreview = PhotoFile;

type Params = {
  id: string;
  locale: string;
};

type UseUploadFormOptions = {
  onSuccess?: () => void;
  maxConcurrentUploads?: number;
  redirectPath?: string;
};

type UploadFormState = {
  files: PhotoFile[];
  isUploading: boolean;
  progress: number;
  error: string | null;
  showMetadataDialog: boolean;
  keepMetadata: boolean | null;
  willMetadataBeRemoved: boolean | null;
};

type City = {
  name: string;
  hint: string;
};

type GameState = {
  score: number;
  currentCity: {
    original: string;
    scrambled: string;
    hint: string;
  };
};

export type {
  PhotoFile,
  PhotoPreview,
  UseUploadFormOptions,
  Params,
  UploadFormState,
  City,
  GameState,
};
