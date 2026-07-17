import { api } from "../api";
import type { GetVideoRequest, GetVideoResponse } from "./types";

export async function getVideo({
  albumId,
  signal,
}: GetVideoRequest): Promise<GetVideoResponse> {
  try {
    const data = await api.get<GetVideoResponse>(
      `v1/albums/${albumId}/video`,
      {
        signal,
      }
    );

    return data;
  } catch (error) {
    throw new Error(`Failed to get video: ${error}`);
  }
}
