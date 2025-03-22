import { api } from '../api';
import { GetAlbumsResponse } from './types';

export async function getAlbums(): Promise<GetAlbumsResponse> {
  try {
    const data = await api.get<GetAlbumsResponse>('api/albums');

    return data.response;
  } catch (error) {
    throw new Error(`Failed to get albums: ${error}`);
  }
}
