import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { unsubscribeByToken } from "@/lib/newsletter";

function tokenFromRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("token")?.trim() || "";
}

export async function GET(request: Request) {
  const token = tokenFromRequest(request);
  const redirectUrl = new URL("/newsletter-unsubscribed", request.url);

  if (!token) {
    redirectUrl.searchParams.set("status", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  await connectToDatabase();
  const result = await unsubscribeByToken(token);
  redirectUrl.searchParams.set(
    "status",
    result.status === "invalid_token" ? "invalid" : "success"
  );

  return NextResponse.redirect(redirectUrl);
}

/** RFC 8058 one-click unsubscribe: mail clients (Gmail/Outlook) POST here directly with no page visit. */
export async function POST(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Missing unsubscribe token." }, { status: 400 });
  }

  await connectToDatabase();
  const result = await unsubscribeByToken(token);

  if (result.status === "invalid_token") {
    return NextResponse.json({ error: "Invalid unsubscribe token." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
