import { sql } from 'drizzle-orm';
import { PaginatedResult, PaginateFunction } from './types';
import { snakeToCamelDbFields } from '@/app/utils/dbSnakeToCamel';

export async function paginate<T>({
  query,
  baseQuery,
  countQuery,
  db,
}: PaginateFunction): Promise<PaginatedResult<T>> {
  const { page, limit } = query;

  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));

  const offset = (validPage - 1) * validLimit;

  const paginatedQuery = sql`${baseQuery} LIMIT ${validLimit} OFFSET ${offset}`;

  const rawData = await db.execute(paginatedQuery);
  const data = Array.isArray(rawData) ? rawData.map(item => snakeToCamelDbFields(item) as T) : [];

  const [{ count }] = await db.execute<{ count: number }>(countQuery);
  const total = Number(count);

  const totalPages = Math.ceil(total / validLimit);

  return {
    data,
    pagination: {
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
    },
  };
}
