"use client";

import { Menu, Share2, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ShareAlbumModal } from "@/components/ShareAlbumModal";
import { useAlbumOwnership } from "@/hooks/use-album-ownership";
import { useMobileAlbumInTvMode } from "@/hooks/use-mobile-album-in-tv-mode";
import { cn } from "@/lib/cn";
import type { HeaderAlbumProps } from "../types";

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderAlbumMobile({
  albumTitle,
  albumDescription,
  albumOwnerName,
}: HeaderAlbumProps) {
  const t = useTranslations("PublicAlbum.HeaderAlbum");
  const tTvMode = useTranslations("MobileAlbumInTvMode");
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { id: albumId } = useParams();
  const { isOwner } = useAlbumOwnership();

  const { handleTvMode } = useMobileAlbumInTvMode({ t: tTvMode });

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <Link className="cursor-pointer" href="/">
        <Image
          alt={t("logo_alt")}
          height={120}
          src="/brand/logo-white.svg"
          width={120}
        />
      </Link>

      <div className="relative">
        <button
          aria-label={t("open_menu_aria")}
          className="rounded-full bg-white/75 p-3 transition hover:bg-gray-300"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>

        <div
          className={cn(
            "absolute right-0 mt-2 flex origin-top flex-col items-center gap-2 transition-all duration-300",
            isOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-0 opacity-0"
          )}
        >
          {isOwner && (
            <button
              aria-label={t("share_aria")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/75 transition hover:bg-primary hover:text-white"
              onClick={() => {
                setIsShareModalOpen(true);
                setIsOpen(false);
              }}
              type="button"
            >
              <Share2 className="-left-0.5 relative h-6 w-6 text-primary" />
            </button>
          )}
          <button
            aria-label={t("tv_mode_aria")}
            className="active-tv-mode flex h-12 w-12 items-center justify-center rounded-full bg-white/75 transition hover:bg-primary active:bg-primary"
            onClick={handleTvMode}
            type="button"
          >
            <Tv className="h-6 w-6 text-primary" />
          </button>
          {IS_INTERNATIONALIZATION_ENABLED && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/75 transition hover:bg-primary hover:text-white">
              <LocaleSwitcher hideChevron />
            </div>
          )}
        </div>
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
