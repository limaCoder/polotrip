import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums } from '@polotrip/db/schema';

interface GetAlbumsByUserIdRequest {
  userId: string;
}

async function getAlbumsByUserId({ userId }: GetAlbumsByUserIdRequest) {
  const userAlbums = await db
    .select()
    .from(albums)
    .where(eq(albums.userId, userId))
    .orderBy(albums.createdAt);

  return { albums: userAlbums };
}

export { getAlbumsByUserId };
