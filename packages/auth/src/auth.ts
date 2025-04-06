import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { db } from '@polotrip/db';
import { schema } from '@polotrip/db/schema';

import env from './env';

export const config: BetterAuthOptions = {
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      user: schema.users,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            mapProfileToUser: profile => {
              return {
                ...profile,
                image: profile.picture?.replace('=s96-c', '=s256-c'),
              };
            },
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [env.AUTH_WEB_URL],
  advanced: {
    cookiePrefix: 'polotrip',
  },
  basePath: '/api/v1/auth',
  plugins: [nextCookies()],
};

const auth = betterAuth(config);

export type AuthType = typeof auth;
export { auth };
