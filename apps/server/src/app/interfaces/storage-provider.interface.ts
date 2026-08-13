type StorageProvider = {
  putObject(
    bucket: string,
    path: string,
    body: Uint8Array,
    contentType: string
  ): Promise<void>;

  createSignedUploadUrl(
    bucket: string,
    path: string
  ): Promise<{
    signedUrl: string;
    path: string;
  }>;

  createSignedDownloadUrl(
    bucket: string,
    path: string,
    expiresIn: number
  ): Promise<{
    signedUrl: string;
    path: string;
  }>;

  deleteObjects(bucket: string, paths: string[]): Promise<void>;
};

export type { StorageProvider };
