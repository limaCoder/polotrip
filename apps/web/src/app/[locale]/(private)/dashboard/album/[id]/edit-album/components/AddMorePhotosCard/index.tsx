"use client";

import { Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCheckAlbumSpace } from "@/hooks/network/queries/useCheckAlbumSpace";

export function AddMorePhotosCard() {
  const { id: albumId, locale } = useParams<{ id: string; locale: string }>();
  const router = useRouter();
  const t = useTranslations("EditAlbum.AddMorePhotosCard");

  const { data: albumSpace, isLoading } = useCheckAlbumSpace({
    albumId,
  });

  const handleAddMorePhotos = () => {
    if (!albumSpace?.canUpload) {
      toast.error(t("limit_exceeded_error_title"), {
        description: t("limit_exceeded_error_description"),
        duration: 5000,
        richColors: true,
      });
      return;
    }

    router.push(`/${locale}/dashboard/album/${albumId}/upload`);
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return t("checking_space");
    }

    if (!albumSpace?.canUpload) {
      return t("limit_reached");
    }

    if (albumSpace.availableSpace === 1) {
      return t("space_available_singular", {
        count: albumSpace.availableSpace,
      });
    }

    return t("space_available_plural", { count: albumSpace.availableSpace });
  };

  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-3 flex items-center gap-3">
        <Upload className="text-primary" size={24} />
        <h2 className="font-bold font-title_three">{t("title")}</h2>
      </div>

      <p className="mb-6 font-body_two text-text/75">{getStatusMessage()}</p>

      <Button
        aria-label={t("add_more_photos_button_aria")}
        className="flex w-full items-center justify-center gap-2 rounded bg-primary px-8 py-3 font-body_two text-background hover:bg-primary/90"
        disabled={isLoading || !albumSpace?.canUpload}
        onClick={handleAddMorePhotos}
      >
        <Upload size={16} />
        <span>{t("add_more_photos_button")}</span>
      </Button>
    </div>
  );
}
