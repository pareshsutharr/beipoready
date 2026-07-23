import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

const ALLOWED_FOLDERS = ["blogs", "case-studies", "clients"];

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");
    const folder = typeof folderValue === "string" && ALLOWED_FOLDERS.includes(folderValue) ? folderValue : "blogs";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const publicPath = await saveUploadedImage(file, folder);
    return NextResponse.json({ path: publicPath });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
