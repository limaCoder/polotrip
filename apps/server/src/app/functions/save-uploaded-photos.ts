import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { eq, sql } from "drizzle-orm";
import { redisService } from "@/services/cache/redis-service";

type PhotoData = {
  filePath: string;
  originalFileName: string;
  dateTaken: string | null;
  latitude: number | null;
  longitude: number | null;
  width: number | null;
  height: number | null;
};

type SaveUploadedPhotosRequest = {
  albumId: string;
  userId: string;
  photos: PhotoData[];
};

async function saveUploadedPhotos({
  albumId,
  userId,
  photos: uploadedPhotosData,
}: SaveUploadedPhotosRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then((rows) => rows[0]);

  if (!album) {
    throw new Error("Album not found");
  }

  if (album.userId !== userId) {
    throw new Error("Album does not belong to user");
  }

  const currentPhotos = await db
    .select({ count: sql`count(*)` })
    .from(photos)
    .where(eq(photos.albumId, albumId))
    .then((rows) => Number(rows[0]?.count || 0));

  if (currentPhotos + uploadedPhotosData?.length > album.photoLimit) {
    throw new Error(`Limit of ${album.photoLimit} photos per album exceeded`);
  }

  const BUCKET_NAME = "polotrip-albums-content-bucket.work";

  const photosToInsert = uploadedPhotosData?.map((photo) => {
    const publicUrl = `https://${BUCKET_NAME}/${photo.filePath}`;

    return {
      albumId,
      imageUrl: publicUrl,
      originalFileName: photo?.originalFileName,
      dateTaken: photo?.dateTaken,
      latitude: photo?.latitude,
      longitude: photo?.longitude,
      width: photo?.width,
      height: photo?.height,
    };
  });

  const savedPhotos = await db
    .insert(photos)
    .values(photosToInsert)
    .returning();

  await db
    .update(albums)
    .set({
      photoCount: album.photoCount + savedPhotos.length,
      updatedAt: new Date(),
      currentStepAfterPayment: "organize",
    })
    .where(eq(albums.id, albumId));

  await redisService.delPattern(`polotrip:album-dates:${albumId}:*`);
  await redisService.del(`polotrip:public-album-locations:${albumId}`);
  await redisService.delPattern(`polotrip:public-album-photos:${albumId}:*`);

  return {
    success: true,
    photosCount: savedPhotos?.length,
    message: "Photos saved successfully",
  };
}

export { saveUploadedPhotos };
