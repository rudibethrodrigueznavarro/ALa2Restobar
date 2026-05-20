import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { verifySession } from "../../../lib/auth";

// GET: Listar todos los productos
export async function GET() {
  try {
    const result = await query(
      "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id ASC"
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

// POST: Crear un producto (Protegido)
export async function POST(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, description, price, image_url, category_id, is_available } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "El nombre y el precio son requeridos" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO products (name, description, price, image_url, category_id, is_available) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        name,
        description || "",
        price,
        image_url || "",
        category_id || null,
        is_available !== undefined ? is_available : true,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("POST product error:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un producto (Protegido)
export async function PUT(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, name, description, price, image_url, category_id, is_available } = await req.json();

    if (!id || !name || price === undefined) {
      return NextResponse.json(
        { error: "El ID, nombre y precio son requeridos" },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5, is_available = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 RETURNING *`,
      [
        name,
        description || "",
        price,
        image_url || "",
        category_id || null,
        is_available !== undefined ? is_available : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("PUT product error:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un producto (Protegido)
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

    const result = await query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (error: any) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
