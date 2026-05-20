"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      setLogoutLoading(true);
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setLogoutLoading(false);
      }
    }
  };

  const navLinks = [
    { href: "/admin", label: "Panel de Control", icon: "analytics" },
    { href: "/admin/inventario", label: "Inventario", icon: "inventory_2" },
    { href: "/admin/menu", label: "Categorías", icon: "edit_note" },
    { href: "/admin/pedidos", label: "Pedidos", icon: "receipt_long" },
    { href: "/admin/configuracion", label: "Ajustes de Tienda", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <div className="flex items-center gap-sm">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-primary hover:text-primary transition-colors opacity-100 hover:opacity-80 duration-200 focus:outline-none flex items-center"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isSidebarOpen ? "close" : "menu"}
            </span>
          </button>
          <h1 className="font-h3 text-h3 tracking-tight font-h2 uppercase text-primary text-glow">
            A LA 2 RESTO-BAR
          </h1>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs font-label-caps text-label-caps focus:outline-none"
        >
          {logoutLoading ? (
            <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
          ) : (
            <>
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="material-symbols-outlined text-[22px]">logout</span>
            </>
          )}
        </button>
      </header>

      {/* Navigation Drawer (Desktop - Always visible starting on md) */}
      <aside className="fixed inset-y-0 left-0 z-40 flex flex-col bg-surface-container-high h-full w-72 rounded-r-xl border-r border-white/5 shadow-xxl transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0 pt-16">
        <div className="p-lg border-b border-white/5 flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-white/10 overflow-hidden flex-shrink-0 relative">
            <span className="material-symbols-outlined text-primary text-[32px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              account_circle
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-h3 text-[16px] text-primary">Administrador</span>
            <span className="font-body-md text-[12px] text-on-surface-variant">A La 2 Resto-Bar</span>
          </div>
        </div>
        
        <nav className="flex-1 py-md flex flex-col gap-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-md px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer (Overlay backdrop + drawer drawer) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 bottom-0 w-72 bg-surface-container-high shadow-xxl border-r border-white/5 flex flex-col pt-16 animate-slide-in"
          >
            <div className="p-lg border-b border-white/5 flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-white/10 overflow-hidden flex-shrink-0 relative">
                <span className="material-symbols-outlined text-primary text-[24px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  account_circle
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-h3 text-[14px] text-primary">Administrador</span>
                <span className="font-body-md text-[11px] text-on-surface-variant">Resto-Bar</span>
              </div>
            </div>

            <nav className="flex-1 py-md flex flex-col gap-xs">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-md px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-on-surface-variant"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Quick Access Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 h-16 bg-surface/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-sm">
        {navLinks.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive ? "text-primary text-glow" : "text-on-surface-variant/70"
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {link.icon}
              </span>
              <span className="font-label-caps text-[8px] tracking-tight text-center truncate w-full">
                {link.label.split(" ")[0]} {/* Muestra solo la primera palabra para ahorrar espacio */}
              </span>
            </Link>
          );
        })}
        {/* En móvil, mostramos Ajustes como el 5to ítem de la barra inferior */}
        <Link
          href="/admin/configuracion"
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
            pathname === "/admin/configuracion" ? "text-primary text-glow" : "text-on-surface-variant/70"
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={pathname === "/admin/configuracion" ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            settings
          </span>
          <span className="font-label-caps text-[8px] tracking-tight text-center">
            Ajustes
          </span>
        </Link>
      </nav>

      {/* Main Canvas */}
      <main className="pt-[88px] px-md md:pl-[304px] pb-24 md:pb-xl flex flex-col gap-lg max-w-7xl mx-auto w-full flex-1">
        {children}
      </main>
    </div>
  );
}
