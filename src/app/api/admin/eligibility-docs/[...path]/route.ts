import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readEligibilityFile } from "@/lib/upload";

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { path: segments } = await context.params;
  const relativePath = segments.map(decodeURIComponent).join("/");
  const file = await readEligibilityFile(relativePath);

  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.fileName}"`,
    },
  });
}
