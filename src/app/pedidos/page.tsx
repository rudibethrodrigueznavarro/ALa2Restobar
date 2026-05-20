"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PRODUCTS,
  parsePrice,
  formatPrice,
  serializeCart,
  type Product,
  type CartItem
} from "../data/products";

interface PastOrder {
  id: string;
  timestamp: number;
  type: "domicilio" | "recoger";
  observations: string;
  items: {
    productId: number;
    quantity: number;
    notes: string;
  }[];
}

export default function PedidosPage() {
  const router = useRouter();
  const [history, setHistory] = useState<PastOrder[]>([]);
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ala2_order_history");
      if (stored) {
        setHistory(JSON.parse(stored) as PastOrder[]);
      }
    } catch (e) {
      console.error("Error reading order history", e);
    }
    setMounted(true);
  }, []);

  // Update cart count for badges
  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem("ala2_cart");
      if (stored) {
        const raw = JSON.parse(stored) as any[];
        const count = raw.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(count);
      }
    } catch {
      /* ignore */
    }
  }, [mounted]);

  // Reorder helper: clears active cart, merges the items, and redirects to Summary page
  const handleReorder = (order: PastOrder) => {
    try {
      const allProducts = Object.values(PRODUCTS).flat();
      const reorderItems: CartItem[] = order.items
        .map(item => {
          const product = allProducts.find(p => p.id === item.productId);
          if (!product) return null;
          return {
            product,
            quantity: item.quantity,
            notes: item.notes || ""
          };
        })
        .filter((item): item is CartItem => item !== null);

      if (reorderItems.length > 0) {
        localStorage.setItem("ala2_cart", serializeCart(reorderItems));
        router.push("/resumen");
      }
    } catch (e) {
      console.error("Error doing reorder", e);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <Link href="/menu">
          <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">arrow_back</span>
        </Link>
        <h1 className="font-h3 text-h3 tracking-tight text-primary">Mis Pedidos</h1>
        <span className="material-symbols-outlined opacity-0">shopping_cart</span>
      </header>

      {history.length === 0 ? (
        /* Empty State */
        <main className="pt-32 px-gutter max-w-2xl mx-auto flex flex-col items-center gap-lg w-full text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
          <p className="font-h3 text-h3 text-on-surface">No tienes pedidos anteriores</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Los pedidos que realices por WhatsApp aparecerán aquí para que puedas repetirlos fácilmente.
          </p>
          <Link
            href="/menu"
            className="mt-md bg-primary text-white font-label-caps text-label-caps py-md px-xl rounded-xl flex items-center gap-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(230,57,70,0.4)]"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
            VER EL MENÚ
          </Link>
        </main>
      ) : (
        /* History list */
        <main className="pt-24 px-gutter max-w-2xl mx-auto flex flex-col gap-lg w-full pb-32">
          {history.map((order) => {
            const allProducts = Object.values(PRODUCTS).flat();
            let totalOrderValue = 0;

            return (
              <div
                key={order.id}
                className="bg-surface-container/85 backdrop-blur-md p-lg rounded-xl border border-white/5 flex flex-col gap-md shadow-md"
              >
                {/* Header card info */}
                <div className="flex justify-between items-center pb-sm border-b border-white/10">
                  <div className="flex flex-col">
                    <span className="font-body-md text-[13px] text-on-surface-variant">{formatDate(order.timestamp)}</span>
                    <span className="font-body-md font-semibold text-on-surface">Pedido #{order.id.replace("order-", "").substring(0, 8)}</span>
                  </div>
                  <span className={`px-sm py-xs text-[11px] font-bold rounded-full uppercase tracking-wider flex items-center gap-xs ${
                    order.type === "domicilio"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {order.type === "domicilio" ? "two_wheeler" : "storefront"}
                    </span>
                    {order.type === "domicilio" ? "Domicilio" : "Recoger"}
                  </span>
                </div>

                {/* Items lists */}
                <div className="flex flex-col gap-sm">
                  {order.items.map((item, idx) => {
                    const product = allProducts.find(p => p.id === item.productId);
                    if (!product) return null;
                    const parsed = parsePrice(product.price);
                    const itemTotal = parsed * item.quantity;
                    totalOrderValue += itemTotal;

                    return (
                      <div key={idx} className="flex items-center justify-between gap-md">
                        <div className="flex items-center gap-sm min-w-0">
                          <img
                            src={product.img}
                            alt={product.imgAlt}
                            className="w-10 h-10 rounded-md object-cover border border-white/10 shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-md font-semibold text-on-surface truncate">
                              {item.quantity}x {product.name}
                            </span>
                            {item.notes && (
                              <span className="font-body-md text-[12px] text-on-surface-variant/60 italic truncate">
                                {item.notes}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-body-md font-semibold text-on-surface shrink-0">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Observations */}
                {order.observations && (
                  <div className="text-[12px] text-on-surface-variant/70 italic bg-white/5 p-xs rounded-md border border-white/5">
                    <strong>Nota:</strong> {order.observations}
                  </div>
                )}

                {/* Total and Reorder Footer */}
                <div className="flex justify-between items-center pt-sm border-t border-white/10 mt-xs">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-label-caps text-on-surface-variant">Valor Total</span>
                    <span className="font-h3 text-h3 text-primary font-bold">
                      {formatPrice(totalOrderValue + (order.type === "domicilio" ? 3500 : 0))}
                    </span>
                  </div>
                  <button
                    onClick={() => handleReorder(order)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold py-sm px-md rounded-lg flex items-center gap-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">replay</span>
                    Repetir Pedido
                  </button>
                </div>
              </div>
            );
          })}
        </main>
      )}

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 grid grid-cols-3 items-center py-sm bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] rounded-t-xl">
        <Link href="/menu" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>restaurant_menu</span>
          <span className="font-label-caps text-label-caps mt-1">Menu</span>
        </Link>
        <Link href="/resumen" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
          <span className="font-label-caps text-label-caps mt-1">Pedido</span>
        </Link>
        <Link href="/pedidos" className="flex flex-col items-center justify-center text-primary font-bold after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary-container transition-all scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
          <span className="font-label-caps text-label-caps mt-1">Mis Pedidos</span>
        </Link>
      </nav>
    </>
  );
}
