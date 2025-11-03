import { api } from "../api";
import type {
  GetSignedUrlsRequest,
  GetSignedUrlsResponse,
  SaveUploadedPhotosRequest,
  SaveUploadedPhotosResponse,
} from "./types";

export async function getSignedUrls({
  params,
  body,
}: GetSignedUrlsRequest): Promise<GetSignedUrlsResponse> {
  try {
    return await api.post<GetSignedUrlsResponse>("v1/albums/upload-urls", {
      searchParams: params,
      json: body,
    });
  } catch (error) {
    throw new Error(`Failed to get upload URLs: ${error}`);
  }
}

export async function saveUploadedPhotos({
  body,
}: SaveUploadedPhotosRequest): Promise<SaveUploadedPhotosResponse> {
  try {
    return await api.post<SaveUploadedPhotosResponse>("v1/albums/photos/save", {
      json: body,
    });
  } catch (error) {
    throw new Error(`Failed to save photos information: ${error}`);
  }
}
