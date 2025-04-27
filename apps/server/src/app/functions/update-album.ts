import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';
import {
  groupPhotoUpdates,
  PhotoUpdate,
  updateMultiplePhotos,
  updateSinglePhoto,
} from '../helpers/update-album';

interface UpdateAlbumRequest {
  albumId: string;
  userId: string;
  title?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  spotifyTrackId?: string | null;
  spotifyPlaylistId?: string | null;
  isPublished?: boolean;
  photoUpdates?: PhotoUpdate[];
  currentStepAfterPayment?: string;
}

type AlbumStep = 'upload' | 'organize' | 'published';

interface AlbumUpdateData {
  title?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  spotifyTrackId?: string | null;
  spotifyPlaylistId?: string | null;
  isPublished?: boolean;
  currentStepAfterPayment?: AlbumStep;
  updatedAt: Date;
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
  currentStepAfterPayment,
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

  return await db.transaction(async tx => {
    const albumUpdateData: AlbumUpdateData = {
      updatedAt: new Date(),
    };

    const optionalFields = {
      title,
      description,
      coverImageUrl,
      spotifyTrackId,
      spotifyPlaylistId,
      isPublished,
    };

    const fieldsToUpdate = Object.entries(optionalFields).reduce(
      (acc, [key, value]) => {
        const typedKey = key as keyof typeof optionalFields;
        if (typedKey === 'title' ? value : value !== undefined) {
          acc[typedKey] = value;
        }
        return acc;
      },
      {} as Record<string, string | boolean | null | undefined>,
    );

    Object.assign(albumUpdateData, fieldsToUpdate);

    if (
      currentStepAfterPayment &&
      ['upload', 'organize', 'published'].includes(currentStepAfterPayment)
    ) {
      albumUpdateData.currentStepAfterPayment = currentStepAfterPayment as AlbumStep;
    }

    const [updatedAlbum] = await tx
      .update(albums)
      .set(albumUpdateData)
      .where(eq(albums.id, albumId))
      .returning();

    if (photoUpdates?.length) {
      const updateGroups = groupPhotoUpdates(photoUpdates);

      for (const group of updateGroups) {
        if (group.length === 1) {
          await updateSinglePhoto(tx, group[0]);
        } else {
          await updateMultiplePhotos(tx, group);
        }
      }
    }

    await tx
      .select()
      .from(photos)
      .where(eq(photos.albumId, albumId))
      .orderBy(photos.order || photos.dateTaken || photos.createdAt);

    const { userId: removedUserId, ...album } = updatedAlbum;

    return {
      success: true,
      album,
      message: 'Album updated successfully',
    };
  });
}

export { updateAlbum };
