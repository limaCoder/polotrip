import { db } from '@polotrip/db';
import { albums } from '@polotrip/db/schema';
import { createId } from '@paralleldrive/cuid2';

interface CreateAlbumRequest {
  userId: string;
  title: string;
  date: string;
  description?: string | null;
  coverImageUrl?: string | null;
}

async function createAlbum({
  userId,
  title,
  date,
  description,
  coverImageUrl,
}: CreateAlbumRequest) {
  const shareableLink = `album=${createId()}`;

  const [album] = await db
    .insert(albums)
    .values({
      userId,
      title,
      date,
      description,
      coverImageUrl,
      shareableLink,
      isPublished: false,
      isPaid: false,
    })
    .returning();

  return { album };
}

export { createAlbum };
