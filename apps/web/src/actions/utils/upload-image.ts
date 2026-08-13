import sharp from "sharp";
import { api } from "@/http/api";

export async function uploadImage(
  file: File,
  albumId?: string,
  currentCoverUrl?: string | null
): Promise<string> {
  if (!file) {
    return "";
  }

  try {
    const fileExtension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
    const mimeType = file.type || `image/${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const compressedBuffer = await sharp(inputBuffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .toBuffer();

    const { coverImageUrl } = await api.post<{ coverImageUrl: string }>(
      "v1/albums/cover-images",
      {
        json: {
          albumId: albumId ?? null,
          currentCoverUrl: currentCoverUrl ?? null,
          contentType: mimeType,
          data: Buffer.from(compressedBuffer).toString("base64"),
        },
      }
    );

    return coverImageUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to process image upload");
  }
}
