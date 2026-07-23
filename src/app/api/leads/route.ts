import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/Lead";

type LeadRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company_name?: unknown;
  service_interest?: unknown;
  message?: unknown;
  source?: unknown;
  readiness_score?: unknown;
  issue_size_estimate?: unknown;
};

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadRequestBody | null;

  const name = stringOrNull(body?.name);
  const email = stringOrNull(body?.email);
  const source = stringOrNull(body?.source);

  if (!name || !email || !source) {
    return NextResponse.json({ error: "name, email, and source are required." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await Lead.create({
      name,
      email,
      phone: stringOrNull(body?.phone),
      company_name: stringOrNull(body?.company_name),
      service_interest: stringOrNull(body?.service_interest),
      message: stringOrNull(body?.message),
      source,
      readiness_score: typeof body?.readiness_score === "number" ? body.readiness_score : null,
      issue_size_estimate: stringOrNull(body?.issue_size_estimate),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
