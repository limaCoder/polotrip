import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  PORT: z.coerce.number().default(3334),
  DATABASE_URL: z.string().url(),
  MCP_SECRET: z.string().min(32),
})

export const env = envSchema.parse(process.env)
