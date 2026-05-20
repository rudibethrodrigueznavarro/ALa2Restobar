import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image with blur */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/fondo-menu-lite.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px) brightness(0.4)",
          transform: "scale(1.08)",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75" />

      {/* Content — block layout, no flex wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Brand */}
        <div className="text-center pt-20 pb-10">
          <h1 className="font-h1 text-h1 text-on-surface uppercase tracking-tighter">
            A LA <span className="text-primary text-glow">2</span>
          </h1>
          <h3 className="font-h3 text-h3 text-on-surface-variant uppercase tracking-widest mt-xs">RESTO-BAR</h3>
        </div>

        {/* Buttons — full width container, padding only sides */}
        <div style={{ paddingLeft: 24, paddingRight: 24, maxWidth: 380, margin: "30vh auto 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Ver Menú */}
            <Link
              href="/menu"
              className="transition-transform duration-150 active:scale-[0.96] hover:brightness-110"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                backgroundColor: "#e63946",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(230,57,70,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                textDecoration: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  restaurant_menu
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18 }}>
                  Ver Menú
                </span>
              </div>
              <span className="material-symbols-outlined" style={{ opacity: 0.6 }}>chevron_right</span>
            </Link>

            {/* Promociones */}
            <Link
              href="/menu?seccion=promociones"
              className="transition-transform duration-150 active:scale-[0.96] hover:brightness-110"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                textDecoration: "none",
                width: "100%",
                boxSizing: "border-box",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_offer
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18 }}>
                  Promociones
                </span>
              </div>
              <span className="material-symbols-outlined" style={{ opacity: 0.6 }}>chevron_right</span>
            </Link>

            {/* Mis Pedidos */}
            <Link
              href="/pedidos"
              className="transition-transform duration-150 active:scale-[0.96]"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 24px",
                backgroundColor: "transparent",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0" }}>
                receipt_long
              </span>
              Mis Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
