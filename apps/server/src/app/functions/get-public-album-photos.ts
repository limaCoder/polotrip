import { and, eq, gt, sql } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';

interface GetPublicAlbumPhotosRequest {
  albumId: string;
  date: string;
  cursor?: string;
  limit?: number;
}

async function getPublicAlbumPhotos({
  albumId,
  date,
  cursor,
  limit = 20,
}: GetPublicAlbumPhotosRequest) {
  try {
    const album = await db
      .select({ id: albums.id, isPublished: albums.isPublished })
      .from(albums)
      .where(eq(albums.id, albumId))
      .then(rows => rows[0]);

    if (!album) {
      throw new Error('Album not found');
    }

    if (!album.isPublished) {
      throw new Error('Album is not published');
    }

    let baseFilter = and(
      eq(photos.albumId, album.id),
      sql`TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') = ${date}`,
    );

    if (cursor) {
      baseFilter = and(baseFilter, gt(photos.id, cursor));
    }

    const photosList = await db
      .select({
        id: photos.id,
        imageUrl: photos.imageUrl,
        dateTaken: photos.dateTaken,
        description: photos.description,
        locationName: photos.locationName,
        order: photos.order,
      })
      .from(photos)
      .where(baseFilter)
      .orderBy(photos.order, photos.id)
      .limit(limit + 1);

    const hasMore = photosList.length > limit;
    const results = hasMore ? photosList.slice(0, limit) : photosList;

    const nextCursor = hasMore ? results[results.length - 1].id : null;

    return {
      photos: results,
      pagination: {
        hasMore,
        nextCursor,
      },
    };
  } catch (error) {
    console.error('Error fetching public album photos:', error);
    throw error;
  }
}

export { getPublicAlbumPhotos };
