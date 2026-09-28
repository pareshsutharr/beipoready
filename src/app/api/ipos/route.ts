import { NextRequest, NextResponse } from "next/server";
import { getIpos, type IpoSource, type IpoStatus } from "@/lib/ipos";

export const runtime = "nodejs";

const sources = new Set<IpoSource>(["nse", "bse"]);
const statuses = new Set<IpoStatus>(["upcoming", "live", "closed"]);

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  const status = request.nextUrl.searchParams.get("status");

  if (source && !sources.has(source as IpoSource)) {
    return NextResponse.json({ error: "source must be nse or bse" }, { status: 400 });
  }
  if (status && !statuses.has(status as IpoStatus)) {
    return NextResponse.json({ error: "status must be upcoming, live, or closed" }, { status: 400 });
  }

  const payload = await getIpos();
  const records = payload.records.filter(
    (record) => (!source || record.source === source) && (!status || record.status === status)
  );

  return NextResponse.json({ ...payload, records });
}
