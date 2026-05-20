"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deserializeCart,
  serializeCart,
  parsePrice,
  formatPrice,
  type Product,
  type CartItem
} from "../data/products";

/* ─── Component ──────────────────────────────────────────────── */
export default function Resumen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"domicilio" | "recoger">("domicilio");
  const [observations, setObservations] = useState("");
  const [mounted, setMounted] = useState(false);

  /* Leer carrito desde localStorage al montar */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ala2_cart");
      if (stored) setCart(deserializeCart(stored));
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  /* Persistir carrito en localStorage en cada cambio */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("ala2_cart", serializeCart(cart));
  }, [cart, mounted]);

  /* ── Handlers ── */
  function changeQty(id: number, delta: number) {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCart(prev => prev.filter(item => item.product.id !== id));
  }

  /* ── Totals ── */
  const ENVIO = orderType === "domicilio" ? 3500 : 0;
  const subtotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
    0
  );
  const total = subtotal + ENVIO;

  /* ── WhatsApp ── */
  function handleWhatsApp() {
    if (cart.length === 0) return;

    // Guardar en el historial de pedidos de este dispositivo
    try {
      const stored = localStorage.getItem("ala2_order_history");
      const history = stored ? JSON.parse(stored) : [];
      const newOrder = {
        id: `order-${Date.now()}`,
        timestamp: Date.now(),
        type: orderType,
        observations: observations,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          notes: item.notes
        }))
      };
      history.unshift(newOrder);
      localStorage.setItem("ala2_order_history", JSON.stringify(history));
    } catch (e) {
      console.error("Error saving order history", e);
    }

    const lines = cart.map(
      item =>
        `• ${item.quantity}x ${item.product.name} — ${formatPrice(
          parsePrice(item.product.price) * item.quantity
        )}${item.notes ? ` _(${item.notes})_` : ""}`
    );
    const tipo = orderType === "domicilio" ? "🛵 Domicilio" : "🏪 Recoger en tienda";
    const msg = [
      "🍔 *Pedido A La 2 Resto-Bar*",
      "",
      ...lines,
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      orderType === "domicilio" ? `Envío: ${formatPrice(ENVIO)}` : null,
      `*Total: ${formatPrice(total)}*`,
      "",
      `Tipo: ${tipo}`,
      observations ? `Observaciones: ${observations}` : null,
    ]
      .filter(l => l !== null)
      .join("\n");

    const phone = "573001234567"; // ← cambia por el número real
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  /* ── Empty state ── */
  if (mounted && cart.length === 0) {
    return (
      <>
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
          <Link href="/menu">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">arrow_back</span>
          </Link>
          <h1 className="font-h3 text-h3 tracking-tight text-primary">Tu Pedido</h1>
          <span className="material-symbols-outlined opacity-0">shopping_cart</span>
        </header>
        <main className="pt-32 px-gutter max-w-2xl mx-auto flex flex-col items-center gap-lg w-full text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
          <p className="font-h3 text-h3 text-on-surface">Tu carrito está vacío</p>
          <p className="font-body-md text-body-md text-on-surface-variant">Agrega productos desde el menú para comenzar tu pedido.</p>
          <Link
            href="/menu"
            className="mt-md bg-primary text-white font-label-caps text-label-caps py-md px-xl rounded-xl flex items-center gap-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(230,57,70,0.4)]"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
            VER MENÚ
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <Link href="/menu">
          <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">arrow_back</span>
        </Link>
        <h1 className="font-h3 text-h3 tracking-tight text-primary">Tu Pedido</h1>
        <span className="material-symbols-outlined opacity-0">shopping_cart</span>
      </header>

      <main className="pt-24 px-gutter max-w-2xl mx-auto flex flex-col gap-lg w-full pb-32">

        {/* Order Items */}
        <section className="flex flex-col gap-md">
          <h2 className="font-h3 text-h3">Productos</h2>

          {cart.map(item => (
            <div
              key={item.product.id}
              className="flex items-center justify-between bg-surface-container/80 backdrop-blur-md p-md rounded-lg border border-white/5 gap-md"
            >
              {/* Image + info */}
              <div className="flex items-center gap-md min-w-0">
                <div className="w-16 h-16 rounded-md bg-surface-container-high overflow-hidden shrink-0">
                  <img alt={item.product.imgAlt} className="w-full h-full object-cover" src={item.product.img} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md font-semibold text-on-surface truncate">{item.product.name}</span>
                  <span className="font-body-md text-on-surface-variant">
                    {formatPrice(parsePrice(item.product.price) * item.quantity)}
                  </span>
                  {item.notes && (
                    <span className="font-body-md text-[12px] text-on-surface-variant/60 italic truncate">{item.notes}</span>
                  )}
                </div>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-sm bg-surface-container-highest rounded-full p-xs border border-white/10 shrink-0">
                <button
                  onClick={() => changeQty(item.product.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors"
                  aria-label="Disminuir"
                >
                  <span className="material-symbols-outlined text-sm">
                    {item.quantity === 1 ? "delete" : "remove"}
                  </span>
                </button>
                <span className="font-body-md font-semibold w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => changeQty(item.product.id, +1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors"
                  aria-label="Aumentar"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add more */}
          <Link
            href="/menu"
            className="flex items-center gap-sm text-primary font-body-md font-semibold mt-sm hover:opacity-80 transition-opacity w-fit"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Añadir más productos
          </Link>
        </section>

        {/* Order Type Toggle */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tipo de Pedido</h3>
          <div className="flex p-unit bg-surface-container-high rounded-lg border border-white/5 relative">
            <div
              className={`absolute inset-y-unit bg-primary/20 rounded-md shadow-[0_0_15px_rgba(230,57,70,0.3)] border border-primary/30 transition-all duration-300 ${
                orderType === "domicilio" ? "left-unit right-1/2" : "left-1/2 right-unit"
              }`}
            />
            <button
              onClick={() => setOrderType("domicilio")}
              className={`flex-1 py-sm font-body-md font-semibold text-center relative z-10 flex items-center justify-center gap-sm transition-colors ${
                orderType === "domicilio" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">two_wheeler</span>
              Domicilio
            </button>
            <button
              onClick={() => setOrderType("recoger")}
              className={`flex-1 py-sm font-body-md font-semibold text-center relative z-10 flex items-center justify-center gap-sm transition-colors ${
                orderType === "recoger" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              Recoger
            </button>
          </div>
        </section>

        {/* Observations */}
        <section className="flex flex-col gap-sm">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="observaciones">
            Observaciones generales
          </label>
          <textarea
            id="observaciones"
            rows={3}
            placeholder="Ej: Sin cebolla, extra salsa..."
            value={observations}
            onChange={e => setObservations(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors shadow-inner resize-none placeholder-on-surface-variant/50"
          />
        </section>

        {/* Summary */}
        <section className="bg-surface-container/80 backdrop-blur-md rounded-xl p-lg border border-white/5 flex flex-col gap-sm mt-md">
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Subtotal</span>
            <span className="font-body-md text-on-surface">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">
              {orderType === "domicilio" ? "Envío" : "Recoger en tienda"}
            </span>
            <span className="font-body-md text-on-surface">
              {orderType === "domicilio" ? formatPrice(ENVIO) : "Gratis"}
            </span>
          </div>
          <div className="h-px w-full bg-white/10 my-sm" />
          <div className="flex justify-between items-center">
            <span className="font-h3 text-h3 text-primary">Total</span>
            <span className="font-h3 text-h3 text-primary">{formatPrice(total)}</span>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] py-md px-gutter rounded-t-xl">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleWhatsApp}
            disabled={cart.length === 0}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-md px-lg font-body-md font-bold flex items-center justify-center gap-md transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]"
          >
            <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.832 0 10.564 4.742 10.564 10.564 0 5.827-4.732 10.564-10.564 10.564z" />
            </svg>
            Finalizar Pedido por WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
