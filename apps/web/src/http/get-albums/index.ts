import { api } from "../api";
import type { GetAlbumsRequest, GetAlbumsResponse } from "./types";

export async function getAlbums({
  params,
  signal,
}: GetAlbumsRequest): Promise<GetAlbumsResponse> {
  try {
    const data = await api.get<GetAlbumsResponse>("v1/albums", {
      searchParams: params,
      signal,
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to get albums: ${error}`);
  }
}
