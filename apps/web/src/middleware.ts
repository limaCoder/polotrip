import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPrivatePath = pathname.includes('/(private)') || pathname.includes('/dashboard');

  if (isPrivatePath) {
    const sessionCookie = getSessionCookie(request, {
      cookiePrefix: 'polotrip',
    });

    if (!sessionCookie) {
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(pt|en)/:path*'],
};
