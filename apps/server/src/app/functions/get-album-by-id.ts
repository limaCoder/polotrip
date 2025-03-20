import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos, users } from '@polotrip/db/schema';

interface GetAlbumByIdRequest {
  albumId: string;
}

async function getAlbumById({ albumId }: GetAlbumByIdRequest) {
  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .leftJoin(users, eq(albums.userId, users.id))
    .then(rows => {
      if (rows.length === 0) return null;

      const { albums: albumData, users: userData } = rows[0];

      const userDataValue = userData
        ? {
            id: userData.id,
            name: userData.name,
            avatarUrl: userData.avatarUrl,
          }
        : null;

      return {
        ...albumData,
        user: userDataValue,
      };
    });

  if (!album) {
    throw new Error('Album not found');
  }

  const albumPhotos = await db
    .select()
    .from(photos)
    .where(eq(photos.albumId, albumId))
    .orderBy(photos.order || photos.dateTaken || photos.createdAt);

  const photosByDate = albumPhotos.reduce(
    (acc, photo) => {
      const date = photo.dateTaken
        ? new Date(photo.dateTaken).toISOString().split('T')[0]
        : 'no-date';

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(photo);
      return acc;
    },
    {} as Record<string, typeof albumPhotos>,
  );

  const mapCoordinates = albumPhotos
    .filter(photo => photo.latitude !== null && photo.longitude !== null)
    .map(photo => ({
      id: photo.id,
      latitude: photo.latitude!,
      longitude: photo.longitude!,
      locationName: photo.locationName,
    }));

  return {
    album,
    photos: albumPhotos,
    photosByDate,
    mapCoordinates,
  };
}

export { getAlbumById };
