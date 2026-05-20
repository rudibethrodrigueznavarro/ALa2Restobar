import { NextRequest, NextResponse } from "next/server";
import { query, pool } from "../../../lib/db";
import { verifySession } from "../../../lib/auth";

// GET: Obtener todos los pedidos (Protegido)
export async function GET(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const statusFilter = searchParams.get("status");

    let sql = `
      SELECT o.*, 
             oi.id as item_id, oi.product_id, oi.quantity, oi.price as item_price, oi.notes as item_notes,
             p.name as product_name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
    `;
    
    const params: any[] = [];
    if (statusFilter) {
      sql += ` WHERE o.status = $1`;
      params.push(statusFilter);
    }
    
    sql += ` ORDER BY o.created_at DESC`;

    const result = await query(sql, params);

    // Agrupar los ítems por pedido
    const ordersMap = new Map();
    for (const row of result.rows) {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          customer_name: row.customer_name,
          phone: row.phone,
          order_type: row.order_type,
          table_number: row.table_number,
          status: row.status,
          delivery_fee: Number(row.delivery_fee),
          total_amount: Number(row.total_amount),
          observations: row.observations,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: [],
        });
      }
      if (row.item_id) {
        ordersMap.get(row.id).items.push({
          id: row.item_id,
          product_id: row.product_id,
          product_name: row.product_name || "Producto eliminado",
          quantity: row.quantity,
          price: Number(row.item_price),
          notes: row.item_notes,
        });
      }
    }

    return NextResponse.json(Array.from(ordersMap.values()));
  } catch (error: any) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { error: "Error al obtener los pedidos" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo pedido (Público - Checkout del Cliente)
export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const {
      customer_name,
      phone,
      order_type,
      table_number,
      observations,
      delivery_fee,
      items,
    } = await req.json();

    if (!customer_name || !phone || !order_type || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para registrar el pedido" },
        { status: 400 }
      );
    }

    // Calcular el total
    let totalItems = 0;
    for (const item of items) {
      totalItems += Number(item.price) * Number(item.quantity);
    }
    const fee = order_type === "domicilio" ? Number(delivery_fee || 0) : 0;
    const totalAmount = totalItems + fee;

    // Iniciar transacción
    await client.query("BEGIN");

    // 1. Insertar el pedido principal
    const orderInsertResult = await client.query(
      `INSERT INTO orders (customer_name, phone, order_type, table_number, delivery_fee, total_amount, observations) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        customer_name,
        phone,
        order_type,
        order_type === "mesa" ? table_number : null,
        fee,
        totalAmount,
        observations || "",
      ]
    );

    const orderId = orderInsertResult.rows[0].id;

    // 2. Insertar los ítems
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, notes) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price, item.notes || ""]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: orderId,
      total: totalAmount,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("POST order error:", error);
    return NextResponse.json(
      { error: "Error al registrar el pedido" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PUT: Actualizar el estado de un pedido (Protegido - Dashboard Admin)
export async function PUT(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "El ID y el nuevo estado son requeridos" },
        { status: 400 }
      );
    }

    const validStatuses = ["pendiente", "preparando", "listo", "entregado", "cancelado"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Estado no válido" },
        { status: 400 }
      );
    }

    const result = await query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: result.rows[0] });
  } catch (error: any) {
    console.error("PUT order error:", error);
    return NextResponse.json(
      { error: "Error al actualizar el pedido" },
      { status: 500 }
    );
  }
}
