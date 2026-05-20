import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ala2_session";

export function sha256(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function generateSessionToken(username: string): string {
  const salt = process.env.DATABASE_URL || "default_salt_123";
  const signature = sha256(username + salt);
  return `${username}:${signature}`;
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return false;

  const [username, signature] = session.split(":");
  if (!username || !signature) return false;

  const salt = process.env.DATABASE_URL || "default_salt_123";
  const expectedSignature = sha256(username + salt);
  return signature === expectedSignature;
}

export async function setSessionCookie(username: string) {
  const token = generateSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
