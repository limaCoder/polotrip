import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATHS = ['/sign-in'];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];

  const isPrivatePath = pathname.includes('/(private)') || pathname.includes('/dashboard');
  const isPublicPath = PUBLIC_PATHS.some(path => {
    if (path.includes(':')) {
      const pathPattern = new RegExp(
        `^/${locale}${path.replace(':id', '[^/]+').replace('/', '\\/')}$`,
      );
      return pathPattern.test(pathname);
    }
    return pathname === `/${locale}${path}`;
  });

  const sessionCookie = request.cookies.get('polotrip.session')?.value;

  if (isPrivatePath) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
    }
  }

  if (isPublicPath && sessionCookie) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: ['/', '/(pt|en)/:path*'],
};
