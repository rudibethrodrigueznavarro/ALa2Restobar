import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <button className="text-primary dark:text-primary hover:text-primary transition-colors opacity-100 hover:opacity-80 duration-200 focus:outline-none">
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="font-h3 text-h3 tracking-tight font-h2 uppercase text-primary dark:text-primary">A LA 2 RESTO-BAR</h1>
        <Link href="/resumen" className="text-primary dark:text-primary hover:text-primary transition-colors opacity-100 hover:opacity-80 duration-200 focus:outline-none relative">
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-container rounded-full shadow-[0_0_8px_rgba(255,83,91,0.8)]"></span>
        </Link>
      </header>

      {/* Navigation Drawer (Hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 z-[60] flex flex-col bg-surface-container-high dark:bg-surface-container-high h-full w-72 rounded-r-xl border-r border-white/5 shadow-xxl transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0">
        <div className="p-lg border-b border-white/5 flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-white/10 overflow-hidden flex-shrink-0 relative">
            <img alt="Admin Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuPehbh94C3yqL4TKcG4SICHRDYaoSNLUh0Km1Kzx3pXM2f2r3HYzjzzC3LqB7k-lajm5ffaNz18M4T67GUz_rYWzqdEuuWhIdrjaIJ_uLAqyuCfe9ETSzuhyXG4fiwPJi1v3bn1pGPDQCw5eRzEGoyQ4_5SCsXGmzoPTHy5PTpZc8qQrySqzne7ItpaoWQnX81JjNd5pNoBLkovSb1UYS8FyLH1X6-bjsHI6i3QotfxDzUDliLbSE-Sf3pYXBQcM4I2YXXXdMOw" />
          </div>
          <div className="flex flex-col">
            <span className="font-h3 text-[18px] text-primary">Admin Panel</span>
            <span className="font-body-md text-[14px] text-on-surface-variant">A La 2 Resto-Bar</span>
          </div>
        </div>
        <nav className="flex-1 py-md flex flex-col gap-sm">
          <Link href="/admin" className="flex items-center gap-md bg-primary/10 text-primary border-l-4 border-primary px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/inventario" className="flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Inventory</span>
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md">
            <span className="material-symbols-outlined">edit_note</span>
            <span>Menu Editor</span>
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Order History</span>
          </Link>
          <Link href="#" className="flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-white/5 transition-colors font-body-md text-body-md">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className="pt-[88px] px-md md:pl-[304px] pb-xl flex flex-col gap-lg max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="font-h2 text-[28px] text-on-background">Live Overview</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-white/5 shadow-[0_0_15px_rgba(255,83,91,0.15)]">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-primary-container">Live</span>
          </div>
        </div>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-2 gap-md">
          {/* Ventas Hoy */}
          <div className="col-span-2 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-50"></div>
            <div className="flex items-start justify-between relative z-10 mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Ventas Hoy</span>
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            </div>
            <div className="relative z-10 flex items-baseline gap-2">
              <span className="font-h1 text-[40px] text-on-surface tracking-tighter">$4,280</span>
              <span className="font-body-md text-[14px] text-secondary">.50</span>
            </div>
          </div>

          {/* Pedidos Activos */}
          <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-xl p-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10 mb-6">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Pedidos Activos</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">room_service</span>
            </div>
            <div className="relative z-10">
              <span className="font-h2 text-[32px] text-on-surface">14</span>
            </div>
          </div>

          {/* Productos Agotados */}
          <div className="bg-surface/60 backdrop-blur-xl border border-white/10 border-b-primary-container/30 rounded-xl p-md flex flex-col justify-between relative overflow-hidden shadow-[0_10px_30px_-15px_rgba(255,83,91,0.3)]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex items-start justify-between relative z-10 mb-6">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Productos Agotados</span>
              <span className="material-symbols-outlined text-primary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="relative z-10">
              <span className="font-h2 text-[32px] text-primary-container drop-shadow-[0_0_8px_rgba(255,83,91,0.5)]">3</span>
            </div>
          </div>
        </div>

        {/* Weekly Sales Chart */}
        <section className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-xl p-md flex flex-col gap-md relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <h3 className="font-h3 text-[18px] text-on-surface">Rendimiento Semanal</h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Últimos 7 Días</span>
          </div>
          {/* Stylized Line Chart Placeholder */}
          <div className="h-32 w-full relative z-10 flex items-end pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-white/5 h-0"></div>
              <div className="w-full border-t border-white/5 h-0"></div>
              <div className="w-full border-t border-white/5 h-0"></div>
            </div>
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ff535b" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#ff535b" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,30 L15,25 L30,35 L45,15 L60,20 L75,5 L90,10 L100,2" fill="none" stroke="#ff535b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ filter: "drop-shadow(0px 4px 6px rgba(255, 83, 91, 0.4))" }}></path>
              <path d="M0,40 L0,30 L15,25 L30,35 L45,15 L60,20 L75,5 L90,10 L100,2 L100,40 Z" fill="url(#chartGradient)"></path>
              <circle cx="75" cy="5" fill="#131313" r="2" stroke="#ff535b" strokeWidth="1"></circle>
              <circle cx="100" cy="2" fill="#131313" r="2" stroke="#ff535b" strokeWidth="1"></circle>
            </svg>
          </div>
          <div className="flex justify-between w-full font-label-caps text-[10px] text-on-surface-variant mt-2 z-10">
            <span>LUN</span>
            <span>MIE</span>
            <span>VIE</span>
            <span>DOM</span>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="flex flex-col gap-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-h3 text-[18px] text-on-surface">Últimos Pedidos</h3>
            <Link href="/resumen" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors">VER TODOS</Link>
          </div>
          {/* Order Item 1 */}
          <div className="bg-surface-container/40 hover:bg-surface-container/80 transition-colors border border-white/5 rounded-lg p-sm pr-md flex items-center justify-between group">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center border border-white/10 text-on-surface group-hover:border-primary-container/50 transition-colors">
                <span className="font-h3 text-[16px]">#42</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-[14px] text-on-surface font-medium">Mesa 04</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Hace 2 min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-h3 text-[16px] text-on-surface">$124.00</span>
              <span className="font-label-caps text-[9px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary border border-primary/20">PREPARANDO</span>
            </div>
          </div>
          {/* Order Item 2 */}
          <div className="bg-surface-container/40 hover:bg-surface-container/80 transition-colors border border-white/5 rounded-lg p-sm pr-md flex items-center justify-between group">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center border border-white/10 text-on-surface group-hover:border-primary-container/50 transition-colors">
                <span className="font-h3 text-[16px]">#41</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-[14px] text-on-surface font-medium">Takeaway</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Hace 15 min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-h3 text-[16px] text-on-surface">$45.50</span>
              <span className="font-label-caps text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-on-surface-variant border border-white/10">LISTO</span>
            </div>
          </div>
          {/* Order Item 3 */}
          <div className="bg-surface-container/40 hover:bg-surface-container/80 transition-colors border border-white/5 rounded-lg p-sm pr-md flex items-center justify-between group">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center border border-white/10 text-on-surface group-hover:border-primary-container/50 transition-colors">
                <span className="font-h3 text-[16px]">#40</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-[14px] text-on-surface font-medium">Mesa 12</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Hace 32 min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-h3 text-[16px] text-on-surface">$210.00</span>
              <span className="font-label-caps text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-on-surface-variant border border-transparent">ENTREGADO</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
