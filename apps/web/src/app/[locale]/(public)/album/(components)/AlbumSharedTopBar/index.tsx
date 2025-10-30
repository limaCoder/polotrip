'use client';

import { ArrowLeft, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAlbumShared } from '@/hooks/use-album-shared';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function AlbumSharedTopBar() {
  const t = useTranslations('PublicAlbum.SharedTopBar');
  const { isShared } = useAlbumShared();
  const [isOpen, setIsOpen] = useState(true);

  if (!isShared) return null;

  return (
    <>
      {isOpen ? (
        <div className="w-full bg-primary text-background relative">
          <div className="container mx-auto px-4 lg:px-9 py-3 flex flex-col lg:flex-row items-center justify-between gap-2">
            <p className="font-body_two text-center lg:text-left">{t('greeting')}</p>
            <Link
              href="/sign-in"
              className="flex items-center gap-2 text-background underline transition-colors font-body_two"
            >
              <ArrowLeft size={16} />
              <span>{t('create_your_album')}</span>
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
