import { db } from "@polotrip/db";
import type { Album } from "@polotrip/db/models";
import { albums } from "@polotrip/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { paginate } from "@/app/helpers/pagination";
import type { PaginationQuery } from "@/app/helpers/pagination/types";

type GetAlbumsByUserIdRequest = {
  userId: string;
  pagination?: PaginationQuery;
};

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

    const sanitizedData = result?.data?.map((album) => {
      const albumData = album as Album;

      const { userId: removedUserId, ...rest } = albumData;

      return rest;
    });

    return {
      albums: sanitizedData,
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
