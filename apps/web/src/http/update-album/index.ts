import { api } from "../api";
import type { UpdateAlbumRequest, UpdateAlbumResponse } from "./types";

export async function updateAlbum({
  params,
  body,
}: UpdateAlbumRequest): Promise<UpdateAlbumResponse> {
  try {
    const { id } = params;

    const response = await api.patch<UpdateAlbumResponse>(`v1/albums/${id}`, {
      json: body,
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to update album: ${error}`);
  }
}
