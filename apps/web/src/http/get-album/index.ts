import { api } from '../api';
import { GetAlbumRequest, GetAlbumResponse } from './types';

export async function getAlbum({ albumId, signal }: GetAlbumRequest): Promise<GetAlbumResponse> {
  try {
    const data = await api.get<GetAlbumResponse>(`v1/albums/${albumId}`, {
      signal,
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to get album: ${error}`);
  }
}
