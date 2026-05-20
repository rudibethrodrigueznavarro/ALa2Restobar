"use client";

import { useEffect, useState } from "react";

export default function ConfiguracionAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Campos de Configuración
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [tablesCount, setTablesCount] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [bannerNotice, setBannerNotice] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const settings = await res.json();
        setWhatsappPhone(settings.whatsapp_phone || "");
        setDeliveryFee(settings.delivery_fee || "0");
        setTablesCount(settings.tables_count || "10");
        setRestaurantName(settings.restaurant_name || "A La 2 Restobar");
        setOpeningHours(settings.opening_hours || "12:00 PM - 11:00 PM");
        setBannerNotice(settings.banner_notice || "");
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      whatsapp_phone: whatsappPhone,
      delivery_fee: deliveryFee,
      tables_count: tablesCount,
      restaurant_name: restaurantName,
      opening_hours: openingHours,
      banner_notice: bannerNotice,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Configuraciones guardadas correctamente");
      } else {
        alert("Error al guardar las configuraciones");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span className="font-body-md text-on-surface-variant">Cargando configuraciones...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg max-w-3xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="font-h3 text-h3 text-on-surface font-semibold">Ajustes de Tienda</h2>
        <p className="font-body-md text-[13px] text-on-surface-variant">
          Modifica los parámetros generales del negocio y la facturación
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        {/* Panel: WhatsApp */}
        <section className="glass-panel rounded-xl p-md border border-white/5 flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">chat</span>
            <h3 className="font-h3 text-[16px] text-on-surface font-semibold">
              Integración de WhatsApp
            </h3>
          </div>
          <p className="font-body-md text-[12px] text-on-surface-variant">
            Número de teléfono para el envío automático del resumen del pedido por WhatsApp.
          </p>

          <div className="flex flex-col gap-xs input-glow rounded-lg">
            <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
              Teléfono WhatsApp (Formato internacional, ej: 573001234567)
            </label>
            <input
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors"
              placeholder="573000000000"
              type="text"
            />
          </div>
        </section>

        {/* Panel: Costos y Mesas */}
        <section className="glass-panel rounded-xl p-md border border-white/5 flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <h3 className="font-h3 text-[16px] text-on-surface font-semibold">
              Parámetros de Servicio
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Costo envío */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Costo de Envío Domicilio (COP)
              </label>
              <div className="relative">
                <span className="absolute left-sm top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                <input
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm pl-7 text-on-surface font-semibold outline-none focus:border-primary transition-colors"
                  placeholder="0"
                  type="number"
                />
              </div>
            </div>

            {/* Cantidad Mesas */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Cantidad de Mesas Físicas
              </label>
              <input
                value={tablesCount}
                onChange={(e) => setTablesCount(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md outline-none focus:border-primary transition-colors"
                placeholder="10"
                type="number"
              />
            </div>
          </div>
        </section>

        {/* Panel: Información General */}
        <section className="glass-panel rounded-xl p-md border border-white/5 flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">storefront</span>
            <h3 className="font-h3 text-[16px] text-on-surface font-semibold">
              Información de Marca
            </h3>
          </div>

          <div className="flex flex-col gap-md">
            {/* Nombre del restobar */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Nombre de la Tienda
              </label>
              <input
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md outline-none focus:border-primary transition-colors"
                placeholder="A La 2 Restobar"
                type="text"
              />
            </div>

            {/* Horarios */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Horario de Atención
              </label>
              <input
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md outline-none focus:border-primary transition-colors"
                placeholder="12:00 PM - 11:00 PM"
                type="text"
              />
            </div>

            {/* Banner promocional */}
            <div className="flex flex-col gap-xs input-glow rounded-lg">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
                Anuncio Promocional (Banner)
              </label>
              <input
                value={bannerNotice}
                onChange={(e) => setBannerNotice(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors"
                placeholder="Ej. ¡20% de descuento en hamburguesas los jueves!"
                type="text"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary-container text-white font-h3 text-body-md py-md rounded-lg shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              <span>Guardar Ajustes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
export const runtime = "nodejs";
