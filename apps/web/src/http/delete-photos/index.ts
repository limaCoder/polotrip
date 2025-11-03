import { api } from "../api";
import type { DeletePhotosRequest, DeletePhotosResponse } from "./types";

export async function deletePhotos({
  params,
  body,
}: DeletePhotosRequest): Promise<DeletePhotosResponse> {
  try {
    return await api.delete<DeletePhotosResponse>(
      `v1/albums/${params.albumId}/photos`,
      {
        json: body,
      }
    );
  } catch (error) {
    throw new Error(`Failed to delete photos: ${error}`);
  }
}
