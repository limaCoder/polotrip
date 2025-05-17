'use client';

import { ArrowLeft, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAlbumShared } from '@/hooks/use-album-shared';
import { useState } from 'react';

export function AlbumSharedTopBar() {
  const { isShared } = useAlbumShared();
  const [isOpen, setIsOpen] = useState(true);

  if (!isShared) return null;

  return (
    <>
      {isOpen ? (
        <div className="w-full bg-primary text-background relative">
          <div className="container mx-auto px-4 lg:px-9 py-3 flex flex-col lg:flex-row items-center justify-between gap-2">
            <p className="font-body_two text-center lg:text-left">
              👋 Oi! Venha criar o seu álbum com a gente!
            </p>
            <Link
              href="/"
              className="flex items-center gap-2 text-background hover:underline transition-colors font-body_two"
            >
              <ArrowLeft size={16} />
              <span>Voltar para Home</span>
            </Link>
          </div>
          <button
            className="bg-none border-none absolute bottom-0 right-0 p-3"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      ) : null}
    </>
  );
}
