import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),

  WEB_URL: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string().url(),

  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),

  RESEND_API_KEY: z.string(),

  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PRICE_ID: z.string(),

  R2_ACCOUNT_ID: z.string(),
  R2_TOKEN: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_JURISDICTION_DEFAULT_ENDPOINT: z.string().url(),
  R2_JURISDICTION_EU_ENDPOINT: z.string().url(),
});

export const env = envSchema.parse(process.env);
