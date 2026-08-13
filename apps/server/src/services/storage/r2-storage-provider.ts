import {
  DeleteObjectsCommand,
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

  async putObject(
    bucket: string,
    path: string,
    body: Uint8Array,
    contentType: string
  ) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=3600, must-revalidate",
      })
    );
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

  async deleteObjects(bucket: string, paths: string[]) {
    if (!paths.length) return;
    const result = await this.client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: paths.map((Key) => ({ Key })), Quiet: true },
      })
    );
    if (result.Errors?.length) {
      throw new Error(
        result.Errors.map((error) => error.Message || error.Key).join(", ")
      );
    }
  }
}
