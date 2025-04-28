export type GetSignedUrlsRequest = {
  params: {
    albumId: string;
    count: number;
  };
  body: {
    fileNames: string[];
    fileTypes: string[];
  };
};

export type SignedUrlData = {
  signedUrl: string;
  filePath: string;
  fileName: string;
};

export type GetSignedUrlsResponse = {
  urls: SignedUrlData[];
};

export type PhotoMetadata = {
  filePath: string;
  originalFileName: string;
  dateTaken: string | null;
  latitude: number | null;
  longitude: number | null;
  width: number | null;
  height: number | null;
};

export type SaveUploadedPhotosRequest = {
  body: {
    albumId: string;
    photos: PhotoMetadata[];
  };
};

export type Photo = {
  id: string;
  albumId: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  originalFileName: string | null;
  dateTaken: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  description: string | null;
  order: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SaveUploadedPhotosResponse = {
  success: boolean;
  photosCount: number;
  message: string;
};
