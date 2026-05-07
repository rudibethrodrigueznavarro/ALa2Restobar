export default function Home() {
  return (
    <>
      {/* Atmospheric Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Main Content Container */}
      <main className="w-full max-w-md mx-auto px-lg py-xl flex flex-col items-center z-10 min-h-screen justify-between">
        {/* Top Section: Brand & Banner */}
        <div className="w-full flex flex-col items-center gap-lg mt-xl">
          {/* Banner */}
          <div className="w-full bg-surface-container/80 backdrop-blur-xl border border-white/10 rounded-full py-sm px-md flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">electric_moped</span>
            <span className="font-label-caps text-label-caps text-on-surface tracking-widest uppercase">Domicilios Gratis</span>
          </div>
          
          {/* Brand Header */}
          <div className="text-center mt-md">
            <h1 className="font-h1 text-h1 text-on-surface uppercase tracking-tighter">
              A LA <span className="text-primary text-glow">2</span>
            </h1>
            <h3 className="font-h3 text-h3 text-on-surface-variant uppercase tracking-widest mt-xs">RESTO-BAR</h3>
          </div>
        </div>
        
        {/* Hero Image Container (Glassmorphism & Neon) */}
        <div className="relative w-full aspect-square max-w-[320px] my-lg">
          {/* Glow Base */}
          <div className="absolute inset-0 bg-primary-container/30 blur-[40px] rounded-full scale-90"></div>
          {/* Hero Image */}
          <div className="relative w-full h-full rounded-full border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(230,57,70,0.3)] bg-surface-container">
            <img 
              alt="Premium Burger" 
              className="w-full h-full object-cover scale-110 object-center" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW2jcx7Ffr6FxNDRyBbQS_OoDepKnqabbSU5qvJPx14bHQPxyPdJn_WhuryY_i5nWZ8guac488W1-g7WRWZwsqLzrVBY57apIwBmTsi4qWL4g7WK2sflV35N5_r09ZTMa_3mdkVEFr-udeHWkzAAGLVp4FaYfOTrWxrEyi0gFuZix7vMR_y36BCf-mHEMhlYVovV5COMUdDNBNBnmwv9d7bLT4sAf-qQoYVsOVvNGFSHJHsGkWMlZ-cIml3jQjWEeC3Iov5g2s6Q"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-md mb-xl">
          <button className="w-full bg-[#e63946] text-white font-h3 text-h3 py-md rounded-xl glow-red flex items-center justify-center gap-sm transition-transform hover:scale-[1.02] active:scale-95">
            Ver Menú
            <span className="material-symbols-outlined">restaurant_menu</span>
          </button>
          <button className="w-full bg-surface-container/50 backdrop-blur-xl border border-white/10 text-on-surface font-h3 text-h3 py-md rounded-xl flex items-center justify-center gap-sm transition-colors hover:bg-surface-container">
            Promociones
            <span className="material-symbols-outlined">local_offer</span>
          </button>
        </div>
      </main>
    </>
  );
}
