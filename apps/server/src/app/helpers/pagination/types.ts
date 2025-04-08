import { z } from 'zod';
import { paginationQuerySchema } from './schema';
import { SQL } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { schema } from '@polotrip/db/schema';
import postgres from 'postgres';

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface PaginateFunction {
  query: PaginationQuery;
  baseQuery: SQL;
  countQuery: SQL;
  db: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
  };
}

export type { PaginationQuery, PaginatedResult, PaginateFunction };
