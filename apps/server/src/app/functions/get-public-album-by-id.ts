import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, users } from '@polotrip/db/schema';
import { Album } from '@polotrip/db/models';

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
        userId: albums.userId,
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

    const user = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, album.userId))
      .then(rows => rows[0]);

    if (!user) {
      throw new Error('User not found');
    }

    const sanitizedData = album as Album;

    const { userId, ...rest } = sanitizedData;

    return { album: rest, user };
  } catch (error) {
    console.error('Error fetching public album by id:', error);
    throw error;
  }
}

export { getPublicAlbumById };
