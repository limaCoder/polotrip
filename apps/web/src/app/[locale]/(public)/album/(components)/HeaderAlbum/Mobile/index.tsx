'use client';

import { useState } from 'react';
import { Menu, Share2, Tv } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Link from 'next/link';
import Image from 'next/image';
import { useMobileAlbumInTvMode } from '@/hooks/use-mobile-album-in-tv-mode';
import { cn } from '@/lib/cn';
import { useParams } from 'next/navigation';
import { ShareAlbumModal } from '@/components/ShareAlbumModal';
import { useAlbumOwnership } from '@/hooks/use-album-ownership';
import { HeaderAlbumProps } from '../types';

const IS_INTERNATIONALIZATION_ENABLED = false;

export function HeaderAlbumMobile({ albumTitle, albumDescription }: HeaderAlbumProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { id: albumId } = useParams();
  const { isOwner } = useAlbumOwnership();

  const { handleTvMode } = useMobileAlbumInTvMode();

  return (
    <div className="flex md:hidden w-full justify-between items-center">
      <Link href="/" className="cursor-pointer">
        <Image src="/brand/logo-white.svg" alt="Logo" width={120} height={120} />
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="p-3 rounded-full bg-white/75 hover:bg-gray-300 transition"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>

        <div
          className={cn(
            'absolute right-0 mt-2 flex flex-col items-center gap-2 transition-all duration-300 origin-top',
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none',
          )}
        >
          {isOwner && (
            <button
              className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center"
              aria-label="Compartilhar"
              onClick={() => {
                setIsShareModalOpen(true);
                setIsOpen(false);
              }}
            >
              <Share2 className="h-6 w-6 text-primary relative -left-0.5" />
            </button>
          )}
          <button
            className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center"
            aria-label="Modo TV"
            onClick={handleTvMode}
          >
            <Tv className="h-6 w-6 text-primary" />
          </button>
          {IS_INTERNATIONALIZATION_ENABLED && (
            <div className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center">
              <LocaleSwitcher hideChevron />
            </div>
          )}
        </div>
      </div>

      {isOwner && (
        <ShareAlbumModal
          albumId={albumId as string}
          albumTitle={albumTitle}
          albumDescription={albumDescription}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
