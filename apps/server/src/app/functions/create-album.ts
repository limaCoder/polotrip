import { db } from '@polotrip/db';
import { albums } from '@polotrip/db/schema';
import { createId } from '@paralleldrive/cuid2';

interface CreateAlbumRequest {
  userId: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
}

async function createAlbum({ userId, title, description, coverImageUrl }: CreateAlbumRequest) {
  const shareableLink = `album=${createId()}`;

  const [album] = await db
    .insert(albums)
    .values({ userId, title, description, coverImageUrl, shareableLink, isPublished: false })
    .returning();

  return { album };
}

export { createAlbum };
