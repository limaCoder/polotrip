import { env } from '@/env';
import { StorageProvider } from '@/app/interfaces/storage-provider.interface';
import { SupabaseStorageProvider } from '@/services/storage/supabase-storage-provider';

type StorageProviderType = 'supabase' | 's3' | 'azure';

export class StorageProviderFactory {
  private static instances: Partial<Record<StorageProviderType, StorageProvider>> = {};

  static getProvider(type: StorageProviderType = 'supabase'): StorageProvider {
    if (!this.instances[type]) {
      switch (type) {
        case 'supabase':
          this.instances[type] = new SupabaseStorageProvider(env.SUPABASE_URL, env.SUPABASE_KEY);
          break;
        case 's3':
          throw new Error('Provider S3 not implemented yet');
        case 'azure':
          throw new Error('Provider Azure not implemented yet');
        default:
          throw new Error(`Storage provider not supported: ${type}`);
      }
    }

    return this.instances[type];
  }
}
