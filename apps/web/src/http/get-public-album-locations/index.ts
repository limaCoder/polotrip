import { api } from "../api";
import type {
  GetPublicAlbumLocationsRequest,
  GetPublicAlbumLocationsResponse,
} from "./types";

export async function getPublicAlbumLocations({
  albumId,
  signal,
}: GetPublicAlbumLocationsRequest): Promise<GetPublicAlbumLocationsResponse> {
  try {
    const data = await api.get<GetPublicAlbumLocationsResponse>(
      `v1/public/albums/${albumId}/locations`,
      {
        signal,
      }
    );

    return data;
  } catch (error) {
    throw new Error(`Failed to get public album locations: ${error}`);
  }
}
