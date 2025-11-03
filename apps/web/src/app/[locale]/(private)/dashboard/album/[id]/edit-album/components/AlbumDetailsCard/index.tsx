"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAlbumDetails } from "@/hooks/network/queries/useAlbumDetails";
import { EditAlbumModal } from "../EditAlbumModal";

export function AlbumDetailsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const t = useTranslations("EditAlbum.AlbumDetailsCard");

  const { data: album, isLoading } = useAlbumDetails(id as string);

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!album) {
    return <div>{t("not_found")}</div>;
  }

  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col items-start justify-between">
          <div>
            <h2 className="mb-2 font-semibold text-xl">{t("title")}</h2>
            <p className="text-gray-500 text-sm">{t("description")}</p>
          </div>
          <button
            aria-label={t("edit_album_button_aria")}
            aria-labelledby={t("edit_album_button_aria")}
            className="mt-2 flex items-center gap-2 font-bold text-primary transition-colors hover:text-primary/80"
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
                className="mt-2 h-32 w-32 rounded-lg object-cover"
                src={album?.coverImageUrl}
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
