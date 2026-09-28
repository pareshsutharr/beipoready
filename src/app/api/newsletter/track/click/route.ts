import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SITE_URL } from "@/lib/seo";
import { EmailTrackingEvent } from "@/models/EmailTrackingEvent";

function safeRedirectTarget(rawUrl: string | null) {
  if (!rawUrl) return SITE_URL;

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return SITE_URL;
    return parsed.toString();
  } catch {
    return SITE_URL;
  }
}

// The redirect target only comes from the client-supplied `u` param, so it must never be
// honored unless `t` matches a real EmailTrackingEvent — otherwise this endpoint is an open
// redirect anyone can use to bounce through beipoready.com to an arbitrary URL.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("t")?.trim();
  const target = safeRedirectTarget(searchParams.get("u"));

  if (!token) {
    return NextResponse.redirect(SITE_URL);
  }

  try {
    await connectToDatabase();
    const result = await EmailTrackingEvent.updateOne(
      { token },
      { $inc: { click_count: 1 }, $push: { clicks: { url: target, clicked_at: new Date() } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.redirect(SITE_URL);
    }
  } catch (error) {
    console.error("Newsletter click tracking failed:", error);
    return NextResponse.redirect(SITE_URL);
  }

  return NextResponse.redirect(target);
}
