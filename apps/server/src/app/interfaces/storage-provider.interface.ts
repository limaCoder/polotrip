interface StorageProvider {
  createSignedUploadUrl(
    bucket: string,
    path: string,
  ): Promise<{
    signedUrl: string;
    path: string;
  }>;
}

export type { StorageProvider };
