import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';
import { env } from '@/env';

import { MultipartFile } from '@fastify/multipart';
import { createClient } from '@supabase/supabase-js';
import { createId } from '@paralleldrive/cuid2';

import { extractExifData } from '@/app/utils/extractExifData';

interface UploadPhotosRequest {
  albumId: string;
  userId: string;
  files: MultipartFile[];
}

async function uploadPhotos({ albumId, userId, files }: UploadPhotosRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then(rows => rows[0]);

  if (!album) {
    throw new Error('Album not found');
  }

  if (album.userId !== userId) {
    throw new Error('Album does not belong to the user');
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  const uploadedPhotos = [];

  for (const file of files) {
    const buffer = await file.toBuffer();

    const exifData = await extractExifData(buffer);

    const fileExtension = file.filename.split('.').pop() || 'jpg';
    const uniqueFilename = `${createId()}.${fileExtension}`;
    const filePath = `${userId}/${albumId}/${uniqueFilename}`;

    const { data: urlData } = await supabase.storage.from('photos').getPublicUrl(filePath);

    const imageUrl = urlData?.publicUrl;

    const [photo] = await db
      .insert(photos)
      .values({
        albumId,
        imageUrl,
        originalFileName: file.filename,
        dateTaken: exifData?.dateTaken ? exifData.dateTaken.toISOString() : null,
        latitude: exifData?.latitude || null,
        longitude: exifData?.longitude || null,
      })
      .returning();

    uploadedPhotos.push(photo);
  }

  await db
    .update(albums)
    .set({
      photoCount: album.photoCount + uploadedPhotos.length,
      updatedAt: new Date(),
    })
    .where(eq(albums.id, albumId));

  return { photos: uploadedPhotos };
}

export { uploadPhotos };
