import { api } from '../api';
import { GetPublicAlbumPhotosRequest, GetPublicAlbumPhotosResponse } from './types';

export async function getPublicAlbumPhotos({
  albumId,
  date,
  cursor,
  limit,
  signal,
}: GetPublicAlbumPhotosRequest): Promise<GetPublicAlbumPhotosResponse> {
  try {
    const searchParams: Record<string, string | number> = {
      date,
    };

    if (cursor) {
      searchParams.cursor = cursor;
    }

    if (limit) {
      searchParams.limit = limit;
    }

    const data = await api.get<GetPublicAlbumPhotosResponse>(`v1/public/albums/${albumId}/photos`, {
      searchParams,
      signal,
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to get public album photos: ${error}`);
  }
}
