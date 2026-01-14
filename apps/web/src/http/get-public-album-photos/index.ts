import { api } from "../api";
import type {
  GetPublicAlbumPhotosRequest,
  GetPublicAlbumPhotosResponse,
} from "./types";

export async function getPublicAlbumPhotos({
  albumId,
  cursor,
  limit,
  signal,
}: GetPublicAlbumPhotosRequest): Promise<GetPublicAlbumPhotosResponse> {
  try {
    const searchParams: Record<string, string | number> = {};

    if (cursor) {
      searchParams.cursor = cursor;
    }

    if (limit) {
      searchParams.limit = limit;
    }

    const data = await api.get<GetPublicAlbumPhotosResponse>(
      `v1/public/albums/${albumId}/photos`,
      {
        searchParams,
        signal,
        cache: "force-cache",
        next: { tags: [`album-${albumId}-photos`] },
      }
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.message.includes("timeout")) {
        throw new Error(
          "Request timed out while fetching album photos. The server may be processing a large number of photos. Please try again."
        );
      }
      if (error.message.includes("Failed to get album photos")) {
        throw error;
      }
    }
    throw new Error(`Failed to get album photos: ${error}`);
  }
}
