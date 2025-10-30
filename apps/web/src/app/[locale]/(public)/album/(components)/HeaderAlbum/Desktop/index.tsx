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
import { useTranslations } from 'next-intl';

const IS_INTERNATIONALIZATION_ENABLED = true;

export function HeaderAlbumDesktop({
  albumTitle,
  albumDescription,
  albumOwnerName,
}: HeaderAlbumProps) {
  const t = useTranslations('PublicAlbum.HeaderAlbum');
  const { handleTvMode } = useDesktopAlbumInTvMode();
  const { id: albumId } = useParams();
  const { isOwner } = useAlbumOwnership();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="hidden md:flex w-full justify-between items-center">
      <Link href="/" className="cursor-pointer">
        <Image src="/brand/logo-white.svg" alt={t('logo_alt')} width={150} height={150} />
      </Link>

      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 text-background hover:text-primary transition-colors"
          aria-label={t('tv_mode_aria')}
          onClick={handleTvMode}
        >
          <Tv size={20} className="text-primary relative top-[-3px]" />
          <span className="font-body_one w-max">{t('tv_mode')}</span>
        </button>

        {isOwner && (
          <button
            className="flex items-center gap-2 text-background hover:text-primary transition-colors"
            aria-label={t('share_aria')}
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 size={20} className="text-primary relative top-[-2px]" />
            <span className="font-body_one w-max">{t('share')}</span>
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
