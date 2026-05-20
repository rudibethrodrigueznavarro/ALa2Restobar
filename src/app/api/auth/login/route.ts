import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { sha256, setSessionCookie } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar el usuario en la base de datos
    const result = await query("SELECT * FROM users WHERE username = $1", [username]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const passwordHash = sha256(password);

    if (user.password_hash !== passwordHash) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Crear la sesión en la cookie
    await setSessionCookie(username);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
