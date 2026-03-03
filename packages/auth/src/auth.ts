import { db } from "@polotrip/db";
import { schema } from "@polotrip/db/schema";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import env from "./env";

const DAYS_EXPIRATION_SESSION = 7;

export const config: BetterAuthOptions = {
  baseURL: env.AUTH_WEB_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
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
            mapProfileToUser: (profile) => {
              return {
                ...profile,
                image: profile.picture?.replace("=s96-c", "=s256-c"),
              };
            },
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * DAYS_EXPIRATION_SESSION,
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    cookiePrefix: "polotrip",
    cookies: {
      session_token: {
        name: "polotrip.state",
      },
    },
  },
  basePath: "/api/v1/auth",
};

const auth = betterAuth(config);

export type AuthType = typeof auth;
export { auth };
