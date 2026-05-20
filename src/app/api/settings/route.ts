import { NextRequest, NextResponse } from "next/server";
import { query, pool } from "../../../lib/db";
import { verifySession } from "../../../lib/auth";

// GET: Obtener todas las configuraciones en un formato de objeto plano
export async function GET() {
  try {
    const result = await query("SELECT key, value FROM settings");
    const settingsObj: Record<string, string> = {};
    
    result.rows.forEach((row) => {
      settingsObj[row.key] = row.value;
    });

    return NextResponse.json(settingsObj);
  } catch (error: any) {
    console.error("GET settings error:", error);
    return NextResponse.json(
      { error: "Error al obtener las configuraciones" },
      { status: 500 }
    );
  }
}

// POST: Guardar/actualizar configuraciones (Protegido)
export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const settingsData = await req.json(); // Se espera un objeto plano { [key]: value }

    if (!settingsData || typeof settingsData !== "object") {
      return NextResponse.json(
        { error: "Formato de datos incorrecto" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    for (const [key, value] of Object.entries(settingsData)) {
      await client.query(
        `INSERT INTO settings (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP) 
         ON CONFLICT (key) 
         DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, String(value)]
      );
    }

    await client.query("COMMIT");

    // Retornar configuraciones actualizadas
    const result = await query("SELECT key, value FROM settings");
    const settingsObj: Record<string, string> = {};
    result.rows.forEach((row) => {
      settingsObj[row.key] = row.value;
    });

    return NextResponse.json({ success: true, settings: settingsObj });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("POST settings error:", error);
    return NextResponse.json(
      { error: "Error al guardar las configuraciones" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
