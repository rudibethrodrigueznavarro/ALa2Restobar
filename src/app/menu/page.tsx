"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
type Badge = { label: string; className: string };

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  img: string;
  imgAlt: string;
  badge?: Badge;
}

/* ─── Category definitions ───────────────────────────────────── */
const CATEGORIES = [
  { id: "burgers",     label: "Burgers",     icon: "lunch_dining" },
  { id: "pizzas",      label: "Pizzas",      icon: "local_pizza"  },
  { id: "salchipapas", label: "Salchipapas", icon: "fastfood"     },
  { id: "bebidas",     label: "Bebidas",     icon: "local_drink"  },
  { id: "postres",     label: "Postres",     icon: "icecream"     },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/* ─── Mock product data ──────────────────────────────────────── */
const PRODUCTS: Record<CategoryId, Product[]> = {
  burgers: [
    {
      id: 1,
      name: "La A La 2 Clásica",
      price: "$12.500",
      description: "Doble carne premium, queso cheddar fundido, tocino crujiente, lechuga fresca, tomate y nuestra salsa secreta de la casa en pan brioche artesanal.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4N85gE9YWWqKcTfQrlojXBzEHGWgYfSeansBTg7ZznaQYAGgp7jjH0IN6pBxCYO3DGNnpCBGdrThlf3i4AacjlTNdRtWw5R0--whWz4Vrw6PxJs3Ij0vuuKfqpzV75vuszdEOnZOoTrVXlz2CiaeLaoA98YIwwNC7k3rBYckfS9hp4KJEcBSns6qJ13WGtsLkgqYyeSwabmka38mfaJ6EGhgdNwFq8uem1J1WSw7QWorZYkJDx3bL2vjVgGktr0hDCEXNubLrww",
      imgAlt: "La A La 2 Clásica",
      badge: { label: "MÁS VENDIDO", className: "bg-primary text-on-primary shadow-[0_0_10px_rgba(230,57,70,0.5)]" },
    },
    {
      id: 2,
      name: "Diablo Burger",
      price: "$14.000",
      description: "Carne de res, queso pepper jack, jalapeños rostizados, cebolla caramelizada y aderezo de sriracha picante.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAngO8Crhti3xkz8nhDCmiFUJUkEFhFYThICWIdnNzk91EmKVptR3FE3Uf_skKMt1OXCqcV1YxRcizUyo27n1d7W03q7YrVTyS1V0aKBiFoSS6pt6BuFO_qF2IRB_BXrbVY2T8OggdbBajn_H5AcVlbZT4SVkjtDFx8b93ILU6P_TFcKFZ59aS4i78Ve4GgXlmOohk6hU5TcsDmf9_6PsAPdjmEYeEE8NlMRP1yrbdzMykxQkbzae4A6byMhLGAqad949L_4eJ71g",
      imgAlt: "Diablo Burger",
      badge: { label: "PICANTE", className: "bg-error text-on-error shadow-[0_0_10px_rgba(255,180,171,0.3)]" },
    },
    {
      id: 3,
      name: "La Alternativa",
      price: "$13.500",
      description: "Medallón de proteína vegetal crujiente, aguacate fresco, espinaca baby y mayonesa vegana de ajo rostizado.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW5mnlEjSxPZvJAjZYLS53GfyFkRXL3DD8ONI3j6b0jG1BRXrRw6vMn7UizjWG9VZsYRXTpMB4OQosMyhzpgRoU4BjBy1qgf2jsGOU73koaK7JjIFkkv0jVgAhH8vRd_r3e4LE-vetueh7f4xjrCye-Lmkq2CRNROrUVy9jzbRVdpmYQTVEEz1P_z_QBNPOzG3vFlOATf--izITZXUBGbACn80hbNjvDjq1KuQXUcMR_WvNeyx67rCTBD6dgeXAkiAS_j4-KeVFA",
      imgAlt: "La Alternativa Vegana",
      badge: { label: "VEGANO", className: "bg-tertiary-fixed text-on-tertiary-fixed" },
    },
  ],
  pizzas: [
    {
      id: 4,
      name: "Pizza A La 2",
      price: "$16.000",
      description: "Salsa de tomate artesanal, mozzarella premium, pepperoni importado y albahaca fresca sobre masa de fermentación lenta.",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
      imgAlt: "Pizza A La 2",
      badge: { label: "ESPECIAL", className: "bg-primary text-on-primary shadow-[0_0_10px_rgba(230,57,70,0.5)]" },
    },
    {
      id: 5,
      name: "Pizza Cuatro Quesos",
      price: "$17.500",
      description: "Mozzarella, parmesano, gorgonzola y queso de cabra sobre base de crema blanca y orégano fresco.",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      imgAlt: "Pizza Cuatro Quesos",
    },
    {
      id: 6,
      name: "Pizza BBQ Bacon",
      price: "$18.000",
      description: "Salsa BBQ ahumada, pollo a la parrilla, tocino crujiente, cebolla morada y mozzarella derretida.",
      img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80",
      imgAlt: "Pizza BBQ Bacon",
      badge: { label: "POPULAR", className: "bg-secondary text-on-secondary" },
    },
  ],
  salchipapas: [
    {
      id: 7,
      name: "Salchipapa Clásica",
      price: "$7.000",
      description: "Papas fritas crocantes con rodajas de salchicha, ketchup, mostaza y mayonesa de la casa.",
      img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&q=80",
      imgAlt: "Salchipapa Clásica",
      badge: { label: "MÁS VENDIDO", className: "bg-primary text-on-primary shadow-[0_0_10px_rgba(230,57,70,0.5)]" },
    },
    {
      id: 8,
      name: "Salchipapa Especial",
      price: "$9.500",
      description: "Papas crinkle, salchicha premium, queso cheddar fundido, tocineta y jalapeños encurtidos.",
      img: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80",
      imgAlt: "Salchipapa Especial",
      badge: { label: "PICANTE", className: "bg-error text-on-error shadow-[0_0_10px_rgba(255,180,171,0.3)]" },
    },
    {
      id: 9,
      name: "Papas Loaded",
      price: "$10.000",
      description: "Papas gruesas horneadas, queso fundido, crema agria, cebollín y tiras de pollo BBQ.",
      img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80",
      imgAlt: "Papas Loaded",
    },
  ],
  bebidas: [
    {
      id: 10,
      name: "Limonada de Menta",
      price: "$4.500",
      description: "Limón fresco exprimido, menta fresca, jarabe natural y agua con gas. Refrescante y sin azúcar añadida.",
      img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
      imgAlt: "Limonada de Menta",
      badge: { label: "SIN AZÚCAR", className: "bg-tertiary-fixed text-on-tertiary-fixed" },
    },
    {
      id: 11,
      name: "Michelada A La 2",
      price: "$6.000",
      description: "Cerveza fría, jugo de tomate, limón, salsa inglesa, salsa picante y chamoy en el borde. La favorita de la casa.",
      img: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
      imgAlt: "Michelada A La 2",
      badge: { label: "ESPECIAL", className: "bg-primary text-on-primary shadow-[0_0_10px_rgba(230,57,70,0.5)]" },
    },
    {
      id: 12,
      name: "Jugo Natural",
      price: "$3.500",
      description: "Jugos naturales de temporada: mango, maracuyá, mora o naranja. Preparados al momento sin conservantes.",
      img: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&q=80",
      imgAlt: "Jugo Natural",
    },
  ],
  postres: [
    {
      id: 13,
      name: "Brownie Caliente",
      price: "$5.500",
      description: "Brownie de chocolate oscuro tibio servido con una bola de helado de vainilla y salsa de caramelo.",
      img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
      imgAlt: "Brownie Caliente",
      badge: { label: "FAVORITO", className: "bg-primary text-on-primary shadow-[0_0_10px_rgba(230,57,70,0.5)]" },
    },
    {
      id: 14,
      name: "Helado Artesanal",
      price: "$4.000",
      description: "Tres bolas de helado artesanal. Sabores disponibles: vainilla, chocolate, fresa, mango o maracuyá.",
      img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
      imgAlt: "Helado Artesanal",
    },
    {
      id: 15,
      name: "Cheesecake de Frutos Rojos",
      price: "$6.500",
      description: "Base de galleta, crema de queso suave y coulis de frutos rojos frescos. Sin gluten disponible.",
      img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
      imgAlt: "Cheesecake",
      badge: { label: "VEGANO", className: "bg-tertiary-fixed text-on-tertiary-fixed" },
    },
  ],
};

const SECTION_TITLES: Record<CategoryId, string> = {
  burgers:     "Burgers Destacadas",
  pizzas:      "Nuestras Pizzas",
  salchipapas: "Salchipapas",
  bebidas:     "Bebidas",
  postres:     "Postres",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("burgers");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = PRODUCTS[activeCategory];
  const sectionTitle = SECTION_TITLES[activeCategory];

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)]">
        <Link href="/" className="text-primary hover:text-primary transition-colors opacity-80 duration-200 p-sm rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
        </Link>
        <h1 className="font-h2 text-h2 uppercase tracking-tighter text-primary">A LA 2 RESTO-BAR</h1>
        <Link href="/resumen" className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 relative">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
          <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(230,57,70,0.8)] border border-background"></span>
        </Link>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-[80px] px-gutter max-w-7xl mx-auto w-full pb-xxl">
        {/* Search Bar */}
        <div className="mb-lg relative max-w-md mx-auto md:max-w-xl">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-surface-container-high border border-white/10 rounded-full py-md pl-xl pr-md text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(230,57,70,0.3)] transition-all"
            placeholder="Buscar en el menú..."
            type="text"
          />
        </div>

        {/* Category Horizontal Scroll */}
        <div className="overflow-x-auto pb-sm mb-xl hide-scrollbar flex space-x-md -mx-gutter px-gutter md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center min-w-[80px] group flex-shrink-0"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-sm transition-all duration-200 group-hover:scale-105 ${
                    isActive
                      ? "bg-primary/20 border-2 border-primary shadow-[0_0_15px_rgba(230,57,70,0.4)]"
                      : "bg-surface-container-high border border-white/5 group-hover:bg-white/5 group-hover:border-primary/50"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[32px] ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <span className={`font-label-caps text-label-caps ${isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <h2 className="font-h3 text-h3 text-on-surface mb-md">{sectionTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xxl">
          {products.map((product) => (
            <div key={product.id} className="bg-surface-container-high/80 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col relative group">
              {/* Image */}
              <div 
                className="h-48 w-full relative overflow-hidden bg-surface-dim cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  alt={product.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={product.img}
                />
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-sm left-sm flex flex-col gap-xs" onClick={(e) => e.stopPropagation()}>
                    <span className={`font-label-caps text-label-caps px-sm py-xs rounded-full inline-block ${product.badge.className}`}>
                      {product.badge.label}
                    </span>
                  </div>
                )}
                {/* 3D Button */}
                <Link
                  href="/producto/3d"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-sm right-sm bg-surface/90 backdrop-blur-md p-sm rounded-full border border-white/20 text-on-surface hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(230,57,70,0.4)] transition-all flex items-center justify-center group/3d z-10"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
                  <span className="max-w-0 overflow-hidden group-hover/3d:max-w-xs transition-all duration-300 font-label-caps text-label-caps whitespace-nowrap px-xs">Ver en 3D</span>
                </Link>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-high/80 to-transparent"></div>
              </div>
              {/* Info */}
              <div 
                className="p-md flex flex-col flex-grow cursor-pointer transition-colors hover:bg-white/5"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex justify-between items-start mb-sm">
                  <h3 className="font-h3 text-h3 text-on-surface leading-tight">{product.name}</h3>
                  <span className="font-h3 text-h3 text-primary whitespace-nowrap">{product.price}</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-grow line-clamp-2">
                  {product.description}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                  className="w-full bg-surface-bright border border-white/10 hover:border-primary text-on-surface hover:text-primary font-label-caps text-label-caps py-md rounded-lg flex items-center justify-center gap-sm transition-all hover:shadow-[0_0_15px_rgba(230,57,70,0.2)]"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add_shopping_cart</span>
                  AGREGAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-md bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative bg-surface-container border border-white/10 rounded-2xl w-full md:max-w-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[80vh] md:h-[480px]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 hover:scale-105 transition-all z-50 border border-white/10 shadow-lg flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Product Image */}
            <div className="relative w-full h-[40%] md:h-full md:w-1/2 shrink-0 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <img src={selectedProduct.img} alt={selectedProduct.imgAlt} className="w-full h-full object-cover" />
            </div>

            {/* Product Details */}
            <div className="flex flex-col w-full md:w-1/2 overflow-y-auto p-5 md:p-8 h-[60%] md:h-full">
              <div className="flex justify-between items-start mb-3 pr-8">
                <h2 className="font-h2 text-[20px] md:text-h2 text-on-surface leading-tight">{selectedProduct.name}</h2>
                <span className="font-h2 text-[20px] md:text-h2 text-primary whitespace-nowrap ml-3">{selectedProduct.price}</span>
              </div>
              <p className="text-[14px] md:text-body-lg text-on-surface-variant leading-relaxed mb-4">{selectedProduct.description}</p>

              {/* Observaciones */}
              <div className="mb-4">
                <label
                  htmlFor="product-observations"
                  className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>edit_note</span>
                  Observaciones
                </label>
                <textarea
                  id="product-observations"
                  rows={3}
                  placeholder="Ej: sin cebolla, extra picante, sin sal…"
                  className="w-full bg-surface-dim/60 border border-white/10 rounded-xl px-4 py-3 text-[13px] md:text-body-md text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(230,57,70,0.25)] transition-all leading-relaxed"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="mt-auto flex gap-sm">
                <Link
                  href="/resumen"
                  className="flex-1 bg-primary text-white font-label-caps text-label-caps py-md rounded-xl flex items-center justify-center gap-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(230,57,70,0.4)]"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                  HACER PEDIDO
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <Link
        href="/resumen"
        className="fixed bottom-24 right-md md:bottom-md md:right-xl bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(230,57,70,0.6)] hover:scale-105 hover:bg-primary-container transition-all z-40"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
        <span className="absolute -top-2 -right-2 bg-white text-primary font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">2</span>
      </Link>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-sm px-gutter bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] rounded-t-xl">
        <Link href="/menu" className="flex flex-col items-center justify-center text-primary font-bold after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary-container transition-all scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
          <span className="font-label-caps text-label-caps mt-1">Menu</span>
        </Link>
        <Link href="/resumen" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
          <span className="font-label-caps text-label-caps mt-1">Cart</span>
        </Link>
        <Link href="/resumen" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
          <span className="font-label-caps text-label-caps mt-1">Orders</span>
        </Link>
        <Link href="/admin" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
          <span className="font-label-caps text-label-caps mt-1">Admin</span>
        </Link>
      </nav>
    </>
  );
}
