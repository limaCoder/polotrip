import { api } from "../api";
import type { GetAlbumDatesRequest, GetAlbumDatesResponse } from "./types";

export async function getAlbumDates({
  params,
}: GetAlbumDatesRequest): Promise<GetAlbumDatesResponse> {
  try {
    const { albumId } = params;

    const data = await api.get<GetAlbumDatesResponse>(
      `v1/albums/${albumId}/dates`
    );

    return data;
  } catch (error) {
    throw new Error(`Failed to get album dates: ${error}`);
  }
}
