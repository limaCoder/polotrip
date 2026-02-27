"use client";

import { Share2, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ShareAlbumModal } from "@/components/ShareAlbumModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
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
          className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur-md transition-all hover:border-primary hover:bg-primary"
          onClick={handleTvMode}
          type="button"
        >
          <Tv className="h-4 w-4 text-white group-hover:text-white" />
          <span className="font-heading text-xs uppercase tracking-widest">
            {t("tv_mode")}
          </span>
        </button>

        {isOwner && (
          <button
            aria-label={t("share_aria")}
            className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur-md transition-all hover:border-primary hover:bg-primary"
            onClick={() => setIsShareModalOpen(true)}
            type="button"
          >
            <Share2 className="h-4 w-4 text-white group-hover:text-white" />
            <span className="font-heading text-xs uppercase tracking-widest">
              {t("share")}
            </span>
          </button>
        )}

        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher whiteTrigger />}
        <ThemeSwitcher whiteIcon />
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
