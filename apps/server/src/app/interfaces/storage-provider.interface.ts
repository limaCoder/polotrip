type StorageProvider = {
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
};

export type { StorageProvider };
