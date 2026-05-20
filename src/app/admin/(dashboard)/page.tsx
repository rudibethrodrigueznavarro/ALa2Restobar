"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  order_type: string;
  table_number: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

interface WeeklySale {
  label: string;
  amount: number;
}

interface DashboardData {
  todaySales: number;
  activeOrders: number;
  outOfStockProducts: number;
  recentOrders: Order[];
  weeklySales: WeeklySale[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-actualizar cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        await fetchDashboardData();
      } else {
        alert("Error al actualizar el estado del pedido");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "preparando":
        return "bg-primary-container/20 text-primary border-primary/20";
      case "listo":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "entregado":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelado":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-white/10 text-on-surface-variant border-white/10";
    }
  };

  // Generar puntos SVG dinámicos para el gráfico semanal
  const renderWeeklySvg = () => {
    if (!data || !data.weeklySales || data.weeklySales.length === 0) return null;
    const sales = data.weeklySales;
    const maxVal = Math.max(...sales.map((s) => s.amount), 50000); // Mínimo 50k COP para escala razonable
    
    // Generar coordenadas
    const coords = sales.map((s, idx) => {
      const x = (idx / 6) * 100;
      const y = 40 - (s.amount / maxVal) * 35; // Dejar 5 de margen superior (alto total 40)
      return { x, y };
    });

    const linePath = coords.map((c, idx) => `${idx === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
    const areaPath = `${linePath} L100,40 L0,40 Z`;

    return (
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff535b" stopOpacity="0.3"></stop>
            <stop offset="100%" stopColor="#ff535b" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
        {/* Relleno degradado */}
        <path d={areaPath} fill="url(#chartGradient)"></path>
        {/* Línea principal */}
        <path
          d={linePath}
          fill="none"
          stroke="#ff535b"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0px 3px 4px rgba(255, 83, 91, 0.4))" }}
        ></path>
        {/* Puntos sobre la línea */}
        {coords.map((c, idx) => (
          <circle
            key={idx}
            cx={c.x}
            cy={c.y}
            fill="#131313"
            r="1.2"
            stroke="#ff535b"
            strokeWidth="0.8"
          ></circle>
        ))}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span className="font-body-md text-on-surface-variant">Cargando métricas...</span>
      </div>
    );
  }

  const dashboard = data || {
    todaySales: 0,
    activeOrders: 0,
    outOfStockProducts: 0,
    recentOrders: [],
    weeklySales: [],
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-h2 text-[28px] text-on-background">Resumen en Vivo</h2>
          <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Monitorea el estado de tu restaurante hoy.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-white/5 shadow-[0_0_15px_rgba(255,83,91,0.15)]">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-caps text-label-caps text-primary-container">En Vivo</span>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Ventas Hoy */}
        <div className="col-span-2 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-50"></div>
          <div className="flex items-start justify-between relative z-10 mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Ventas Hoy</span>
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              trending_up
            </span>
          </div>
          <div className="relative z-10 flex items-baseline gap-1">
            <span className="font-h1 text-[36px] text-on-surface tracking-tighter">
              {formatCurrency(dashboard.todaySales)}
            </span>
          </div>
        </div>

        {/* Pedidos Activos */}
        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-xl p-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10 mb-6">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Pedidos Activos</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">room_service</span>
          </div>
          <div className="relative z-10">
            <span className="font-h2 text-[32px] text-on-surface">{dashboard.activeOrders}</span>
          </div>
        </div>

        {/* Productos Agotados */}
        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 border-b-primary-container/30 rounded-xl p-md flex flex-col justify-between relative overflow-hidden shadow-[0_10px_30px_-15px_rgba(255,83,91,0.3)]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex items-start justify-between relative z-10 mb-6">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Productos Agotados</span>
            <span className="material-symbols-outlined text-primary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>
          <div className="relative z-10">
            <span className="font-h2 text-[32px] text-primary-container drop-shadow-[0_0_8px_rgba(255,83,91,0.5)]">
              {dashboard.outOfStockProducts}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <section className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-xl p-md flex flex-col gap-md relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <h3 className="font-h3 text-[18px] text-on-surface">Rendimiento Semanal</h3>
          <span className="font-label-caps text-label-caps text-on-surface-variant">Últimos 7 Días (Ventas)</span>
        </div>
        {/* Dynamic Line Chart */}
        <div className="h-32 w-full relative z-10 flex items-end pt-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="w-full border-t border-white/5 h-0"></div>
            <div className="w-full border-t border-white/5 h-0"></div>
            <div className="w-full border-t border-white/5 h-0"></div>
          </div>
          {renderWeeklySvg()}
        </div>
        <div className="flex justify-between w-full font-label-caps text-[10px] text-on-surface-variant mt-2 z-10 px-1">
          {dashboard.weeklySales.map((day, idx) => (
            <span key={idx} className="w-12 text-center">
              {day.label}
            </span>
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="flex flex-col gap-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-h3 text-[18px] text-on-surface">Últimos Pedidos</h3>
          <Link
            href="/admin/pedidos"
            className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors"
          >
            VER TODOS
          </Link>
        </div>

        {dashboard.recentOrders.length === 0 ? (
          <div className="bg-surface/40 border border-white/5 rounded-xl p-lg text-center font-body-md text-on-surface-variant">
            No se han registrado pedidos hoy.
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {dashboard.recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container/40 hover:bg-surface-container/60 transition-colors border border-white/5 rounded-xl p-md flex flex-col md:flex-row md:items-center justify-between gap-md"
              >
                {/* Order Meta */}
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-lg bg-surface-bright flex items-center justify-center border border-white/10 text-on-surface text-[18px] font-h3 font-medium">
                    #{order.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-[15px] text-on-surface font-semibold">
                      {order.customer_name} ({order.order_type === "mesa" ? `Mesa ${order.table_number}` : order.order_type === "domicilio" ? "Domicilio" : "Retiro"})
                    </span>
                    <span className="font-body-md text-[13px] text-on-surface-variant">
                      {order.items.map((it) => `${it.quantity}x ${it.product_name}`).join(", ")}
                    </span>
                    <span className="font-label-caps text-[9px] text-on-surface-variant mt-0.5">
                      {new Date(order.created_at).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status Toggle & Total */}
                <div className="flex items-center justify-between md:justify-end gap-lg border-t border-white/5 pt-sm md:border-t-0 md:pt-0">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="font-h3 text-[16px] text-on-surface">{formatCurrency(order.total_amount)}</span>
                    <span className={`font-label-caps text-[8px] px-2 py-0.5 mt-1 border rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Quick Action Selector */}
                  <div className="relative">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-surface border border-white/10 text-on-surface rounded-lg p-xs pr-sm text-[12px] font-label-caps focus:border-primary outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="preparando">Preparando</option>
                      <option value="listo">Listo</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
