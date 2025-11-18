import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session");
  const isAuthenticated = !!sessionCookie?.value;

  const isNoAuthPage = true;

  // If user is not authenticated and tries to access protected routes
  if (!isAuthenticated && !isNoAuthPage && !request.nextUrl.pathname.startsWith("/_next")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.well-known).*)",
  ],
};
