import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  ADMIN_SESSION_COOKIE,
  HARDCODED_ADMIN_EMAIL,
  hasHardcodedAdminSession,
} from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasAdminCookie = hasHardcodedAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  );

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !hasAdminCookie) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar email={user?.email ?? HARDCODED_ADMIN_EMAIL} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
