"use client";

import { ArrowLeft, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAlbumShared } from "@/hooks/use-album-shared";
import { Link } from "@/i18n/routing";

export function AlbumSharedTopBar() {
  const t = useTranslations("PublicAlbum.SharedTopBar");
  const { isShared } = useAlbumShared();
  const [isOpen, setIsOpen] = useState(true);

  if (!isShared) return null;

  return (
    <>
      {isOpen ? (
        <div className="relative w-full bg-primary text-white">
          <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-3 lg:flex-row lg:px-9">
            <p className="text-center font-body_two lg:text-left">
              {t("greeting")}
            </p>
            <Link
              className="flex items-center gap-2 font-body_two text-white underline transition-colors"
              href="/sign-in"
            >
              <ArrowLeft size={16} />
              <span>{t("create_your_album")}</span>
            </Link>
          </div>
          <button
            className="absolute right-0 bottom-0 border-none bg-none p-3"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <X size={24} />
          </button>
        </div>
      ) : null}
    </>
  );
}
