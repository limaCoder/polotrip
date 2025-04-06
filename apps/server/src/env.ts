import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),

  WEB_URL: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  STRIPE_SECRET_KEY: z.string(),

  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string().url(),

  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),

  RESEND_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
