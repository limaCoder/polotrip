import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { InternalServerError } from "@/http/errors/api-error";
import { redisService } from "@/services/cache/redis-service";

type GetPublicAlbumLocationsRequest = {
  albumId: string;
};

async function getPublicAlbumLocations({
  albumId,
}: GetPublicAlbumLocationsRequest) {
  try {
    const cacheKey = `polotrip:public-album-locations:${albumId}`;

    const cachedData = await redisService.get<{
      locations: {
        id: string;
        latitude: number | null;
        longitude: number | null;
        locationName: string | null;
        dateTaken: string | null;
        imageUrl: string;
      }[];
    }>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const album = await db
      .select({ id: albums.id, isPublished: albums.isPublished })
      .from(albums)
      .where(eq(albums.id, albumId))
      .then((rows) => rows[0]);

    if (!album) {
      throw new Error("Album not found");
    }

    if (!album.isPublished) {
      throw new Error("Album is not published");
    }

    const locations = await db
      .select({
        id: photos.id,
        latitude: photos.latitude,
        longitude: photos.longitude,
        locationName: photos.locationName,
        dateTaken: photos.dateTaken,
        imageUrl: photos.imageUrl,
      })
      .from(photos)
      .where(
        and(
          eq(photos.albumId, album.id),
          isNotNull(photos.latitude),
          isNotNull(photos.longitude)
        )
      );

    const result = { locations };

    await redisService.set(cacheKey, result);

    return result;
  } catch (error) {
    throw new InternalServerError(
      "Failed to process the request.",
      "INTERNAL_SERVER_ERROR",
      {
        originalError: error,
      }
    );
  }
}

export { getPublicAlbumLocations };
