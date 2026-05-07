export default function Menu() {
  return (
    <>
      {/* TopAppBar (Web & Mobile) */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <button className="text-primary hover:text-primary transition-colors opacity-80 duration-200 p-sm rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
        </button>
        <h1 className="font-h2 text-h2 uppercase tracking-tighter text-primary">A LA 2 RESTO-BAR</h1>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 relative">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
          <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(230,57,70,0.8)] border border-background"></span>
        </button>
      </header>
      
      {/* Main Content Canvas */}
      <main className="pt-[80px] px-gutter max-w-7xl mx-auto w-full pb-xxl">
        {/* Search Bar */}
        <div className="mb-lg relative max-w-md mx-auto md:max-w-xl">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="w-full bg-surface-container-high border border-white/10 rounded-full py-md pl-xl pr-md text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(230,57,70,0.3)] transition-all" placeholder="Buscar en el menú..." type="text"/>
        </div>
        
        {/* Category Horizontal Scroll */}
        <div className="overflow-x-auto pb-sm mb-xl hide-scrollbar flex space-x-md -mx-gutter px-gutter md:mx-0 md:px-0">
          {/* Active Category */}
          <button className="flex flex-col items-center min-w-[80px] group flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary shadow-[0_0_15px_rgba(230,57,70,0.4)] mb-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lunch_dining</span>
            </div>
            <span className="font-label-caps text-label-caps text-primary">Burgers</span>
          </button>
          {/* Inactive Categories */}
          <button className="flex flex-col items-center min-w-[80px] group flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 mb-sm transition-all group-hover:bg-white/5 group-hover:border-primary/50">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_pizza</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface">Pizzas</span>
          </button>
          <button className="flex flex-col items-center min-w-[80px] group flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 mb-sm transition-all group-hover:bg-white/5 group-hover:border-primary/50">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]" style={{ fontVariationSettings: "'FILL' 0" }}>fastfood</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface">Salchipapas</span>
          </button>
          <button className="flex flex-col items-center min-w-[80px] group flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 mb-sm transition-all group-hover:bg-white/5 group-hover:border-primary/50">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_drink</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface">Bebidas</span>
          </button>
          <button className="flex flex-col items-center min-w-[80px] group flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 mb-sm transition-all group-hover:bg-white/5 group-hover:border-primary/50">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]" style={{ fontVariationSettings: "'FILL' 0" }}>icecream</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface">Postres</span>
          </button>
        </div>
        
        {/* Menu Grid */}
        <h2 className="font-h3 text-h3 text-on-surface mb-md">Burgers Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xxl">
          {/* Product Card 1 */}
          <div className="bg-surface-container-high/80 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col relative group">
            <div className="h-48 w-full relative overflow-hidden bg-surface-dim">
              <img alt="Gourmet Burger" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4N85gE9YWWqKcTfQrlojXBzEHGWgYfSeansBTg7ZznaQYAGgp7jjH0IN6pBxCYO3DGNnpCBGdrThlf3i4AacjlTNdRtWw5R0--whWz4Vrw6PxJs3Ij0vuuKfqpzV75vuszdEOnZOoTrVXlz2CiaeLaoA98YIwwNC7k3rBYckfS9hp4KJEcBSns6qJ13WGtsLkgqYyeSwabmka38mfaJ6EGhgdNwFq8uem1J1WSw7QWorZYkJDx3bL2vjVgGktr0hDCEXNubLrww"/>
              <div className="absolute top-sm left-sm flex flex-col gap-xs">
                <span className="bg-primary text-on-primary font-label-caps text-label-caps px-sm py-xs rounded-full inline-block shadow-[0_0_10px_rgba(230,57,70,0.5)]">MÁS VENDIDO</span>
              </div>
              <button className="absolute bottom-sm right-sm bg-surface/90 backdrop-blur-md p-sm rounded-full border border-white/20 text-on-surface hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(230,57,70,0.4)] transition-all flex items-center justify-center group/3d z-10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
                <span className="max-w-0 overflow-hidden group-hover/3d:max-w-xs transition-all duration-300 font-label-caps text-label-caps whitespace-nowrap px-xs">Ver en 3D</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-high/80 to-transparent"></div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-sm">
                <h3 className="font-h3 text-h3 text-on-surface leading-tight">La A La 2 Clásica</h3>
                <span className="font-h3 text-h3 text-primary whitespace-nowrap">$12.50</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md flex-grow">Doble carne premium, queso cheddar fundido, tocino crujiente, lechuga fresca, tomate y nuestra salsa secreta de la casa en pan brioche artesanal.</p>
              <button className="w-full bg-surface-bright border border-white/10 hover:border-primary text-on-surface hover:text-primary font-label-caps text-label-caps py-md rounded-lg flex items-center justify-center gap-sm transition-all hover:shadow-[0_0_15px_rgba(230,57,70,0.2)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add_shopping_cart</span>
                AGREGAR
              </button>
            </div>
          </div>
          {/* Product Card 2 */}
          <div className="bg-surface-container-high/80 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col relative group">
            <div className="h-48 w-full relative overflow-hidden bg-surface-dim">
              <img alt="Spicy Burger" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAngO8Crhti3xkz8nhDCmiFUJUkEFhFYThICWIdnNzk91EmKVptR3FE3Uf_skKMt1OXCqcV1YxRcizUyo27n1d7W03q7YrVTyS1V0aKBiFoSS6pt6BuFO_qF2IRB_BXrbVY2T8OggdbBajn_H5AcVlbZT4SVkjtDFx8b93ILU6P_TFcKFZ59aS4i78Ve4GgXlmOohk6hU5TcsDmf9_6PsAPdjmEYeEE8NlMRP1yrbdzMykxQkbzae4A6byMhLGAqad949L_4eJ71g"/>
              <div className="absolute top-sm left-sm flex flex-col gap-xs">
                <span className="bg-error text-on-error font-label-caps text-label-caps px-sm py-xs rounded-full inline-block shadow-[0_0_10px_rgba(255,180,171,0.3)]">PICANTE</span>
              </div>
              <button className="absolute bottom-sm right-sm bg-surface/90 backdrop-blur-md p-sm rounded-full border border-white/20 text-on-surface hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(230,57,70,0.4)] transition-all flex items-center justify-center group/3d z-10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
                <span className="max-w-0 overflow-hidden group-hover/3d:max-w-xs transition-all duration-300 font-label-caps text-label-caps whitespace-nowrap px-xs">Ver en 3D</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-high/80 to-transparent"></div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-sm">
                <h3 className="font-h3 text-h3 text-on-surface leading-tight">Diablo Burger</h3>
                <span className="font-h3 text-h3 text-primary whitespace-nowrap">$14.00</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md flex-grow">Carne de res, queso pepper jack, jalapeños rostizados, cebolla caramelizada y aderezo de sriracha picante.</p>
              <button className="w-full bg-surface-bright border border-white/10 hover:border-primary text-on-surface hover:text-primary font-label-caps text-label-caps py-md rounded-lg flex items-center justify-center gap-sm transition-all hover:shadow-[0_0_15px_rgba(230,57,70,0.2)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add_shopping_cart</span>
                AGREGAR
              </button>
            </div>
          </div>
          {/* Product Card 3 */}
          <div className="bg-surface-container-high/80 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col relative group">
            <div className="h-48 w-full relative overflow-hidden bg-surface-dim">
              <img alt="Veggie Burger" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW5mnlEjSxPZvJAjZYLS53GfyFkRXL3DD8ONI3j6b0jG1BRXrRw6vMn7UizjWG9VZsYRXTpMB4OQosMyhzpgRoU4BjBy1qgf2jsGOU73koaK7JjIFkkv0jVgAhH8vRd_r3e4LE-vetueh7f4xjrCye-Lmkq2CRNROrUVy9jzbRVdpmYQTVEEz1P_z_QBNPOzG3vFlOATf--izITZXUBGbACn80hbNjvDjq1KuQXUcMR_WvNeyx67rCTBD6dgeXAkiAS_j4-KeVFA"/>
              <div className="absolute top-sm left-sm flex flex-col gap-xs">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps px-sm py-xs rounded-full inline-block">VEGANO</span>
              </div>
              <button className="absolute bottom-sm right-sm bg-surface/90 backdrop-blur-md p-sm rounded-full border border-white/20 text-on-surface hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(230,57,70,0.4)] transition-all flex items-center justify-center group/3d z-10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
                <span className="max-w-0 overflow-hidden group-hover/3d:max-w-xs transition-all duration-300 font-label-caps text-label-caps whitespace-nowrap px-xs">Ver en 3D</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-high/80 to-transparent"></div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-sm">
                <h3 className="font-h3 text-h3 text-on-surface leading-tight">La Alternativa</h3>
                <span className="font-h3 text-h3 text-primary whitespace-nowrap">$13.50</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md flex-grow">Medallón de proteína vegetal crujiente, aguacate fresco, espinaca baby y mayonesa vegana de ajo rostizado.</p>
              <button className="w-full bg-surface-bright border border-white/10 hover:border-primary text-on-surface hover:text-primary font-label-caps text-label-caps py-md rounded-lg flex items-center justify-center gap-sm transition-all hover:shadow-[0_0_15px_rgba(230,57,70,0.2)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add_shopping_cart</span>
                AGREGAR
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Cart Button (Desktop/Global overrides) */}
      <button className="fixed bottom-24 right-md md:bottom-md md:right-xl bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(230,57,70,0.6)] hover:scale-105 hover:bg-primary-container transition-all z-40">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
        <span className="absolute -top-2 -right-2 bg-white text-primary font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">2</span>
      </button>
      
      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-sm px-gutter bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] rounded-t-xl">
        <button className="flex flex-col items-center justify-center text-primary font-bold after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary-container transition-all scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
          <span className="font-label-caps text-label-caps mt-1">Menu</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
          <span className="font-label-caps text-label-caps mt-1">Cart</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
          <span className="font-label-caps text-label-caps mt-1">Orders</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
          <span className="font-label-caps text-label-caps mt-1">Admin</span>
        </button>
      </nav>
    </>
  );
}
