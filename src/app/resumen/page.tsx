"use client";

import Link from "next/link";

export default function Resumen() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <div className="flex items-center gap-sm">
          <Link href="/menu">
            <span className="material-symbols-outlined text-primary dark:text-primary cursor-pointer hover:opacity-80 transition-opacity">arrow_back</span>
          </Link>
        </div>
        <h1 className="font-h3 text-h3 tracking-tight text-primary dark:text-primary">Tu Pedido</h1>
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary dark:text-primary opacity-0">shopping_cart</span> {/* Spacer for centering */}
        </div>
      </header>

      <main className="pt-24 px-gutter max-w-2xl mx-auto flex flex-col gap-lg w-full pb-32">
        {/* Order Items */}
        <section className="flex flex-col gap-md">
          <h2 className="font-h3 text-h3">Productos</h2>
          
          {/* Item 1 */}
          <div className="flex items-center justify-between bg-surface-container/80 backdrop-blur-md p-md rounded-lg border border-white/5">
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-md bg-surface-container-high overflow-hidden shrink-0">
                <img alt="Burger" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQziq5wfwS21jJK2TKIMWCshRiVDRdtDF0st1GeQDMxR1N7h0fE5_YRHPixd-qX5fWmSUhhQqe-SM810AxGsfkZQu6NnJO-NbeznPJLqfR2AU0Q3mWHdlmrVX3SPkvVjZQfd17OM0TeX08lSh2x7fNnR5JyjqTWDcHLIT2vasYILfv_bkb60aLRn756BPIZ_lmdw5ngmprTVAxifTYJPkoPZOC_Pdkcc4-7b1hnVMidAPqVeWe3_arA420xp5cCpcfT_V5NX-9tw"/>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md font-semibold text-on-surface">Neon Classic Burger</span>
                <span className="font-body-md text-on-surface-variant">$14.50</span>
              </div>
            </div>
            <div className="flex items-center gap-sm bg-surface-container-highest rounded-full p-xs border border-white/10">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="font-body-md font-semibold w-4 text-center">2</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="flex items-center justify-between bg-surface-container/80 backdrop-blur-md p-md rounded-lg border border-white/5">
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-md bg-surface-container-high overflow-hidden shrink-0">
                <img alt="Cocktail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgRfnQDaadIw1RKucLHsBOhQVvj-IgViwiMZQ8DR8wN_4MIb-3Yt28VcEg0fifVNKmTMIA0kUHmulkVoNOxIRgaK17UVaI_AXXoHdhL5WK9RZOl0C-0sHjcAHTZx3OVwZTvrj1qSq07e1im0W30BlggwBms_p8JZdqnroVfhfMvbhx4cwRXv1XR6pWTRfNWM8m5SOpwLlC1Ao9UwuPiyqQXeII3Bw6KmmIs-_9L6HY3Rdzp9tZu_K0FyMgZvcPzy0i18IongO6yQ"/>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md font-semibold text-on-surface">Crimson Velvet</span>
                <span className="font-body-md text-on-surface-variant">$12.00</span>
              </div>
            </div>
            <div className="flex items-center gap-sm bg-surface-container-highest rounded-full p-xs border border-white/10">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="font-body-md font-semibold w-4 text-center">1</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright text-on-surface transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
          
          <button className="flex items-center gap-sm text-primary font-body-md font-semibold mt-sm hover:opacity-80 transition-opacity w-fit">
            <span className="material-symbols-outlined">add_circle</span>
            Añadir más productos
          </button>
        </section>

        {/* Order Type Toggle */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tipo de Pedido</h3>
          <div className="flex p-unit bg-surface-container-high rounded-lg border border-white/5 relative">
            <div className="absolute inset-y-unit left-unit right-1/2 bg-primary/20 rounded-md shadow-[0_0_15px_rgba(230,57,70,0.3)] transition-transform border border-primary/30"></div>
            <button className="flex-1 py-sm font-body-md font-semibold text-primary text-center relative z-10 flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-sm">two_wheeler</span>
              Domicilio
            </button>
            <button className="flex-1 py-sm font-body-md font-semibold text-on-surface-variant text-center relative z-10 flex items-center justify-center gap-sm hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-sm">storefront</span>
              Recoger
            </button>
          </div>
        </section>

        {/* Observations */}
        <section className="flex flex-col gap-sm">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="observaciones">Observaciones</label>
          <textarea className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors shadow-inner resize-none placeholder-on-surface-variant/50" id="observaciones" placeholder="Ej: Sin cebolla, extra salsa..." rows={3}></textarea>
        </section>

        {/* Summary */}
        <section className="bg-surface-container/80 backdrop-blur-md rounded-xl p-lg border border-white/5 flex flex-col gap-sm mt-md">
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Subtotal</span>
            <span className="font-body-md text-on-surface">$41.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-on-surface-variant">Envío</span>
            <span className="font-body-md text-on-surface">$3.50</span>
          </div>
          <div className="h-px w-full bg-white/10 my-sm"></div>
          <div className="flex justify-between items-center">
            <span className="font-h3 text-h3 text-primary">Total</span>
            <span className="font-h3 text-h3 text-primary">$44.50</span>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar (Checkout) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-surface-container/90 dark:bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] py-md px-gutter rounded-t-xl">
        <div className="max-w-2xl mx-auto">
          <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg py-md px-lg font-body-md font-bold flex items-center justify-center gap-md transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.832 0 10.564 4.742 10.564 10.564 0 5.827-4.732 10.564-10.564 10.564z"></path>
            </svg>
            Finalizar Pedido por WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
