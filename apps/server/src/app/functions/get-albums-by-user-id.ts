import { eq, sql, and } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums } from '@polotrip/db/schema';

import { PaginationQuery } from '@/app/helpers/pagination/types';
import { paginate } from '@/app/helpers/pagination';

interface GetAlbumsByUserIdRequest {
  userId: string;
  pagination?: PaginationQuery;
}

async function getAlbumsByUserId({
  userId,
  pagination = { page: 1, limit: 9 },
}: GetAlbumsByUserIdRequest) {
  if (pagination) {
    const baseQuery = sql`
      SELECT * FROM ${albums}
      WHERE ${albums.userId} = ${userId} AND ${albums.isPaid} = true
      ORDER BY ${albums.createdAt}
    `;

    const countQuery = sql`
      SELECT COUNT(*) FROM ${albums}
      WHERE ${albums.userId} = ${userId} AND ${albums.isPaid} = true
    `;

    const result = await paginate({
      query: pagination,
      baseQuery,
      countQuery,
      db,
    });

    return {
      albums: result?.data,
      pagination: result?.pagination,
    };
  }

  const userAlbums = await db
    .select()
    .from(albums)
    .where(and(eq(albums.userId, userId), eq(albums.isPaid, true)))
    .orderBy(albums.createdAt);

  return { albums: userAlbums };
}

export { getAlbumsByUserId };
