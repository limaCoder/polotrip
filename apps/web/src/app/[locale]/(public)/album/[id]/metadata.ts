import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPublicAlbum } from "@/http/get-public-album";

export async function generateAlbumMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id: albumId, locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "PublicAlbum.metadata",
  });

  const albumData = await getPublicAlbum({ albumId }).catch(() => null);

  if (!albumData) {
    return {
      title: t("not_found_title"),
    };
  }

  return {
    title: `${albumData?.album?.title} | Polotrip`,
    description: albumData?.album?.description || t("default_description"),
    openGraph: {
      title: `${albumData?.album?.title} | Polotrip`,
      description: albumData?.album?.description || t("default_description"),
      type: "article",
      images: [
        {
          url:
            albumData?.album?.coverImageUrl ||
            "https://polotrip.com/openGraph/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
