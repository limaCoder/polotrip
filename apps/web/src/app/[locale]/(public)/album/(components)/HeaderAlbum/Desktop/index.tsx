'use client';

import Link from 'next/link';
import { Tv, Share2 } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Image from 'next/image';
import { useCallback } from 'react';

const IS_INTERNATIONALIZATION_ENABLED = false;

export function HeaderAlbumDesktop() {
  const handleTvMode = useCallback(async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    const scrollStep = 10;
    const delay = 10;

    function smoothAutoScroll() {
      if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
        window.scrollBy(0, scrollStep);
        setTimeout(smoothAutoScroll, delay);
      }
    }

    smoothAutoScroll();
  }, []);

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
          <Tv size={20} className="text-primary" />
          <span className="font-body_one w-max">Modo TV</span>
        </button>

        <button
          className="flex items-center gap-2 text-background hover:text-primary transition-colors"
          aria-label="Compartilhar"
        >
          <Share2 size={20} className="text-primary" />
          <span className="font-body_one w-max">Compartilhar</span>
        </button>

        {IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher whiteTrigger />}
      </div>
    </div>
  );
}
