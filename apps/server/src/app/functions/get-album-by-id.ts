import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, users } from '@polotrip/db/schema';
import { Album } from '@polotrip/db/models';

interface GetAlbumByIdRequest {
  id: string;
}

async function getAlbumById({ id }: GetAlbumByIdRequest) {
  try {
    const album = await db
      .select({
        id: albums.id,
        title: albums.title,
        description: albums.description,
        coverImageUrl: albums.coverImageUrl,
        date: albums.date,
        photoLimit: albums.photoLimit,
        plan: albums.plan,
        userId: albums.userId,
      })
      .from(albums)
      .where(eq(albums.id, id))
      .then(rows => rows[0]);

    if (!album) {
      throw new Error('Album not found');
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
    console.error('Error fetching album by id:', error);
    throw error;
  }
}

export { getAlbumById };
