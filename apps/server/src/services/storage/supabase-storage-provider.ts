import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StorageProvider } from "@/app/interfaces/storage-provider.interface";

class SupabaseStorageProvider implements StorageProvider {
  readonly client: SupabaseClient;
  readonly url: string;
  readonly key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
    this.client = createClient(url, key);
  }

  async createSignedUploadUrl(bucket: string, path: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      throw new Error(`Failed to create upload URL: ${error.message}`);
    }

    return {
      signedUrl: data.signedUrl,
      path: data.path,
    };
  }

  async createSignedDownloadUrl(
    bucket: string,
    path: string,
    expiresIn: number
  ) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create download URL: ${error.message}`);
    }

    return {
      signedUrl: data.signedUrl,
      path,
    };
  }
}

export { SupabaseStorageProvider };
