"use server";

import { getTranslations } from "next-intl/server";
import { updateCoverImage } from "./utils/update-cover-image";

type UpdateAlbumCoverState = {
  error?: string;
  success?: boolean;
  coverImageUrl?: string;
};

export async function updateAlbumCover(
  extra: { locale: string },
  _prevState: UpdateAlbumCoverState | null,
  formData: FormData
) {
  const t = await getTranslations({
    locale: extra?.locale,
    namespace: "ServerActions.UpdateAlbumCover",
  });

  try {
    const file = formData.get("file") as File;
    const albumId = formData.get("albumId") as string;
    const currentCoverUrl = formData.get("currentCoverUrl") as string;

    if (!(file && albumId)) {
      return {
        error: t("file_or_albumid_not_provided"),
      };
    }

    const publicUrl = await updateCoverImage(
      extra?.locale as string,
      file,
      albumId,
      currentCoverUrl || null
    );

    return {
      success: true,
      coverImageUrl: publicUrl,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    return {
      error: error instanceof Error ? error.message : t("update_cover_error"),
    };
  }
}
