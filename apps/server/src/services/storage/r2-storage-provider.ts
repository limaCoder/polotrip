import { StorageProvider } from '@/app/interfaces/storage-provider.interface';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class R2StorageProvider implements StorageProvider {
  private client: S3Client;

  constructor(
    private accountId: string,
    private accessKeyId: string,
    private secretAccessKey: string,
  ) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  async createSignedUploadUrl(bucket: string, path: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
      });

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn: 3600 });

      return {
        signedUrl,
        path,
      };
    } catch (error) {
      console.error('Error creating signed upload URL: ', error);
      throw error;
    }
  }

  async createSignedDownloadUrl(bucket: string, path: string, expiresIn: number) {
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
      console.error('Error creating signed download URL: ', error);
      throw error;
    }
  }
}
