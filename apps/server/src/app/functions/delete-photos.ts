import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, inArray } from "drizzle-orm";
import { env } from "@/env";
import { redisService } from "@/services/cache/redis-service";

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

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

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
      .map((photo) => {
        const url = new URL(photo.imageUrl);
        const pathParts = url.pathname.split("/");

        const bucketTypeIndex = pathParts.findIndex(
          (part) => part === "public" || part === "sign"
        );

        if (bucketTypeIndex > -1 && bucketTypeIndex + 1 < pathParts.length) {
          return pathParts.slice(bucketTypeIndex + 2).join("/");
        }

        return null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length > 0) {
      await supabase.storage.from("polotrip-albums-content").remove(filePaths);
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
