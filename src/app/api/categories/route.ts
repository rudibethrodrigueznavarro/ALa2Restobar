import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { verifySession } from "../../../lib/auth";

// GET: Listar todas las categorías
export async function GET() {
  try {
    const result = await query("SELECT * FROM categories ORDER BY name ASC");
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("GET categories error:", error);
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
}

// POST: Crear una categoría (Protegido)
export async function POST(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    const result = await query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description || ""]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("POST category error:", error);
    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una categoría (Protegido)
export async function PUT(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, name, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "El ID y el nombre son requeridos" },
        { status: 400 }
      );
    }

    const result = await query(
      "UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [name, description || "", id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("PUT category error:", error);
    return NextResponse.json(
      { error: "Error al actualizar la categoría" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una categoría (Protegido)
export async function DELETE(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "El ID es requerido" },
        { status: 400 }
      );
    }

    const result = await query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (error: any) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { error: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}
