"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "../data/products";

interface Product {
  id: number;
  name: string;
  price: string;
  rawPrice: number;
  description: string;
  img: string;
  imgAlt: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

export default function Resumen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"domicilio" | "recoger" | "mesa">("domicilio");
  const [observations, setObservations] = useState("");
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Datos del Cliente
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Configuraciones cargadas desde la BD
  const [adminPhone, setAdminPhone] = useState("573001234567");
  const [dbDeliveryFee, setDbDeliveryFee] = useState(3500);

  // Leer carrito y configuraciones
  useEffect(() => {
    const initPage = async () => {
      // 1. Cargar configuración de la tienda
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings.whatsapp_phone) {
            setAdminPhone(settings.whatsapp_phone);
          }
          if (settings.delivery_fee) {
            setDbDeliveryFee(Number(settings.delivery_fee));
          }
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }

      // 2. Cargar carrito de localStorage
      try {
        const stored = localStorage.getItem("ala2_cart");
        if (stored) {
          const rawItems = JSON.parse(stored) as any[];
          // Cargar productos desde la API para tener los precios y datos más actualizados
          const resProd = await fetch("/api/products");
          if (resProd.ok) {
            const dbProds = await resProd.json();
            const parsedCart = rawItems
              .map((item) => {
                const id = item.productId || item.product?.id;
                const found = dbProds.find((p: any) => p.id === id);
                if (!found) return null;
                return {
                  product: {
                    id: found.id,
                    name: found.name,
                    price: formatPrice(Number(found.price)),
                    rawPrice: Number(found.price),
                    description: found.description,
                    img: found.image_url || "/placeholder-food.png",
                    imgAlt: found.name,
                  },
                  quantity: item.quantity || 1,
                  notes: item.notes || "",
                };
              })
              .filter((item): item is CartItem => item !== null);
            setCart(parsedCart);
          }
        }
      } catch (e) {
        console.error("Error reading cart", e);
      }

      setMounted(true);
    };

    initPage();
  }, []);

  /* Persistir carrito en localStorage */
  useEffect(() => {
    if (!mounted) return;
    const storageItems = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      notes: item.notes,
    }));
    localStorage.setItem("ala2_cart", JSON.stringify(storageItems));
  }, [cart, mounted]);

  function changeQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  }

  /* Totales */
  const envioFee = orderType === "domicilio" ? dbDeliveryFee : 0;
  const subtotal = cart.reduce((sum, item) => sum + item.product.rawPrice * item.quantity, 0);
  const total = subtotal + envioFee;

  /* Finalizar Pedido */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Por favor ingresa tu nombre y teléfono de contacto");
      return;
    }

    if (orderType === "mesa" && !tableNumber.trim()) {
      alert("Por favor ingresa el número de tu mesa");
      return;
    }

    if (orderType === "domicilio" && !deliveryAddress.trim()) {
      alert("Por favor ingresa la dirección de entrega");
      return;
    }

    setSubmitting(true);

    const mergedObservations = [
      orderType === "domicilio" ? `Dirección: ${deliveryAddress}` : null,
      observations ? `Observaciones: ${observations}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    // 1. Preparar payload de pedido
    const orderPayload = {
      customer_name: customerName,
      phone: customerPhone,
      order_type: orderType,
      table_number: orderType === "mesa" ? tableNumber : null,
      observations: mergedObservations,
      delivery_fee: envioFee,
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.rawPrice,
        notes: item.notes,
      })),
    };

    try {
      // 2. Guardar en PostgreSQL
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("No se pudo registrar el pedido en el sistema");
      }

      const resData = await res.json();
      const orderId = resData.orderId;

      // 3. Formatear y Enviar Mensaje a WhatsApp
      const lines = cart.map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} — ${formatPrice(item.product.rawPrice * item.quantity)}${
            item.notes ? ` _(${item.notes})_` : ""
          }`
      );

      let tipoText = "🏪 Recoger en tienda";
      if (orderType === "domicilio") {
        tipoText = `🛵 Domicilio a: ${deliveryAddress}`;
      } else if (orderType === "mesa") {
        tipoText = `📍 Consumo en Mesa #${tableNumber}`;
      }

      const msg = [
        `🍔 *Pedido #${orderId} - A La 2 Resto-Bar*`,
        `Cliente: ${customerName}`,
        `Teléfono: ${customerPhone}`,
        "",
        ...lines,
        "",
        `Subtotal: ${formatPrice(subtotal)}`,
        orderType === "domicilio" ? `Envío: ${formatPrice(envioFee)}` : null,
        `*Total: ${formatPrice(total)}*`,
        "",
        `Tipo: ${tipoText}`,
        observations ? `Observaciones: ${observations}` : null,
      ]
        .filter((l) => l !== null)
        .join("\n");

      // Limpiar el carrito de la UI y del localStorage
      setCart([]);
      localStorage.removeItem("ala2_cart");

      // Redirigir a WhatsApp
      window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al procesar el pedido. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Empty state */
  if (mounted && cart.length === 0) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
          <Link href="/menu">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">
              arrow_back
            </span>
          </Link>
          <h1 className="font-h3 text-h3 tracking-tight text-primary font-bold">Tu Pedido</h1>
          <span className="material-symbols-outlined opacity-0">shopping_cart</span>
        </header>
        <main className="pt-32 px-gutter max-w-2xl mx-auto flex flex-col items-center gap-lg w-full text-center">
          <span
            className="material-symbols-outlined text-[64px] text-on-surface-variant"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            shopping_bag
          </span>
          <p className="font-h3 text-[20px] text-on-surface font-semibold">Tu carrito está vacío</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Agrega deliciosos platos desde el menú para comenzar tu pedido.
          </p>
          <Link
            href="/menu"
            className="mt-md bg-primary text-white font-label-caps text-label-caps py-md px-xl rounded-xl flex items-center gap-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(230,57,70,0.4)]"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant_menu
            </span>
            VER MENÚ
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <Link href="/menu">
          <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">
            arrow_back
          </span>
        </Link>
        <h1 className="font-h3 text-h3 tracking-tight text-primary font-bold">Tu Pedido</h1>
        <span className="material-symbols-outlined opacity-0">shopping_cart</span>
      </header>

      <main className="pt-24 px-gutter max-w-2xl mx-auto flex flex-col gap-lg w-full pb-36">
        {/* Order Items */}
        <section className="flex flex-col gap-md">
          <h2 className="font-h3 text-h3 text-on-surface font-semibold">Productos Seleccionados</h2>

          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between bg-surface-container/80 backdrop-blur-md p-md rounded-xl border border-white/5 gap-md"
            >
              {/* Image + info */}
              <div className="flex items-center gap-md min-w-0">
                <div className="w-16 h-16 rounded-md bg-surface-container-high overflow-hidden shrink-0 border border-white/5">
                  <img
                    alt={item.product.imgAlt}
                    className="w-full h-full object-cover"
                    src={item.product.img}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md font-semibold text-on-surface truncate">{item.product.name}</span>
                  <span className="font-body-md text-primary font-bold">
                    {formatPrice(item.product.rawPrice * item.quantity)}
                  </span>
                  {item.notes && (
                    <span className="font-body-md text-[12px] text-yellow-500 italic truncate mt-0.5">
                      Nota: "{item.notes}"
                    </span>
                  )}
                </div>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-sm bg-surface-container-highest rounded-full p-xs border border-white/10 shrink-0">
                <button
                  onClick={() => changeQty(item.product.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors cursor-pointer"
                  aria-label="Disminuir"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {item.quantity === 1 ? "delete" : "remove"}
                  </span>
                </button>
                <span className="font-body-md font-semibold w-5 text-center select-none">{item.quantity}</span>
                <button
                  onClick={() => changeQty(item.product.id, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors cursor-pointer"
                  aria-label="Aumentar"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
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
          <div className="flex p-unit bg-surface-container-high rounded-xl border border-white/5 relative">
            <div
              className={`absolute inset-y-unit bg-primary/20 rounded-lg border border-primary/30 transition-all duration-300 ${
                orderType === "domicilio"
                  ? "left-unit w-[32%]"
                  : orderType === "recoger"
                  ? "left-[34%] w-[32%]"
                  : "left-[66%] w-[32%]"
              }`}
            />
            <button
              onClick={() => setOrderType("domicilio")}
              className={`flex-1 py-sm font-body-md font-semibold text-center relative z-10 flex items-center justify-center gap-sm transition-colors text-[13px] cursor-pointer ${
                orderType === "domicilio" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
              Domicilio
            </button>
            <button
              onClick={() => setOrderType("recoger")}
              className={`flex-1 py-sm font-body-md font-semibold text-center relative z-10 flex items-center justify-center gap-sm transition-colors text-[13px] cursor-pointer ${
                orderType === "recoger" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Retiro
            </button>
            <button
              onClick={() => setOrderType("mesa")}
              className={`flex-1 py-sm font-body-md font-semibold text-center relative z-10 flex items-center justify-center gap-sm transition-colors text-[13px] cursor-pointer ${
                orderType === "mesa" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_restaurant</span>
              En Mesa
            </button>
          </div>
        </section>

        {/* Formulario Cliente */}
        <section className="bg-surface-container/50 border border-white/5 rounded-xl p-md flex flex-col gap-md">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Datos del Cliente</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Nombre */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-[9px] text-on-surface-variant px-1">Nombre Completo *</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors text-[14px]"
                placeholder="Ingresa tu nombre"
                type="text"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-[9px] text-on-surface-variant px-1">Número de Teléfono *</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors text-[14px]"
                placeholder="Ej. 3001234567"
                type="tel"
                required
              />
            </div>
          </div>

          {/* Domicilio dirección condicional */}
          {orderType === "domicilio" && (
            <div className="flex flex-col gap-xs input-glow rounded-lg animate-fade-in">
              <label className="font-label-caps text-[9px] text-on-surface-variant px-1">Dirección de Entrega *</label>
              <input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors text-[14px]"
                placeholder="Dirección, Barrio, Apto o detalles..."
                type="text"
                required
              />
            </div>
          )}

          {/* Mesa número condicional */}
          {orderType === "mesa" && (
            <div className="flex flex-col gap-xs input-glow rounded-lg animate-fade-in w-1/2">
              <label className="font-label-caps text-[9px] text-on-surface-variant px-1">Número de Mesa *</label>
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors text-[14px]"
                placeholder="Mesa #"
                type="number"
                required
              />
            </div>
          )}
        </section>

        {/* Observations */}
        <section className="flex flex-col gap-sm">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="observaciones">
            Notas Especiales para la Cocina
          </label>
          <textarea
            id="observaciones"
            rows={3}
            placeholder="Ej: sin picante, doble aderezo..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors shadow-inner resize-none placeholder-on-surface-variant/50 text-[14px]"
          />
        </section>

        {/* Summary Card */}
        <section className="bg-surface-container/80 backdrop-blur-md rounded-xl p-lg border border-white/5 flex flex-col gap-sm mt-md">
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Subtotal</span>
            <span className="font-body-md text-on-surface">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">
              {orderType === "domicilio" ? "Costo de Envío" : orderType === "mesa" ? "Consumo en Local" : "Retirar en Local"}
            </span>
            <span className="font-body-md text-on-surface">
              {orderType === "domicilio" ? formatPrice(envioFee) : "Gratis"}
            </span>
          </div>
          <div className="h-px w-full bg-white/10 my-sm" />
          <div className="flex justify-between items-center">
            <span className="font-h3 text-h3 text-primary font-bold">Total</span>
            <span className="font-h3 text-h3 text-primary font-bold">{formatPrice(total)}</span>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] py-md px-gutter rounded-t-xl">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || submitting}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-md px-lg font-body-md font-bold flex items-center justify-center gap-md transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] cursor-pointer"
          >
            {submitting ? (
              <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.832 0 10.564 4.742 10.564 10.564 0 5.827-4.732 10.564-10.564 10.564z" />
                </svg>
                <span>Enviar y Confirmar por WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
