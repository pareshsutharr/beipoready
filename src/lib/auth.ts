import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const ADMIN_SESSION_COOKIE = "beipoready_admin";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8h, matches the old session cookie

export type AdminTokenPayload = {
  sub: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET environment variable.");
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string | undefined): Promise<AdminTokenPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/**
 * Idempotently ensures a single Admin document exists, seeded from
 * ADMIN_EMAIL / ADMIN_PASSWORD env vars on first run so deployments never
 * need a manual seed step.
 */
export async function ensureAdminSeeded() {
  await connectToDatabase();
  const existing = await Admin.countDocuments();
  if (existing > 0) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL / ADMIN_PASSWORD environment variables for initial admin seed.");
  }

  const password_hash = await bcrypt.hash(password, 12);
  await Admin.create({ email: email.trim().toLowerCase(), password_hash });
}

/** Reads and verifies the admin session cookie from the current request context. */
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function verifyAdminCredentials(email: string, password: string) {
  await ensureAdminSeeded();
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).lean();
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return null;

  return { id: String(admin._id), email: admin.email };
}
