import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getPublicAlbum } from "@/http/get-public-album";
import { HeaderAlbum } from "../HeaderAlbum";
import type { AlbumCoverSectionProps } from "./types";

export async function AlbumCoverContent({
  albumId,
  locale,
}: AlbumCoverSectionProps) {
  const t = await getTranslations({ locale, namespace: "PublicAlbum" });
  const albumData = await getPublicAlbum({ albumId });

  const coverImageUrl = albumData?.album?.coverImageUrl
    ? albumData?.album?.coverImageUrl
    : "/pages/album/album-cover-placeholder.jpg";

  const albumOwnerName = albumData?.user?.name?.split(" ")[0];

  return (
    <div className="relative flex min-h-[500px] w-full flex-col justify-between py-4 lg:min-h-[600px] lg:py-8">
      {/* Background paper frame */}
      <div className="viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')] absolute inset-2 z-0 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[url('data:image/svg+xml,%3Csvg before:mix-blend-multiply sm:inset-4 sm:p-3 lg:inset-6 lg:rounded-3xl lg:p-5 lg:pb-10 lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] lg:before:rounded-3xl">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-background/20 shadow-[inner_0_4px_20px_rgba(0,0,0,0.2)] lg:rounded-2xl">
          <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-black/60" />
          <Image
            alt={t("cover_alt")}
            className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
            fill
            priority
            quality={100}
            sizes="100vw"
            src={coverImageUrl}
          />
        </div>
      </div>

      <div className="relative z-20 mt-2 px-4 sm:mt-4 lg:mt-6">
        <HeaderAlbum
          albumDescription={albumData?.album?.description || ""}
          albumOwnerName={albumOwnerName}
          albumTitle={albumData?.album?.title}
        />
      </div>

      <div className="relative z-20 flex w-full flex-col items-center px-6 pb-6 text-center sm:pb-16 lg:items-start lg:pb-20 lg:pl-16 lg:text-left">
        <h1 className="font-bold font-heading text-4xl text-white tracking-tight drop-shadow-md sm:text-5xl md:text-6xl xl:text-7xl">
          {albumData?.album?.title}
        </h1>

        {albumData?.album?.description && (
          <p className="max-w-2xl font-body_one text-lg text-white/90 drop-shadow sm:text-xl lg:mt-2 lg:text-2xl">
            {albumData?.album?.description}
          </p>
        )}
      </div>
    </div>
  );
}
