import type { schema } from "@polotrip/db/schema";
import type { SQL } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type postgres from "postgres";
import type { z } from "zod";
import type { paginationQuerySchema } from "./schema";

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

type PaginatedResult<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

type PaginateFunction = {
  query: PaginationQuery;
  baseQuery: SQL;
  countQuery: SQL;
  db: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<Record<string, unknown>>;
  };
};

export type { PaginationQuery, PaginatedResult, PaginateFunction };
