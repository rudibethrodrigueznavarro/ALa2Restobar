"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  notes: string;
}

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  order_type: string;
  table_number: string | null;
  status: string;
  delivery_fee: number;
  total_amount: number;
  observations: string;
  created_at: string;
  items: OrderItem[];
}

export default function PedidosAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [typeFilter, setTypeFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Detalle de Pedido (Modal)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const orderData = await res.json();
        setOrders(orderData);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Polling cada 30 segundos
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
        // Actualizar localmente
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        // Si el modal está abierto con este pedido, actualizarlo
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert("Error al actualizar el estado");
      }
    } catch (err) {
      console.error(err);
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

  // Filtrar pedidos
  const filteredOrders = orders.filter((order) => {
    const matchesType = typeFilter === "todos" || order.order_type === typeFilter;
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchLower) ||
      String(order.id).includes(searchLower) ||
      order.phone.includes(searchLower) ||
      (order.table_number && order.table_number.includes(searchLower));

    return matchesType && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span className="font-body-md text-on-surface-variant">Cargando historial de pedidos...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Header */}
      <div>
        <h2 className="font-h3 text-h3 text-on-surface font-semibold">Historial de Pedidos</h2>
        <p className="font-body-md text-[13px] text-on-surface-variant">Visualiza, filtra y administra los pedidos recibidos</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface/50 border border-white/5 rounded-xl p-md flex flex-col md:flex-row md:items-center justify-between gap-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] select-none">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-lg p-xs pl-10 text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors text-[14px]"
            placeholder="Buscar por cliente, mesa o pedido ID..."
            type="text"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-sm">
          {/* Tipo */}
          <div className="flex items-center gap-xs">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">Tipo:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface border border-white/10 text-on-surface rounded-lg p-xs pr-sm text-[12px] font-label-caps focus:border-primary outline-none cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="domicilio">Domicilio</option>
              <option value="recoger">Retiro</option>
              <option value="mesa">Mesa</option>
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-xs">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-white/10 text-on-surface rounded-lg p-xs pr-sm text-[12px] font-label-caps focus:border-primary outline-none cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="preparando">Preparando</option>
              <option value="listo">Listo</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-surface/40 border border-white/5 rounded-xl p-lg text-center font-body-md text-on-surface-variant">
          No se encontraron pedidos con los filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-surface-container/30 hover:bg-surface-container/50 border border-white/5 hover:border-white/10 rounded-xl p-md flex flex-col justify-between gap-md cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div>
                <div className="flex justify-between items-start mb-xs">
                  <span className="font-h3 text-[16px] text-on-surface font-semibold">
                    Pedido #{order.id}
                  </span>
                  <span className={`font-label-caps text-[8px] px-2 py-0.5 border rounded-full ${getStatusBadge(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-[13px] text-on-surface-variant">
                  <div className="flex items-center gap-xs font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">
                      {order.order_type === "domicilio" ? "sports_motorsports" : order.order_type === "mesa" ? "table_restaurant" : "storefront"}
                    </span>
                    <span>
                      {order.order_type === "domicilio" ? "A domicilio" : order.order_type === "mesa" ? `Mesa ${order.table_number}` : "Retiro en Local"}
                    </span>
                  </div>
                  <div className="flex items-center gap-xs mt-1 text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString("es-CO")} -{" "}
                      {new Date(order.created_at).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-sm mt-xs">
                <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">
                  {order.items.length} {order.items.length === 1 ? "Ítem" : "Ítems"}
                </span>
                <span className="font-h3 text-[16px] text-primary font-bold">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-container-high border border-white/10 rounded-2xl p-lg shadow-xxl flex flex-col gap-md relative overflow-y-auto max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-sm right-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Header */}
            <div>
              <h3 className="font-h2 text-h3 text-on-surface font-bold">Detalle de Pedido #{selectedOrder.id}</h3>
              <p className="font-body-md text-[12px] text-on-surface-variant">
                Recibido el {new Date(selectedOrder.created_at).toLocaleString("es-CO")}
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-sm bg-surface/50 border border-white/5 rounded-xl p-sm text-[13px]">
              <div>
                <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Cliente</p>
                <p className="font-semibold text-on-surface mt-0.5">{selectedOrder.customer_name}</p>
              </div>
              <div>
                <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Tipo de Pedido</p>
                <p className="font-semibold text-on-surface mt-0.5">
                  {selectedOrder.order_type === "domicilio" ? "Domicilio" : selectedOrder.order_type === "mesa" ? `Mesa ${selectedOrder.table_number}` : "Retiro"}
                </p>
              </div>
              <div className="col-span-2 border-t border-white/5 pt-xs mt-xs flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Teléfono</p>
                  <p className="font-semibold text-on-surface mt-0.5">{selectedOrder.phone}</p>
                </div>
                {/* Contact Shortcuts */}
                <div className="flex gap-sm">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="flex items-center gap-xs bg-surface border border-white/10 px-2 py-1 rounded-lg text-on-surface hover:text-primary text-[11px] font-label-caps transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">call</span> Llamar
                  </a>
                  <a
                    href={`https://wa.me/${selectedOrder.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-xs bg-[#25D366]/10 border border-[#25D366]/20 px-2 py-1 rounded-lg text-[#25D366] hover:bg-[#25D366]/20 text-[11px] font-label-caps transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-xs">
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase px-1">Productos</p>
              <div className="flex flex-col gap-sm bg-surface/30 rounded-xl p-sm border border-white/5">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex flex-col border-b border-white/5 last:border-b-0 pb-xs last:pb-0">
                    <div className="flex justify-between items-start text-[14px]">
                      <span className="font-semibold text-on-surface">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-semibold text-on-surface">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-yellow-500 italic mt-0.5">
                        Nota: "{item.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-xs bg-surface/20 rounded-xl p-sm text-[13px] border border-white/5">
              {selectedOrder.order_type === "domicilio" && (
                <div className="flex justify-between text-on-surface-variant">
                  <span>Costo de Envío:</span>
                  <span>{formatCurrency(selectedOrder.delivery_fee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-on-surface text-[15px] border-t border-white/5 pt-xs mt-xs">
                <span>TOTAL:</span>
                <span className="text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Observations */}
            {selectedOrder.observations && (
              <div className="flex flex-col gap-xs bg-primary/5 rounded-xl p-sm border border-primary/10 text-[12px]">
                <p className="font-label-caps text-[9px] text-primary-container uppercase">Notas Generales</p>
                <p className="text-on-surface-variant italic mt-0.5">"{selectedOrder.observations}"</p>
              </div>
            )}

            {/* Order Status Controller */}
            <div className="border-t border-white/10 pt-md mt-sm flex flex-col gap-xs">
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase px-1">Cambiar Estado</p>
              <div className="grid grid-cols-5 gap-xs">
                {["pendiente", "preparando", "listo", "entregado", "cancelado"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedOrder.id, status)}
                    disabled={updatingId === selectedOrder.id}
                    className={`p-xs text-[9px] font-label-caps rounded-lg border text-center transition-all cursor-pointer ${
                      selectedOrder.status === status
                        ? "bg-primary border-primary text-white font-bold"
                        : "bg-surface border-white/10 text-on-surface-variant hover:border-primary/50"
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
