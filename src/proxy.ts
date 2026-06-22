import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  ADMIN_SESSION_COOKIE,
  hasHardcodedAdminSession,
} from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  // Refresh session tokens on every request.
  const response = await updateSession(request);

  // Guard all /admin/* routes except /admin/login.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (hasHardcodedAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
      return response;
    }

    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf)).*)",
  ],
};
