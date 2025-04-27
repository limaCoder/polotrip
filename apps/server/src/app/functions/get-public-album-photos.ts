import { eq, sql } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';

interface GetPublicAlbumPhotosRequest {
  albumId: string;
  cursor?: string;
  limit?: number;
}

async function getPublicAlbumPhotos({ albumId, cursor, limit = 20 }: GetPublicAlbumPhotosRequest) {
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

    let cursorDate: string | null = null;
    let cursorPhotoId: string | null = null;

    if (cursor) {
      const [dateStr, photoId] = cursor.split('_');
      cursorDate = dateStr;
      cursorPhotoId = photoId;
    }

    const datesQuery = db
      .select({
        date: sql`DISTINCT TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD')`.as('date'),
      })
      .from(photos)
      .where(
        cursorDate
          ? sql`${photos.albumId} = ${album.id} AND TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') >= ${cursorDate}`
          : eq(photos.albumId, album.id),
      )
      .orderBy(sql`TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') ASC NULLS LAST`);

    const dates = await datesQuery.limit(3);

    const timelineEvents = [];
    let remainingLimit = limit;
    let lastDate: string | null = null;
    let lastPhotoId: string | null = null;
    let hasMore = false;

    for (const dateObj of dates) {
      const date = typeof dateObj.date === 'string' ? dateObj.date : null;
      lastDate = date;

      if (!date || remainingLimit <= 0) continue;

      const photosQuery = db
        .select({
          id: photos.id,
          imageUrl: photos.imageUrl,
          dateTaken: photos.dateTaken,
          description: photos.description,
          locationName: photos.locationName,
          order: photos.order,
        })
        .from(photos)
        .where(
          date === cursorDate && cursorPhotoId
            ? sql`${photos.albumId} = ${album.id} AND TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') = ${date} AND ${photos.id} > ${cursorPhotoId}`
            : sql`${photos.albumId} = ${album.id} AND TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') = ${date}`,
        )
        .orderBy(sql`${photos.order} NULLS LAST`, photos.id);

      const photosForDate = await photosQuery.limit(remainingLimit + 1);

      const dateHasMore = photosForDate.length > remainingLimit;

      const photosToInclude = dateHasMore ? photosForDate.slice(0, remainingLimit) : photosForDate;

      if (photosToInclude.length > 0) {
        lastPhotoId = photosToInclude[photosToInclude.length - 1].id;
      }

      timelineEvents.push({
        date,
        photos: photosToInclude.map(photo => ({
          ...photo,
        })),
      });

      remainingLimit -= photosToInclude.length;

      if (dateHasMore) {
        hasMore = true;
        break;
      }
    }

    if (!hasMore && dates.length === 3) {
      const moreResults = await db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(photos)
        .where(
          sql`${photos.albumId} = ${album.id} AND TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') > ${lastDate}`,
        )
        .then(rows => rows[0].count > 0);

      hasMore = moreResults;
    }

    const nextCursor = hasMore ? `${lastDate}_${lastPhotoId}` : null;

    return {
      timelineEvents,
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
