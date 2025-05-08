'use client';

import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAlbumOwnership } from '@/hooks/use-album-ownership';

export function AlbumOwnerTopBar() {
  const { isOwner } = useAlbumOwnership();

  if (!isOwner) return null;

  return (
    <div className="w-full bg-primary text-background">
      <div className="container mx-auto px-4 lg:px-9 py-2 flex items-center justify-between">
        <p className="font-body_two">👋 Oi! Este é o seu álbum sendo visualizado como público.</p>
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
