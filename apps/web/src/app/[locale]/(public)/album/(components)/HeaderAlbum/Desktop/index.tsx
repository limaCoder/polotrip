"use client";

import { Share2, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ShareAlbumModal } from "@/components/ShareAlbumModal";
import { useAlbumOwnership } from "@/hooks/use-album-ownership";
import { useDesktopAlbumInTvMode } from "@/hooks/use-desktop-album-in-tv-mode";
import type { HeaderAlbumProps } from "../types";

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderAlbumDesktop({
  albumTitle,
  albumDescription,
  albumOwnerName,
}: HeaderAlbumProps) {
  const t = useTranslations("PublicAlbum.HeaderAlbum");
  const { handleTvMode } = useDesktopAlbumInTvMode();
  const { id: albumId } = useParams();
  const { isOwner } = useAlbumOwnership();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <Link className="cursor-pointer" href="/">
        <Image
          alt={t("logo_alt")}
          height={150}
          src="/brand/logo-white.svg"
          width={150}
        />
      </Link>

      <div className="flex items-center gap-6">
        <button
          aria-label={t("tv_mode_aria")}
          className="flex items-center gap-2 text-background transition-colors hover:text-primary"
          onClick={handleTvMode}
          type="button"
        >
          <Tv className="relative top-[-3px] text-primary" size={20} />
          <span className="w-max font-body_one">{t("tv_mode")}</span>
        </button>

        {isOwner && (
          <button
            aria-label={t("share_aria")}
            className="flex items-center gap-2 text-background transition-colors hover:text-primary"
            onClick={() => setIsShareModalOpen(true)}
            type="button"
          >
            <Share2 className="relative top-[-2px] text-primary" size={20} />
            <span className="w-max font-body_one">{t("share")}</span>
          </button>
        )}

        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher whiteTrigger />}
      </div>

      {isOwner && (
        <ShareAlbumModal
          albumDescription={albumDescription}
          albumId={albumId as string}
          albumOwnerName={albumOwnerName}
          albumTitle={albumTitle}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
