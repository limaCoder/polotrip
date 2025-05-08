import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { albums } from '@polotrip/db/schema';
import { db } from '@polotrip/db';
import { getCurrentUser } from '@/lib/auth/server';
import { generateAlbumMetadata } from './metadata';

type PublicAlbumLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export const generateMetadata = generateAlbumMetadata;

export default async function PublicAlbumLayout({ children, params }: PublicAlbumLayoutProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, id))
    .then(rows => rows[0]);

  if (!album) {
    notFound();
  }

  const isOwner = user?.id === album.userId;

  return <div data-is-owner={isOwner}>{children}</div>;
}
