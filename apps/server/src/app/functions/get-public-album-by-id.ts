import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums } from '@polotrip/db/schema';

interface GetPublicAlbumByIdRequest {
  id: string;
}

async function getPublicAlbumById({ id }: GetPublicAlbumByIdRequest) {
  try {
    const album = await db
      .select({
        id: albums.id,
        title: albums.title,
        description: albums.description,
        coverImageUrl: albums.coverImageUrl,
        date: albums.date,
        isPublished: albums.isPublished,
      })
      .from(albums)
      .where(eq(albums.id, id))
      .then(rows => rows[0]);

    if (!album) {
      throw new Error('Album not found');
    }

    if (!album.isPublished) {
      throw new Error('Album is not published');
    }

    return { album };
  } catch (error) {
    console.error('Error fetching public album by id:', error);
    throw error;
  }
}

export { getPublicAlbumById };
