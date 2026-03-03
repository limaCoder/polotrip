"use client";

import { createAuthClient } from "better-auth/react";

import { env } from "@/lib/env";

const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_WEB_URL}/api/v1/auth`,
  credentials: "include",
  advanced: {
    cookiePrefix: "polotrip",
    cookies: {
      session_token: {
        name: "polotrip.state",
      },
    },
  },
});

type AuthClient = ReturnType<typeof createAuthClient>;

export const getSession: AuthClient["getSession"] = authClient.getSession;
export const getCurrentUser = async () =>
  (await getSession())?.data?.user ?? null;
export const signIn: AuthClient["signIn"] = authClient.signIn;
export const signOut: AuthClient["signOut"] = authClient.signOut;
