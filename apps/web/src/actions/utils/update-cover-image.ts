import { getTranslations } from "next-intl/server";
import { uploadImage } from "./upload-image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export async function updateCoverImage(
  locale: string,
  file: File,
  albumId: string,
  currentCoverUrl?: string | null
): Promise<string> {
  const t = await getTranslations({
    locale,
    namespace: "ServerActions.UpdateCoverImage",
  });

  if (!file) {
    throw new Error(t("no_file_provided"));
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(t("file_too_large_5mb"));
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(t("unsupported_format_png_jpg"));
  }

  try {
    return await uploadImage(file, albumId, currentCoverUrl);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(t("image_processing_error"));
  }
}
