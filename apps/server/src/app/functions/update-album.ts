import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';

interface UpdateAlbumRequest {
  albumId: string;
  userId: string;
  title?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  spotifyTrackId?: string | null;
  spotifyPlaylistId?: string | null;
  isPublished?: boolean;
  photoUpdates?: {
    id: string;
    locationName?: string | null;
    description?: string | null;
    order?: string | null;
  }[];
}

async function updateAlbum({
  albumId,
  userId,
  title,
  description,
  coverImageUrl,
  spotifyTrackId,
  spotifyPlaylistId,
  isPublished,
  photoUpdates,
}: UpdateAlbumRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then(rows => rows[0]);

  if (!album) {
    throw new Error('Album not found');
  }

  if (album.userId !== userId) {
    throw new Error('Album does not belong to the user');
  }

  const [updatedAlbum] = await db
    .update(albums)
    .set({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(coverImageUrl !== undefined && { coverImageUrl }),
      ...(spotifyTrackId !== undefined && { spotifyTrackId }),
      ...(spotifyPlaylistId !== undefined && { spotifyPlaylistId }),
      ...(isPublished !== undefined && { isPublished }),
      updatedAt: new Date(),
    })
    .where(eq(albums.id, albumId))
    .returning();

  if (photoUpdates && photoUpdates.length > 0) {
    for (const photoUpdate of photoUpdates) {
      await db
        .update(photos)
        .set({
          ...(photoUpdate.locationName !== undefined && { locationName: photoUpdate.locationName }),
          ...(photoUpdate.description !== undefined && { description: photoUpdate.description }),
          ...(photoUpdate.order !== undefined && { order: photoUpdate.order }),
          updatedAt: new Date(),
        })
        .where(eq(photos.id, photoUpdate.id));
    }
  }

  const albumPhotos = await db
    .select()
    .from(photos)
    .where(eq(photos.albumId, albumId))
    .orderBy(photos.order || photos.dateTaken || photos.createdAt);

  return { album: updatedAlbum, photos: albumPhotos };
}

export { updateAlbum };
