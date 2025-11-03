"use client";

import { createAuthClient } from "better-auth/react";

import { env } from "@/lib/env";

const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_WEB_URL}/api/v1/auth`,
  credentials: "include",
  cookieOptions: {
    // in local environment, comment the lines between path and domain properties
    /* path: '/',
    sameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.NODE_ENV === 'production' ? '.polotrip.com' : undefined, */
    httpOnly: true,
  },
  advanced: {
    cookiePrefix: "polotrip",
    cookieName: "session",
  },
});

type AuthClient = ReturnType<typeof createAuthClient>;

export const getSession: AuthClient["getSession"] = authClient.getSession;
export const signIn: AuthClient["signIn"] = authClient.signIn;
export const signOut: AuthClient["signOut"] = authClient.signOut;
