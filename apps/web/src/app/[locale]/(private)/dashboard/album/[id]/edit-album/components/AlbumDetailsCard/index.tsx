"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAlbumDetails } from "@/hooks/network/queries/useAlbumDetails";
import { EditAlbumModal } from "../EditAlbumModal";
import { AlbumDetailsCardSkeleton } from "../skeletons";

export function AlbumDetailsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const t = useTranslations("EditAlbum.AlbumDetailsCard");

  const { data: album, isLoading } = useAlbumDetails(id as string);

  if (isLoading) {
    return <AlbumDetailsCardSkeleton />;
  }

  if (!album) {
    return <div>{t("not_found")}</div>;
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-background/20 bg-background/40 p-6 shadow-xl backdrop-blur-xl transition-all duration-300">
        <div className="mb-6 flex flex-col items-start justify-between gap-4">
          <div>
            <h2 className="mb-1 font-bold font-title_three text-xl tracking-tight">
              {t("title")}
            </h2>
            <p className="font-body_two text-sm text-text/70">
              {t("description")}
            </p>
          </div>
          <button
            aria-label={t("edit_album_button_aria")}
            aria-labelledby={t("edit_album_button_aria")}
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-body_two font-bold text-primary text-sm transition-all hover:bg-primary hover:text-white"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <Pencil size={16} />
            {t("edit_album_button")}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-500 text-sm">
              {t("field_title")}
            </h3>
            <p className="mt-1">{album?.title}</p>
          </div>

          {album?.description && (
            <div>
              <h3 className="font-medium text-gray-500 text-sm">
                {t("field_description")}
              </h3>
              <p className="mt-1">{album?.description}</p>
            </div>
          )}

          {album?.coverImageUrl && (
            <div>
              <h3 className="font-medium text-gray-500 text-sm">
                {t("field_cover_image")}
              </h3>
              <Image
                alt={t("cover_image_alt")}
                className="mt-2 aspect-square rounded-lg object-cover"
                height={320}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={album?.coverImageUrl}
                width={320}
              />
            </div>
          )}
        </div>
      </div>

      <EditAlbumModal
        albumId={album.id}
        initialData={album}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
