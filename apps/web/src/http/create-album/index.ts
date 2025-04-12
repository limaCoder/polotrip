import { api } from '../api';
import { CreateAlbumRequest, CreateAlbumResponse } from './types';

export async function createAlbum({ body }: CreateAlbumRequest): Promise<CreateAlbumResponse> {
  try {
    const data = await api.post<CreateAlbumResponse>('v1/albums', {
      json: body,
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to create album: ${error}`);
  }
}
