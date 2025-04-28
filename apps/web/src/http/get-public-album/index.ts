import { api } from '../api';
import { GetPublicAlbumRequest, GetPublicAlbumResponse } from './types';

export async function getPublicAlbum({
  albumId,
  signal,
}: GetPublicAlbumRequest): Promise<GetPublicAlbumResponse> {
  try {
    const data = await api.get<GetPublicAlbumResponse>(`v1/public/albums/${albumId}`, {
      signal,
      cache: 'force-cache',
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to get public album: ${error}`);
  }
}
