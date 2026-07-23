import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const PRIVATE_UPLOADS_ROOT = path.join(process.cwd(), "private-uploads", "eligibility");

export const MAX_ELIGIBILITY_FILE_BYTES = 10 * 1024 * 1024;

const ELIGIBILITY_MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".zip": "application/zip",
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Saves an image to /public/uploads/{folder}/... and returns its public URL path. */
export async function saveUploadedImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const fileName = `${Date.now()}-${baseName}.${extension}`;

  const dir = path.join(PUBLIC_UPLOADS_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), buffer);

  return `/uploads/${folder}/${fileName}`;
}

/** Deletes a previously-saved public upload given its `/uploads/...` path. */
export async function deletePublicUpload(publicPath: string | null) {
  if (!publicPath?.startsWith("/uploads/")) return;
  const relative = publicPath.replace(/^\/uploads\//, "");
  const absolute = path.join(PUBLIC_UPLOADS_ROOT, relative);
  if (!absolute.startsWith(PUBLIC_UPLOADS_ROOT)) return;
  await unlink(absolute).catch(() => {});
}

/**
 * Saves an eligibility financial statement OUTSIDE /public so it is never
 * directly web-accessible. Returns a bucket-relative path (e.g.
 * "<uuid>/<filename>") to store on the EligibilitySubmission document.
 */
export async function saveEligibilityFile(file: File): Promise<string> {
  if (file.size > MAX_ELIGIBILITY_FILE_BYTES) {
    throw new Error("File is too large, please keep it under 10 MB.");
  }

  const safeName = file.name.replace(/[^\w.-]+/g, "_");
  const relativePath = `${crypto.randomUUID()}/${safeName}`;
  const absolutePath = path.join(PRIVATE_UPLOADS_ROOT, relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return relativePath;
}

export type EligibilityFile = { buffer: Buffer; contentType: string; fileName: string };

/** Reads a previously-saved eligibility file back for admin-only download. */
export async function readEligibilityFile(relativePath: string): Promise<EligibilityFile | null> {
  const absolutePath = path.join(PRIVATE_UPLOADS_ROOT, relativePath);
  if (!absolutePath.startsWith(PRIVATE_UPLOADS_ROOT)) return null; // path traversal guard

  try {
    const { readFile } = await import("node:fs/promises");
    const buffer = await readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();
    const fileName = path.basename(absolutePath);
    return {
      buffer,
      contentType: ELIGIBILITY_MIME_TYPES[extension] ?? "application/octet-stream",
      fileName,
    };
  } catch {
    return null;
  }
}
