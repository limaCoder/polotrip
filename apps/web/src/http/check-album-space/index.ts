import { api } from '../api';
import { CheckAlbumSpaceRequest, CheckAlbumSpaceResponse } from './types';

export async function checkAlbumSpace({ params }: CheckAlbumSpaceRequest) {
  try {
    const { albumId } = params;

    const data = await api.get<CheckAlbumSpaceResponse>(`v1/albums/${albumId}/check-space`);

    return data;
  } catch (error) {
    throw new Error(`Failed to check album space: ${error}`);
  }
}
