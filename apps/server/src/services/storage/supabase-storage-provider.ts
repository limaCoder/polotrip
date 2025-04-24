import { StorageProvider } from '@/app/interfaces/storage-provider.interface';
import { createClient } from '@supabase/supabase-js';

class SupabaseStorageProvider implements StorageProvider {
  private client;

  constructor(
    private url: string,
    private key: string,
  ) {
    this.client = createClient(url, key);
  }

  async createSignedUploadUrl(bucket: string, path: string) {
    const { data, error } = await this.client.storage.from(bucket).createSignedUploadUrl(path);

    if (error) {
      throw new Error(`Failed to create upload URL: ${error.message}`);
    }

    return {
      signedUrl: data.signedUrl,
      path: data.path,
    };
  }
}

export { SupabaseStorageProvider };
