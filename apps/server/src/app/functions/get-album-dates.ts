import { eq, sql } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';

interface GetAlbumDatesRequest {
  albumId: string;
  userId: string;
}

interface DateCount {
  date: string | null;
  count: number;
}

async function getAlbumDates({ albumId, userId }: GetAlbumDatesRequest) {
  try {
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

    const dateCountsResult = await db
      .select({
        date: sql`CASE WHEN ${photos.dateTaken} IS NULL THEN NULL ELSE TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') END`
          .mapWith((val): string | null => (val === null ? null : String(val)))
          .as('dateOnly'),
        count: sql`count(*)`.mapWith(Number),
      })
      .from(photos)
      .where(eq(photos.albumId, albumId))
      .groupBy(
        sql`CASE WHEN ${photos.dateTaken} IS NULL THEN NULL ELSE TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') END`,
      )
      .orderBy(
        sql`CASE WHEN ${photos.dateTaken} IS NULL THEN NULL ELSE TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') END DESC`,
      );

    const dates: DateCount[] = dateCountsResult.map(row => ({
      date: row.date,
      count: row.count,
    }));

    return {
      dates,
    };
  } catch (error) {
    console.error('Error fetching album dates:', error);
    throw error;
  }
}

export { getAlbumDates };
