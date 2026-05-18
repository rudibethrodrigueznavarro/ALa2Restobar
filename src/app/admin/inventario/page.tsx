import Link from "next/link";

export default function InventarioAdmin() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)] transition-opacity duration-200">
        <button className="flex items-center justify-center p-sm hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary dark:text-primary">menu</span>
        </button>
        <h1 className="font-h2 text-h2 uppercase tracking-tighter text-primary dark:text-primary truncate px-md">A LA 2 RESTO-BAR</h1>
        <button className="flex items-center justify-center p-sm hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary dark:text-primary">shopping_cart</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 mt-20 px-md flex flex-col gap-xl max-w-2xl mx-auto w-full pb-24">
        {/* Inventory List Section */}
        <section className="flex flex-col gap-md">
          <div className="flex justify-between items-end mb-sm">
            <h2 className="font-h3 text-h3 text-on-surface">Inventory</h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant">24 Items</span>
          </div>
          {/* Product Card 1 */}
          <div className="glass-panel rounded-xl p-sm flex items-center gap-md relative overflow-hidden group">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-variant relative">
              <img className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCkzFdl-Bgj5VNHtq9-BzqkPpvIRAODpW-WN3F573pvZMd5a2qmES7xiN-UFfq_oRdZlzNPM1IFaMtpMPsWyCLeE1LbH9jVqGGzwjRnfb-pQxg8lDIvMJ5kHq7i1b2-UhLdplHZD7AxEfy7oH3MzqM14c7H7V5xw9xjjUAxU_OxDb51waemqUqUZVaXyegWNHzGDjkhMy0Ps1seKFhjAUrb_MbhKX8kElVotVU9bf5WAJihvmdezXAfXOghpxf4cJBs1vBfDFu2g" alt="Burger" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-xs">
                <span className="font-label-caps text-label-caps bg-primary-container/20 text-primary-container px-2 py-1 rounded-full text-[10px]">Mains</span>
              </div>
              <h3 className="font-h3 text-lg text-on-surface truncate">Neon Blaze Burger</h3>
              <p className="font-h3 text-body-md text-primary">$18.500</p>
            </div>
            <div className="flex flex-col gap-sm shrink-0">
              <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5">
                <span className="material-symbols-outlined text-[18px]">visibility</span>
              </button>
            </div>
          </div>
          {/* Product Card 2 */}
          <div className="glass-panel rounded-xl p-sm flex items-center gap-md relative overflow-hidden group opacity-60">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-variant relative">
              <img className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNaNsF4ntdyGkHhq1bGLxCcgsK7Z288GH6nzOV-5XbfS11Z1PwzEnoGKVQaIL2uFiyV9uIRrb_cLQJBsdnRX-JyGCwW35fGatC0rm4K04duEh9yLSkp8SYmdQAvHBIOFBWEhBsOrnxaXWTDd84zlMMii0GND9lrL_Vip-RneBIwL-v43RoYN7KB5jvQBNUfZ1RBbkyL3bn6-1yxUfgDrtghpTOdQzvZR_7kY4WFy0-S-cThnIPsUjSLTMQW7I3iGW8QohC_PZvYg" alt="Cocktail" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="font-label-caps text-label-caps text-white bg-black/80 px-2 py-1 rounded">Hidden</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-xs">
                <span className="font-label-caps text-label-caps bg-surface-variant text-on-surface-variant px-2 py-1 rounded-full text-[10px]">Drinks</span>
              </div>
              <h3 className="font-h3 text-lg text-on-surface-variant truncate line-through">Crimson Void Cocktail</h3>
              <p className="font-h3 text-body-md text-on-surface-variant">$14.000</p>
            </div>
            <div className="flex flex-col gap-sm shrink-0">
              <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:text-primary hover:shadow-[0_0_10px_rgba(255,83,91,0.3)] transition-all border border-white/5">
                <span className="material-symbols-outlined text-[18px]">visibility_off</span>
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Add Product Form Section */}
        <section className="glass-panel rounded-xl p-md flex flex-col gap-lg relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/20 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">add_box</span>
            <h2 className="font-h3 text-h3 text-on-surface">Add New Product</h2>
          </div>
          <form className="flex flex-col gap-md">
            {/* Name & Price Row */}
            <div className="flex gap-md">
              <div className="flex-1 flex flex-col gap-xs input-glow rounded-lg transition-all">
                <label className="font-label-caps text-label-caps text-on-surface-variant px-1">Name</label>
                <input className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/50 outline-none focus:ring-0 focus:border-transparent transition-colors" placeholder="Product Name" type="text" />
              </div>
              <div className="w-1/3 flex flex-col gap-xs input-glow rounded-lg transition-all">
                <label className="font-label-caps text-label-caps text-on-surface-variant px-1">Price</label>
                <div className="relative">
                  <span className="absolute left-sm top-1/2 -translate-y-1/2 text-primary font-h3">$</span>
                  <input className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm pl-8 text-on-surface font-h3 placeholder:text-on-surface-variant/50 outline-none focus:ring-0 focus:border-transparent transition-colors" placeholder="0.00" type="number" />
                </div>
              </div>
            </div>
            {/* Category */}
            <div className="flex flex-col gap-xs input-glow rounded-lg transition-all">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">Category</label>
              <select className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md outline-none focus:ring-0 focus:border-transparent appearance-none" defaultValue="">
                <option disabled value="">Select Category</option>
                <option value="mains">Mains</option>
                <option value="drinks">Drinks</option>
                <option value="sides">Sides</option>
              </select>
            </div>
            {/* Description */}
            <div className="flex flex-col gap-xs input-glow rounded-lg transition-all">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1">Description</label>
              <textarea className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm text-on-surface font-body-md placeholder:text-on-surface-variant/50 outline-none focus:ring-0 focus:border-transparent resize-none" placeholder="Describe the dish..." rows={3}></textarea>
            </div>
            {/* Media Upload Grid */}
            <div className="grid grid-cols-2 gap-md mt-sm">
              {/* Image Upload */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant px-1">Image</label>
                <div className="border border-dashed border-white/20 rounded-lg h-32 flex flex-col items-center justify-center gap-sm bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">image</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">Upload 2D</span>
                </div>
              </div>
              {/* 3D Upload */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-primary px-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">view_in_ar</span> 3D Asset
                </label>
                <div className="border border-dashed border-primary/40 rounded-lg h-32 flex flex-col items-center justify-center gap-sm bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">deployed_code</span>
                  <span className="font-label-caps text-label-caps text-primary text-center px-2">Subir Archivo 3D<br /><span className="text-[9px] opacity-70">(GLB/GLTF)</span></span>
                </div>
              </div>
            </div>
            {/* Submit Action */}
            <button className="mt-md w-full bg-primary-container text-white font-h3 text-body-md py-md rounded-lg shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-sm" type="button">
              <span className="material-symbols-outlined">save</span>
              Save Product
            </button>
          </form>
        </section>
      </main>

      {/* Floating Action Button (FAB) for Add */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary-container text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,83,91,0.4)] z-40 hover:scale-105 active:scale-95 transition-all md:hidden">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-sm px-gutter bg-surface-container/90 dark:bg-surface-container/90 backdrop-blur-xl border-t border-white/10 rounded-t-xl shadow-[0_-5px_25px_rgba(0,0,0,0.5)] md:hidden">
        <Link href="/menu" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span className="font-label-caps text-label-caps mt-1">Menu</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="font-label-caps text-label-caps mt-1">Cart</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-caps text-label-caps mt-1">Orders</span>
        </Link>
        <Link href="/admin" className="flex flex-col items-center justify-center text-primary font-bold after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary-container transition-all scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-caps text-label-caps mt-1">Admin</span>
        </Link>
      </nav>
    </>
  );
}
