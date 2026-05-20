import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ala2_session";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

async function verifySessionToken(sessionValue: string | undefined): Promise<boolean> {
  if (!sessionValue) return false;
  const [username, signature] = sessionValue.split(":");
  if (!username || !signature) return false;

  const salt = process.env.DATABASE_URL || "default_salt_123";
  const expectedSignature = await sha256(username + salt);
  return signature === expectedSignature;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const isValid = await verifySessionToken(session);

  // Si intenta acceder a rutas de administración y no está autenticado
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si intenta acceder a la página de login estando ya autenticado
  if (pathname === "/admin/login") {
    if (isValid) {
      const adminUrl = new URL("/admin", req.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

// Configurar qué rutas activan este middleware
export const config = {
  matcher: ["/admin/:path*"],
};
