import { api } from "../api";
import type { GetPhotosByDateRequest, GetPhotosByDateResponse } from "./types";

export async function getPhotosByDate({
  params,
  query,
}: GetPhotosByDateRequest): Promise<GetPhotosByDateResponse> {
  try {
    const { albumId } = params;

    const data = await api.get<GetPhotosByDateResponse>(
      `v1/albums/${albumId}/photos-by-date`,
      {
        searchParams: query,
      }
    );

    return data;
  } catch (error) {
    throw new Error(`Failed to get photos by date: ${error}`);
  }
}
