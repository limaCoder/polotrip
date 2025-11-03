import { z } from "zod";

const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Number.parseInt(val, 10)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => Number.parseInt(val, 10)),
});

const paginationResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export { paginationQuerySchema, paginationResponseSchema };
