import { db } from '@/db';
import { albums } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
