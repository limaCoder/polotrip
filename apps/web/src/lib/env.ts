import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEB_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUB_KEY: z.string(),
  },

  server: {
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    SUPABASE_KEY: z.string(),
    SUPABASE_URL: z.string(),
  },

  runtimeEnv: {
    // local
    // NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUB_KEY: process.env.NEXT_PUBLIC_STRIPE_PUB_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    // production
    NEXT_PUBLIC_WEB_URL:
      process.env.NEXT_PUBLIC_WEB_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  },
});
