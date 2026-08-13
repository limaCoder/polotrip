import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { getR2PublicUrl } from "@/services/storage/r2-config";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

async function migrate() {
  const sourceAlbums = await db.select().from(albums);
  let migrated = 0;
  let skipped = 0;

  for (const album of sourceAlbums) {
    if (
      !(
        album.coverImageUrl &&
        new URL(album.coverImageUrl).host.endsWith(".supabase.co")
      )
    ) {
      skipped += 1;
      continue;
    }

    const response = await fetch(album.coverImageUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download cover for album ${album.id}: ${response.status}`
      );
    }

    const contentType =
      response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    const extension = contentType === "image/png" ? "png" : "jpg";
    const objectPath = `covers/cover_${album.id}.${extension}`;
    const body = new Uint8Array(await response.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2_CONTENT_BUCKET_NAME,
        Key: objectPath,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=3600, must-revalidate",
      })
    );

    await db
      .update(albums)
      .set({ coverImageUrl: getR2PublicUrl(objectPath), updatedAt: new Date() })
      .where(eq(albums.id, album.id));

    migrated += 1;
    process.stdout.write(`Migrated album ${album.id} -> ${objectPath}\n`);
  }

  process.stdout.write(
    `${JSON.stringify({ migrated, skipped, total: sourceAlbums.length })}\n`
  );
}

migrate().catch((error) => {
  process.stderr.write(`${error}\n`);
  process.exitCode = 1;
});
