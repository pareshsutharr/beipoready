import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guard all /admin/* routes except /admin/login. This is an optimistic
  // check only (signature + expiry); the protected layout re-verifies.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const admin = await verifyAdminToken(token);

    if (!admin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next/static|_next/image|fav.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf)).*)",
  ],
};
