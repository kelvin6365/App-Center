import { locales } from '@/i18n';
import { Locale } from '@/types/Lang';
import { withAuth } from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  localePrefix: 'never',
  // Used when no locale matches
  defaultLocale: Locale.EN,
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export default async function middleware(req: NextRequest) {
  const publicPages = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/install/*',
  ];
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .map((page) => page.replace('*', '.*'))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    if (isAuthenticated && !req.nextUrl.pathname.startsWith('/install/')) {
      return NextResponse.redirect(new URL('/console', req.url));
    }
    return intlMiddleware(req);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
