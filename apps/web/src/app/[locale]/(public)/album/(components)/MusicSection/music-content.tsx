import { Music } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPublicAlbum } from "@/http/get-public-album";
import type { MusicSectionProps } from "./types";

export async function MusicContent({ albumId, locale }: MusicSectionProps) {
  const t = await getTranslations({ locale, namespace: "PublicAlbum" });
  const albumData = await getPublicAlbum({ albumId });

  if (!albumData?.album?.musicUrl) {
    return null;
  }

  return (
    <section className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Music className="hidden h-8 w-8 text-secondary md:block" />
        <h2 className="font-title_two text-2xl text-secondary md:text-4xl">
          {t("music_title")}
        </h2>
      </div>
      <div className="h-[350px] w-full overflow-hidden rounded-lg">
        <div className="aspect-video w-full" id="youtube-player" />
      </div>
    </section>
  );
}
