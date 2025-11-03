import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageProvider } from "@/app/interfaces/storage-provider.interface";
import { InternalServerError } from "@/http/errors";

export class R2StorageProvider implements StorageProvider {
  readonly client: S3Client;
  readonly accountId: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;

  constructor(accountId: string, accessKeyId: string, secretAccessKey: string) {
    this.accountId = accountId;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async createSignedUploadUrl(bucket: string, path: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
      });

      const signedUrl = await getSignedUrl(this.client, command, {
        expiresIn: 3600,
      });

      return {
        signedUrl,
        path,
      };
    } catch (error) {
      throw new InternalServerError(
        "Error creating signed upload URL",
        "INTERNAL_ERROR",
        {
          originalError: error,
        }
      );
    }
  }

  async createSignedDownloadUrl(
    bucket: string,
    path: string,
    expiresIn: number
  ) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      });

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });

      return {
        signedUrl,
        path,
      };
    } catch (error) {
      throw new InternalServerError(
        "Error creating signed download URL",
        "INTERNAL_ERROR",
        {
          originalError: error,
        }
      );
    }
  }
}
