import Link from 'next/link';
import { FullscreenIcon, Share2 } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export function HeaderAlbumDesktop() {
  return (
    <div className="hidden md:flex w-full justify-between items-center">
      <Link href="/" className="cursor-pointer">
        <img src="/brand/logo-white.svg" alt="Logo" className="w-[150px] md:w-[180px]" />
      </Link>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-background hover:text-primary transition-colors">
          <FullscreenIcon size={20} className="text-primary" />
          <span className="font-body_one w-max">Tela cheia</span>
        </button>

        <button className="flex items-center gap-2 text-background hover:text-primary transition-colors">
          <Share2 size={20} className="text-primary" />
          <span className="font-body_one w-max">Compartilhar</span>
        </button>

        <LocaleSwitcher whiteTrigger />
      </div>
    </div>
  );
}
