import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = withAuth(
  async function onSuccess(req) {
    const token = await getToken({ req });
    // If token exists but is expired, redirect to login
    if (token?.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow the request if token exists and has no refresh error
        return token != null && !token.error;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export default async function middleware(req: NextRequest) {
  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/install/*",
  ];
  const publicPathnameRegex = RegExp(
    `^(${publicPages.map((page) => page.replace("*", ".*")).join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    if (isAuthenticated && !req.nextUrl.pathname.startsWith("/install/")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
