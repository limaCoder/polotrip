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
    <div className="relative flex h-[430px] w-full flex-col justify-between md:h-[510px]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/75 via-transparent to-transparent" />
        <Image
          alt={t("cover_alt")}
          className="object-cover"
          fill
          priority
          quality={100}
          sizes="100vw"
          src={coverImageUrl}
        />
      </div>

      <HeaderAlbum
        albumDescription={albumData?.album?.description || ""}
        albumOwnerName={albumOwnerName}
        albumTitle={albumData?.album?.title}
      />

      <div className="relative z-20 flex w-full flex-col items-start p-4 sm:p-8 md:pb-10 md:pl-12">
        <h1 className="font-bold font-title_one text-4xl text-secondary md:text-5xl lg:text-6xl">
          {albumData?.album?.title}
        </h1>

        {albumData?.album?.description && (
          <p className="pt-2 font-bold font-title_three text-lg text-white md:text-2xl">
            {albumData?.album?.description}
          </p>
        )}
      </div>
    </div>
  );
}
