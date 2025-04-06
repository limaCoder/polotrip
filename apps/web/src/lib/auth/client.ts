'use client';

import { createAuthClient } from 'better-auth/react';

import { env } from '@/lib/env';

const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_WEB_URL}/api/v1/auth`,
  credentials: 'include',
});

type AuthClient = ReturnType<typeof createAuthClient>;

export const getSession: AuthClient['getSession'] = authClient.getSession;
export const signIn: AuthClient['signIn'] = authClient.signIn;
export const signOut: AuthClient['signOut'] = authClient.signOut;
