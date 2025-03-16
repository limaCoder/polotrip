import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
