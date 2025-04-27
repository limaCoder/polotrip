import { and, eq, isNotNull } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums, photos } from '@polotrip/db/schema';

interface GetPublicAlbumLocationsRequest {
  albumId: string;
}

async function getPublicAlbumLocations({ albumId }: GetPublicAlbumLocationsRequest) {
  try {
    const album = await db
      .select({ id: albums.id, isPublished: albums.isPublished })
      .from(albums)
      .where(eq(albums.id, albumId))
      .then(rows => rows[0]);

    if (!album) {
      throw new Error('Album not found');
    }

    if (!album.isPublished) {
      throw new Error('Album is not published');
    }

    const locations = await db
      .select({
        id: photos.id,
        latitude: photos.latitude,
        longitude: photos.longitude,
        locationName: photos.locationName,
        dateTaken: photos.dateTaken,
        imageUrl: photos.imageUrl,
      })
      .from(photos)
      .where(
        and(eq(photos.albumId, album.id), isNotNull(photos.latitude), isNotNull(photos.longitude)),
      );

    return { locations };
  } catch (error) {
    console.error('Error fetching public album locations:', error);
    throw error;
  }
}

export { getPublicAlbumLocations };
