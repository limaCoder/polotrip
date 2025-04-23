import { eq, sql } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';
import { env } from '@/env';
import { createClient } from '@supabase/supabase-js';

type PhotoData = {
  filePath: string;
  originalFileName: string;
  dateTaken: string | null;
  latitude: number | null;
  longitude: number | null;
};

interface SaveUploadedPhotosRequest {
  albumId: string;
  userId: string;
  photos: PhotoData[];
}

async function saveUploadedPhotos({
  albumId,
  userId,
  photos: uploadedPhotosData,
}: SaveUploadedPhotosRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then(rows => rows[0]);

  if (!album) {
    throw new Error('Album not found');
  }

  if (album.userId !== userId) {
    throw new Error('Album does not belong to user');
  }

  const currentPhotos = await db
    .select({ count: sql`count(*)` })
    .from(photos)
    .where(eq(photos.albumId, albumId))
    .then(rows => Number(rows[0]?.count || 0));

  if (currentPhotos + uploadedPhotosData?.length > 100) {
    throw new Error('Limit of 100 photos per album exceeded');
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  const photosToInsert = await Promise.all(
    uploadedPhotosData?.map(async photo => {
      const { data, error } = await supabase.storage
        .from('polotrip-albums-content')
        .createSignedUrl(photo?.filePath, 315360000); // ~10 years in seconds

      if (error || !data) {
        throw new Error(`Error generating signed URL: ${error?.message || 'data is null'}`);
      }

      return {
        albumId,
        imageUrl: data.signedUrl,
        originalFileName: photo?.originalFileName,
        dateTaken: photo?.dateTaken,
        latitude: photo?.latitude,
        longitude: photo?.longitude,
      };
    }),
  );

  const savedPhotos = await db.insert(photos).values(photosToInsert).returning();

  await db
    .update(albums)
    .set({
      photoCount: album.photoCount + savedPhotos.length,
      updatedAt: new Date(),
      currentStepAfterPayment: 'organize',
    })
    .where(eq(albums.id, albumId));

  return {
    success: true,
    photosCount: savedPhotos?.length,
    message: 'Photos saved successfully',
  };
}

export { saveUploadedPhotos };
