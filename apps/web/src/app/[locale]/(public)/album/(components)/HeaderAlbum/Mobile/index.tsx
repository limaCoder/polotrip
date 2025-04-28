'use client';

import { useState } from 'react';
import { Menu, Share2, Tv } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { ScreenOrientationWithLock } from './types';

const IS_INTERNATIONALIZATION_ENABLED = false;

export function HeaderAlbumMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const handleTvMode = async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    if ('orientation' in screen) {
      try {
        await (screen.orientation as ScreenOrientationWithLock).lock?.('landscape');
      } catch {
        toast.info(
          'Para melhor experiência, gire seu aparelho para o modo paisagem (horizontal).',
          {
            duration: 4000,
            richColors: true,
          },
        );
      }
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
  };

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
          className={`absolute right-0 mt-2 flex flex-col items-center gap-2 transition-all duration-300 origin-top ${
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
          }`}
        >
          <button
            className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center"
            aria-label="Compartilhar"
          >
            <Share2 className="h-6 w-6 text-primary relative -left-0.5" />
          </button>
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
    </div>
  );
}
