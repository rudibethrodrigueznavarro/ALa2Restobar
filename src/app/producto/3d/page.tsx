import Link from "next/link";

export default function Visor3D() {
  return (
    <div className="fixed inset-0 z-[100] bg-background text-on-surface antialiased overflow-hidden h-screen w-full relative flex flex-col selection:bg-primary/30">
      {/* Ambient Background Grid (Cyberpunk Lite feel) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Top Action Bar (Close Only) */}
      <div className="absolute top-0 left-0 w-full z-50 flex justify-end p-lg pointer-events-auto">
        <Link href="/menu" className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container/50 backdrop-blur-xl border border-white/10 text-on-surface hover:bg-surface-container hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
          <span className="material-symbols-outlined">close</span>
        </Link>
      </div>

      {/* Main 3D Viewer Canvas */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* UI Brackets (Tech aesthetic) */}
        <div className="absolute top-1/4 left-[10%] w-8 h-8 border-t-2 border-l-2 border-primary/30"></div>
        <div className="absolute bottom-1/4 right-[10%] w-8 h-8 border-b-2 border-r-2 border-primary/30"></div>
        
        {/* Central Glow / Pedestal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px]"></div>
        
        {/* 3D Model Placeholder */}
        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
          {/* Simulated floating effect container */}
          <div className="w-[80%] h-[80%] relative z-20 transition-transform duration-1000 ease-in-out hover:scale-105">
            <img alt="3D Burger Render" className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter brightness-110 contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJa2LyeRW27tx0k-yGPNNkiGIoMsLHYHnK5kiYqM3SMKzw0HG-P3UzkvVpXQYpzu8iUyvomLPZBbvbi9N8QQa8DrtX5R1prkmkAIkK5PNQ6ZD4slD78dMyY_28-93Mma_F-CWjE7XmOmmAdm2PYt3I0XIfaqCRbmKUyvfjCIZcJlr-NWooF72_WHs-r2EDYlj6E69Qsxpem6glBkdXYMehctin_RpbOz53PHZYQXAMXGxQvmslydOIstHf2tX3UAzmn-2fJO2VOw"/>
          </div>
          {/* Shadow projection */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/80 rounded-[100%] blur-md"></div>
        </div>
        
        {/* Floating Controls (Rotate / Zoom) */}
        <div className="absolute right-lg top-1/2 -translate-y-1/2 flex flex-col gap-md z-30 pointer-events-auto">
          <button className="flex flex-col items-center justify-center gap-xs p-md bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/30 hover:bg-surface-container transition-all group">
            <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">360</span>
            <span className="font-label-caps text-label-caps uppercase tracking-widest">Rotate</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-xs p-md bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/30 hover:bg-surface-container transition-all group">
            <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">zoom_in</span>
            <span className="font-label-caps text-label-caps uppercase tracking-widest">Zoom</span>
          </button>
        </div>
      </div>

      {/* Bottom Product Detail Panel (Glassmorphism) */}
      <div className="relative z-40 w-full bg-surface-container/80 backdrop-blur-2xl border-t border-white/10 rounded-t-[32px] p-lg md:p-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        {/* Left: Details */}
        <div className="flex flex-col gap-sm w-full md:w-auto">
          <div className="flex items-center gap-sm mb-xs">
            <span className="px-sm py-xs bg-surface-bright/50 border border-white/10 rounded-full font-label-caps text-label-caps text-on-surface-variant uppercase">Signature Series</span>
            <span className="px-sm py-xs bg-primary/20 border border-primary/30 rounded-full font-label-caps text-label-caps text-primary uppercase">Spicy</span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface uppercase tracking-tighter m-0 leading-none">Cyber Smash</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mt-xs">Double wagyu beef patty, neon-spiced aioli, sharp cheddar, artisan black brioche bun.</p>
        </div>
        {/* Right: Price & CTA */}
        <div className="flex flex-col md:flex-row items-center gap-lg w-full md:w-auto shrink-0 mt-md md:mt-0">
          <div className="flex flex-col items-end w-full md:w-auto">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Total</span>
            <span className="font-h1 text-h1 text-primary-container leading-none">$24.00</span>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-sm px-xxl py-lg bg-primary-container text-on-primary-container font-h3 text-h3 uppercase rounded-xl shadow-[0_0_25px_rgba(255,83,91,0.3)] hover:shadow-[0_0_35px_rgba(255,83,91,0.5)] hover:bg-primary transition-all duration-300">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            Agregar al Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
