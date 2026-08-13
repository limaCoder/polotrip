import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { eq, inArray } from "drizzle-orm";
import { redisService } from "@/services/cache/redis-service";
import {
  getR2ObjectPath,
  R2_CONTENT_BUCKET,
} from "../../services/storage/r2-config";
import { StorageProviderFactory } from "../factories/storage-provider.factory";

type DeletePhotosRequest = {
  photoIds: string[];
  albumId: string;
  userId: string;
};

async function deletePhotos({
  photoIds,
  albumId,
  userId,
}: DeletePhotosRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then((rows) => rows[0]);

  if (!album) {
    throw new Error("Album not found");
  }

  if (album.userId !== userId) {
    throw new Error("Album does not belong to the user");
  }

  const photosToDelete = await db
    .select()
    .from(photos)
    .where(
      inArray(
        photos.id,
        photoIds.map((id) => id)
      )
    );

  if (!photosToDelete.length) {
    return { deletedCount: 0 };
  }

  return await db.transaction(async (tx) => {
    const deletedPhotos = await tx
      .delete(photos)
      .where(
        inArray(
          photos.id,
          photoIds.map((id) => id)
        )
      )
      .returning();

    await tx
      .update(albums)
      .set({
        photoCount: album.photoCount - deletedPhotos.length,
        updatedAt: new Date(),
      })
      .where(eq(albums.id, albumId))
      .returning();

    const filePaths = photosToDelete
      .map((photo) => getR2ObjectPath(photo.imageUrl))
      .filter(Boolean) as string[];

    if (filePaths.length > 0) {
      await StorageProviderFactory.getProvider().deleteObjects(
        R2_CONTENT_BUCKET,
        filePaths
      );
    }

    await redisService.delPattern(`polotrip:album-dates:${albumId}:*`);
    await redisService.del(`polotrip:public-album-locations:${albumId}`);
    await redisService.delPattern(`polotrip:public-album-photos:${albumId}:*`);

    return {
      success: true,
      deletedCount: deletedPhotos.length,
      message: `${deletedPhotos.length} photos deleted successfully`,
    };
  });
}

export { deletePhotos };
