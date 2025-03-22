import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEB_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },

  runtimeEnv: {
    // local
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // production
    // NEXT_PUBLIC_WEB_URL: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  },
});
