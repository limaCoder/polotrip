import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPublicAlbum } from "@/http/get-public-album";
import { getPublicAlbumLocations } from "@/http/get-public-album-locations";
import { PublicPhotoMap } from "../PublicPhotoMap";
import type { LocationsSectionProps } from "./types";

export async function LocationsContent({
  albumId,
  locale,
}: LocationsSectionProps) {
  const t = await getTranslations({ locale, namespace: "PublicAlbum" });
  const [albumData, locationsData] = await Promise.all([
    getPublicAlbum({ albumId }),
    getPublicAlbumLocations({ albumId }),
  ]);

  if (locationsData.locations.length === 0) {
    return null;
  }

  const albumOwnerName = albumData?.user?.name?.split(" ")[0] || "";

  return (
    <section className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <MapPin className="hidden h-8 w-8 text-secondary md:block" />
        <h2 className="font-heading text-2xl text-secondary md:text-4xl">
          {t("moments_title", { ownerName: albumOwnerName })}
        </h2>
      </div>
      <div className="h-[400px] w-full overflow-hidden rounded-lg">
        <PublicPhotoMap locationsPromise={Promise.resolve(locationsData)} />
      </div>
    </section>
  );
}
