import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import { verifySession } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { categories } = await req.json();
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: "Se requiere un arreglo de categorías con id y display_order" },
        { status: 400 }
      );
    }

    // Usar el pool directamente para hacer una transacción
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const cat of categories) {
        if (typeof cat.id !== 'number' || typeof cat.display_order !== 'number') {
          throw new Error("Formato inválido de categoría");
        }
        await client.query(
          "UPDATE categories SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
          [cat.display_order, cat.id]
        );
      }
      await client.query("COMMIT");
    } catch (txError: any) {
      await client.query("ROLLBACK");
      throw txError;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true, message: "Orden de categorías actualizado con éxito" });
  } catch (error: any) {
    console.error("POST reorder categories error:", error);
    return NextResponse.json(
      { error: error.message || "Error al reordenar las categorías" },
      { status: 500 }
    );
  }
}
