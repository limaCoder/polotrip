import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { albums } from '@polotrip/db/schema';
import { db } from '@polotrip/db';

type PublicAlbumLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default async function PublicAlbumLayout({ children, params }: PublicAlbumLayoutProps) {
  const { id } = await params;

  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, id))
    .then(rows => rows[0]);

  if (!album) {
    notFound();
  }

  return <>{children}</>;
}
