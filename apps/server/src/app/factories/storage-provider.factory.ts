import type { StorageProvider } from "@/app/interfaces/storage-provider.interface";
import { env } from "@/env";
import { R2StorageProvider } from "@/services/storage/r2-storage-provider";
import { SupabaseStorageProvider } from "@/services/storage/supabase-storage-provider";

type StorageProviderType = "supabase" | "r2" | "s3" | "azure";

export class StorageProviderFactory {
  private static instances: Partial<
    Record<StorageProviderType, StorageProvider>
  > = {};

  static getProvider(type: StorageProviderType = "r2"): StorageProvider {
    if (!this.instances[type]) {
      switch (type) {
        case "supabase":
          this.instances[type] = new SupabaseStorageProvider(
            env.SUPABASE_URL,
            env.SUPABASE_KEY
          );
          break;
        case "r2":
          this.instances[type] = new R2StorageProvider(
            env.R2_ACCOUNT_ID,
            env.R2_ACCESS_KEY_ID,
            env.R2_SECRET_ACCESS_KEY
          );
          break;
        case "s3":
          throw new Error("Provider S3 not implemented yet");
        case "azure":
          throw new Error("Provider Azure not implemented yet");
        default:
          throw new Error(`Storage provider not supported: ${type}`);
      }
    }

    return this.instances[type];
  }
}
