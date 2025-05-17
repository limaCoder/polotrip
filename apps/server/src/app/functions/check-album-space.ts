import { eq, sql } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';

interface CheckAlbumSpaceRequest {
  albumId: string;
  userId: string;
}

interface CheckAlbumSpaceResponse {
  availableSpace: number;
  totalSpace: number;
  usedSpace: number;
  canUpload: boolean;
}

async function checkAlbumSpace({
  albumId,
  userId,
}: CheckAlbumSpaceRequest): Promise<CheckAlbumSpaceResponse> {
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

  const currentPhotos = await db
    .select({ count: sql`count(*)` })
    .from(photos)
    .where(eq(photos.albumId, albumId))
    .then(rows => Number(rows[0]?.count || 0));

  const totalSpace = album.photoLimit;
  const usedSpace = currentPhotos;
  const availableSpace = totalSpace - usedSpace;
  const canUpload = availableSpace > 0;

  return {
    availableSpace,
    totalSpace,
    usedSpace,
    canUpload,
  };
}

export { checkAlbumSpace };
