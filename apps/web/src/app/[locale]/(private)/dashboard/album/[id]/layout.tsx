import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { albums } from '@polotrip/db/schema';
import { db } from '@polotrip/db';
import { getCurrentUser } from '@/lib/auth/server';

export default async function AlbumProtectedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();

  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, id))
    .then(rows => rows[0]);

  if (album?.userId !== user?.id) {
    notFound();
  }

  return <>{children}</>;
}
