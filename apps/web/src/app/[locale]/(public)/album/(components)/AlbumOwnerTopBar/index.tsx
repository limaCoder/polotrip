"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAlbumOwnership } from "@/hooks/use-album-ownership";
import { Link } from "@/i18n/routing";

export function AlbumOwnerTopBar() {
  const t = useTranslations("PublicAlbum.OwnerTopBar");
  const { isOwner } = useAlbumOwnership();

  if (!isOwner) return null;

  return (
    <div className="w-full bg-primary text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-3 lg:flex-row lg:px-9">
        <p className="text-center font-body_two lg:text-left">
          {t("greeting")}
        </p>
        <Link
          className="flex items-center gap-2 font-body_two text-white transition-colors hover:underline"
          href="/dashboard"
        >
          <ArrowLeft size={16} />
          <span>{t("back_to_dashboard")}</span>
        </Link>
      </div>
    </div>
  );
}
