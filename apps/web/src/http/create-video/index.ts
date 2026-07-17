import { api } from "../api";
import type { CreateVideoRequest, CreateVideoResponse } from "./types";

export async function createVideo({
  albumId,
  body,
}: CreateVideoRequest): Promise<CreateVideoResponse> {
  try {
    const data = await api.post<CreateVideoResponse>(
      `v1/albums/${albumId}/video/create`,
      {
        json: body,
      }
    );

    return data;
  } catch (error) {
    throw new Error(`Failed to create video: ${error}`);
  }
}
