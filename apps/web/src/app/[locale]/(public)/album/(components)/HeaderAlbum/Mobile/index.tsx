'use client';

import { useState } from 'react';
import { Menu, Share2, FullscreenIcon } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Link from 'next/link';

export function HeaderAlbumMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex md:hidden w-full justify-between items-center">
      <Link href="/" className="cursor-pointer">
        <img src="/brand/logo-white.svg" alt="Logo" className="w-[120px]" />
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="p-3 rounded-full bg-white/75 hover:bg-gray-300 transition"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>

        <div
          className={`absolute right-0 mt-2 flex flex-col items-center gap-2 transition-all duration-300 origin-top ${
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
          }`}
        >
          <button className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center">
            <Share2 className="h-6 w-6 text-primary relative -left-0.5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center">
            <FullscreenIcon className="h-6 w-6 text-primary" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/75 hover:bg-primary hover:text-white transition flex items-center justify-center">
            <LocaleSwitcher hideChevron />
          </button>
        </div>
      </div>
    </div>
  );
}
