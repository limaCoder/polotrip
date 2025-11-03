import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { paginate } from "@/app/helpers/pagination";
import type { PaginationQuery } from "@/app/helpers/pagination/types";
import { InternalServerError } from "@/http/errors/api-error";

type GetPhotosByDateRequest = {
  albumId: string;
  userId: string;
  date?: string;
  noDate?: boolean;
  pagination?: PaginationQuery;
};

async function getPhotosByDate({
  albumId,
  userId,
  date,
  noDate = false,
  pagination = { page: 1, limit: 20 },
}: GetPhotosByDateRequest) {
  try {
    const album = await db
      .select()
      .from(albums)
      .where(eq(albums.id, albumId))
      .then((rows) => rows[0]);

    if (!album) {
      throw new Error("Album not found");
    }

    if (album.userId !== userId) {
      throw new Error("Album does not belong to user");
    }

    // biome-ignore lint/suspicious/noEvolvingTypes: we need to use any type here
    // biome-ignore lint/suspicious/noImplicitAnyLet: we need to use any type here
    let baseQueryFilter;
    if (noDate) {
      baseQueryFilter = and(
        eq(photos.albumId, albumId),
        isNull(photos.dateTaken)
      );
    } else if (date) {
      baseQueryFilter = and(
        eq(photos.albumId, albumId),
        sql`${photos.dateTaken} IS NOT NULL AND TO_CHAR(${photos.dateTaken}::timestamp, 'YYYY-MM-DD') = TO_CHAR(${date}::timestamp, 'YYYY-MM-DD')`
      );
    } else {
      baseQueryFilter = eq(photos.albumId, albumId);
    }

    const baseQuery = sql`
      SELECT * FROM ${photos}
      WHERE ${baseQueryFilter}
      ORDER BY ${photos.order} IS NULL, ${photos.order}, ${photos.createdAt}
    `;

    const countQuery = sql`
      SELECT COUNT(*) FROM ${photos}
      WHERE ${baseQueryFilter}
    `;

    const result = await paginate({
      query: pagination,
      baseQuery,
      countQuery,
      db,
    });

    return {
      photos: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    throw new InternalServerError(
      "Failed to process the request.",
      "INTERNAL_SERVER_ERROR",
      {
        originalError: error,
      }
    );
  }
}

export { getPhotosByDate };
