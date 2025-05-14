'use client';

import Link from 'next/link';
import { Tv, Share2 } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Image from 'next/image';
import { useDesktopAlbumInTvMode } from '@/hooks/use-desktop-album-in-tv-mode';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ShareAlbumModal } from '@/components/ShareAlbumModal';
import { useAlbumOwnership } from '@/hooks/use-album-ownership';
import { HeaderAlbumProps } from '../types';
const IS_INTERNATIONALIZATION_ENABLED = false;

export function HeaderAlbumDesktop({
  albumTitle,
  albumDescription,
  albumOwnerName,
}: HeaderAlbumProps) {
  const { handleTvMode } = useDesktopAlbumInTvMode();
  const { id: albumId } = useParams();
  const { isOwner } = useAlbumOwnership();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="hidden md:flex w-full justify-between items-center">
      <Link href="/" className="cursor-pointer">
        <Image src="/brand/logo-white.svg" alt="Logo" width={150} height={150} />
      </Link>

      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 text-background hover:text-primary transition-colors"
          aria-label="Modo TV"
          onClick={handleTvMode}
        >
          <Tv size={20} className="text-primary relative top-[-3px]" />
          <span className="font-body_one w-max">Modo TV</span>
        </button>

        {isOwner && (
          <button
            className="flex items-center gap-2 text-background hover:text-primary transition-colors"
            aria-label="Compartilhar"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 size={20} className="text-primary relative top-[-2px]" />
            <span className="font-body_one w-max">Compartilhar</span>
          </button>
        )}

        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher whiteTrigger />}
      </div>

      {isOwner && (
        <ShareAlbumModal
          albumId={albumId as string}
          albumTitle={albumTitle}
          albumDescription={albumDescription}
          albumOwnerName={albumOwnerName}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
