import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Proxy (formerly Middleware in Next <= 15) — gates the checkout & admin routes.
// NOTE: auth() is not called here (edge runtime / adapter constraints).
// Session presence is checked via the session cookie; detailed role checks
// happen in the route handlers / server components themselves.
const AUTH_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function hasSessionCookie(req: NextRequest): boolean {
  return AUTH_COOKIES.some((name) => Boolean(req.cookies.get(name)));
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const needsAuth =
    pathname.startsWith("/checkout") || pathname.startsWith("/admin");

  if (needsAuth && !hasSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*"],
};
