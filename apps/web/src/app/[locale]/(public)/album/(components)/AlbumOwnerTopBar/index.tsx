'use client';

import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAlbumOwnership } from '@/hooks/use-album-ownership';

export function AlbumOwnerTopBar() {
  const { isOwner } = useAlbumOwnership();

  if (!isOwner) return null;

  return (
    <div className="w-full bg-primary text-background">
      <div className="container mx-auto px-4 lg:px-9 py-3 flex flex-col lg:flex-row items-center justify-between gap-2">
        <p className="font-body_two text-center lg:text-left">
          👋 Oi! Este é o seu álbum sendo visualizado como público.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-background hover:text-secondary transition-colors font-body_two"
        >
          <ArrowLeft size={16} />
          <span>Voltar para Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
