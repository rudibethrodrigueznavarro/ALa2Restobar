import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { verifySession } from "../../../lib/auth";

export async function GET() {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 1. Ventas de hoy (excluyendo cancelados)
    const salesResult = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM orders 
      WHERE DATE(created_at AT TIME ZONE 'America/Bogota') = CURRENT_DATE 
        AND status != 'cancelado'
    `);
    const todaySales = Number(salesResult.rows[0].total);

    // 2. Pedidos activos (pendiente, preparando, listo)
    const activeResult = await query(`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status IN ('pendiente', 'preparando', 'listo')
    `);
    const activeOrders = Number(activeResult.rows[0].count);

    // 3. Productos agotados
    const stockResult = await query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE is_available = false
    `);
    const outOfStockProducts = Number(stockResult.rows[0].count);

    // 4. Últimos 5 pedidos con detalles
    const recentResult = await query(`
      SELECT o.*, 
             oi.id as item_id, oi.product_id, oi.quantity, oi.price as item_price,
             p.name as product_name
      FROM (
        SELECT * FROM orders 
        ORDER BY created_at DESC 
        LIMIT 5
      ) o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `);

    const recentOrdersMap = new Map();
    for (const row of recentResult.rows) {
      if (!recentOrdersMap.has(row.id)) {
        recentOrdersMap.set(row.id, {
          id: row.id,
          customer_name: row.customer_name,
          phone: row.phone,
          order_type: row.order_type,
          table_number: row.table_number,
          status: row.status,
          total_amount: Number(row.total_amount),
          created_at: row.created_at,
          items: [],
        });
      }
      if (row.item_id) {
        recentOrdersMap.get(row.id).items.push({
          id: row.item_id,
          product_name: row.product_name || "Producto eliminado",
          quantity: row.quantity,
          price: Number(row.item_price),
        });
      }
    }
    const recentOrders = Array.from(recentOrdersMap.values());

    // 5. Ventas de los últimos 7 días (para el gráfico SVG)
    // Agrupamos por fecha local
    const weeklyResult = await query(`
      SELECT DATE(created_at AT TIME ZONE 'America/Bogota') as date, 
             COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        AND status != 'cancelado'
      GROUP BY DATE(created_at AT TIME ZONE 'America/Bogota')
      ORDER BY date ASC
    `);

    // Llenar los días faltantes para que siempre muestre 7 días ordenados cronológicamente
    const weeklySales: { label: string; amount: number }[] = [];
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const label = daysOfWeek[d.getDay()];

      // Buscar si el día actual tiene ventas en la base de datos
      const dbRow = weeklyResult.rows.find((row: any) => {
        // En pg, el tipo DATE se retorna a veces como Date u objeto fecha, lo formateamos para comparar
        const rowDateStr = new Date(row.date).toISOString().split("T")[0];
        return rowDateStr === dateStr;
      });

      weeklySales.push({
        label: label,
        amount: dbRow ? Number(dbRow.total) : 0,
      });
    }

    return NextResponse.json({
      todaySales,
      activeOrders,
      outOfStockProducts,
      recentOrders,
      weeklySales,
    });
  } catch (error: any) {
    console.error("GET dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Error al obtener las métricas del panel" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
