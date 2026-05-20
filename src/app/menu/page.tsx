"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

/* ─── Imports ─── */
import {
  CATEGORIES,
  PRODUCTS,
  SECTION_TITLES,
  deserializeCart,
  serializeCart,
  parsePrice,
  formatPrice,
  type Product,
  type CategoryId,
  type Badge,
  type CartItem
} from "../data/products";

/* ─── Component ──────────────────────────────────────────────── */
export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("burgers");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Leer carrito desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ala2_cart");
      if (stored) setCart(deserializeCart(stored));
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  // Keyboard navigation & Auto-focus
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync cart → localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("ala2_cart", serializeCart(cart));
  }, [cart, mounted]);

  function openModal(product: Product) {
    setSelectedProduct(product);
    const existing = cart.find(i => i.product.id === product.id);
    setQuantity(existing ? existing.quantity : 1);
    setNotes(existing ? existing.notes : "");
  }

  function addToCart() {
    if (!selectedProduct) return;
    setCart(prev => {
      const existing = prev.findIndex(i => i.product.id === selectedProduct.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], quantity, notes };
        return next;
      }
      return [...prev, { product: selectedProduct, quantity, notes }];
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
    setSelectedProduct(null);
  }

  function updateCartQuantity(productId: number, delta: number) {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === productId);
      if (existingIndex >= 0) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + delta;
        if (newQty <= 0) {
          next.splice(existingIndex, 1);
        } else {
          next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        }
        return next;
      }
      return prev;
    });
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Flat list of all products to search across all categories
  const allProducts = Object.values(PRODUCTS).flat();
  // Filter products by query matching name or description
  const isSearchingActive = searchQuery.trim() !== "";
  const filteredProducts = isSearchingActive
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const products = isSearchingActive ? filteredProducts : PRODUCTS[activeCategory];
  const sectionTitle = isSearchingActive
    ? `Resultados para "${searchQuery}"`
    : SECTION_TITLES[activeCategory];

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)] flex items-center overflow-hidden">
        {/* Standard Header Layout */}
        <div className={`flex items-center justify-between w-full h-full transition-all duration-300 ${
          isSearchOpen 
            ? 'opacity-0 -translate-x-4 pointer-events-none' 
            : 'opacity-100 translate-x-0 pointer-events-auto'
        }`}>
          <Link href="/" className="text-primary hover:text-primary transition-colors opacity-80 duration-200 p-sm rounded-full hover:bg-white/5">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </Link>
          <h1 className="font-h2 text-h2 uppercase tracking-tighter text-primary">A LA 2 RESTO-BAR</h1>
          <div className="flex items-center gap-xs">
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 cursor-pointer flex items-center justify-center animate-fade-in"
              aria-label="Abrir búsqueda"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            </button>
            <Link href="/resumen" className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 relative">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(230,57,70,0.8)] border border-background">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <div 
          className={`absolute inset-0 px-md h-full flex items-center justify-between gap-md bg-surface/95 backdrop-blur-xl transition-all duration-300 ease-out ${
            isSearchOpen 
              ? 'opacity-100 translate-x-0 pointer-events-auto' 
              : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
        >
          <button 
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }} 
            className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 shrink-0 cursor-pointer flex items-center justify-center"
            aria-label="Cerrar búsqueda"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant select-none">search</span>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-full py-sm pl-xl pr-xl text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(230,57,70,0.3)] transition-all"
              placeholder="Buscar en el menú..."
              type="text"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-xs rounded-full flex items-center justify-center cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <Link href="/resumen" className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 relative shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(230,57,70,0.8)] border border-background">{cartCount}</span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-[72px] px-gutter max-w-7xl mx-auto w-full pb-xxl">
        {/* Category Horizontal Scroll */}
        {!isSearchingActive && (
          <div className="overflow-x-auto pt-sm pb-sm mb-xl hide-scrollbar flex space-x-md -mx-gutter px-gutter md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center min-w-[80px] group flex-shrink-0"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-sm transition-all duration-200 group-hover:scale-105 ${
                    isActive
                      ? "bg-primary/20 border-2 border-primary shadow-[0_0_15px_rgba(230,57,70,0.4)]"
                      : "bg-surface-container-high border border-white/5 group-hover:bg-white/5 group-hover:border-primary/50"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[28px] ${isActive ? "text-primary" : "text-on-surface-variant"}`}
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
      )}

        {/* Menu Grid */}
        <h2 className="font-h3 text-h3 text-on-surface mb-md">{sectionTitle}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xxl">
            {products.map((product) => {
              const cartItem = cart.find((item) => item.product.id === product.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              return (
                <div key={product.id} className="bg-surface-container-high/80 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col relative group">
                  {/* Image */}
                  <div 
                    className="h-48 w-full relative overflow-hidden bg-surface-dim cursor-pointer"
                    onClick={() => openModal(product)}
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
                    onClick={() => openModal(product)}
                  >
                    <div className="flex justify-between items-start mb-sm">
                      <h3 className="font-h3 text-h3 text-on-surface leading-tight">{product.name}</h3>
                      <span className="font-h3 text-h3 text-primary whitespace-nowrap">{product.price}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-grow line-clamp-2">
                      {product.description}
                    </p>
                    {quantityInCart > 0 ? (
                      <div className="w-full relative">
                        <div className="w-full flex items-center h-12 bg-emerald-700 text-white rounded-xl border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.5)] overflow-hidden">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateCartQuantity(product.id, -1); }}
                            className="w-12 h-full flex items-center justify-center hover:bg-emerald-600/50 active:bg-emerald-800 transition-colors border-r border-emerald-400/20 cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <span className="material-symbols-outlined text-[20px] font-bold">remove</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openModal(product); }}
                            className="flex-grow h-full flex items-center justify-center gap-sm hover:bg-emerald-600/40 transition-colors font-label-caps text-[16px] font-bold tracking-wider cursor-pointer select-none"
                          >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                            AGREGADO • {formatPrice(parsePrice(product.price) * quantityInCart)}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateCartQuantity(product.id, 1); }}
                            className="w-12 h-full flex items-center justify-center hover:bg-emerald-600/50 active:bg-emerald-800 transition-colors border-l border-emerald-400/20 cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                          </button>
                        </div>
                        <span className="absolute -top-2 -right-2 bg-primary text-on-primary font-bold text-xs min-w-[24px] h-[24px] px-1.5 rounded-full flex items-center justify-center border-2 border-surface-container-high shadow-[0_0_10px_rgba(255,83,91,0.8)] animate-pop-in pointer-events-none z-10">
                          {quantityInCart}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); openModal(product); }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-label-caps text-[16px] font-bold tracking-wider py-md rounded-xl flex items-center justify-center gap-sm transition-all hover:scale-[1.02] active:scale-95 border border-emerald-500/20 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                        AGREGAR • {product.price}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 px-md bg-surface-container-high/40 border border-white/5 rounded-2xl mb-xxl backdrop-blur-md">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-md select-none">search_off</span>
            <h3 className="font-h3 text-h3 text-on-surface mb-xs">No se encontraron productos</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              No hallamos ningún platillo o bebida que coincida con tu búsqueda. Intenta con otros ingredientes o nombres.
            </p>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-md bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative bg-surface-container border border-white/10 rounded-2xl w-full md:max-w-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] md:max-h-[600px] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 hover:scale-105 transition-all z-50 border border-white/10 shadow-lg flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Scrollable Container covering the entire modal content */}
            <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col md:flex-row rounded-2xl">
              {/* Product Image */}
              <div className="relative w-full h-[240px] md:h-auto md:w-1/2 shrink-0 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                <img src={selectedProduct.img} alt={selectedProduct.imgAlt} className="w-full h-full object-cover" />
              </div>

              {/* Product Details */}
              <div className="flex flex-col w-full md:w-1/2 p-5 md:p-8 md:min-h-[480px]">
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-surface-dim/60 border border-white/10 rounded-xl px-4 py-3 text-[13px] md:text-body-md text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(230,57,70,0.25)] transition-all leading-relaxed"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Cantidad */}
                <div className="mb-4">
                  <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>production_quantity_limits</span>
                    Cantidad
                  </span>
                  <div className="flex items-center gap-0 bg-surface-dim/60 border border-white/10 rounded-xl overflow-hidden w-fit">
                    <button
                      onClick={(e) => { e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
                      className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all text-xl font-bold"
                      aria-label="Disminuir cantidad"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <span className="w-12 text-center font-h3 text-h3 text-on-surface select-none">{quantity}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setQuantity(q => q + 1); }}
                      className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all text-xl font-bold"
                      aria-label="Aumentar cantidad"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex gap-sm">
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(); }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-label-caps text-[16px] font-bold tracking-wider py-md rounded-xl flex items-center justify-center gap-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-500/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                    AGREGAR • {formatPrice(parsePrice(selectedProduct.price) * quantity)}
                  </button>
                </div>
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
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-primary font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">{cartCount}</span>
        )}
      </Link>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 grid grid-cols-3 items-center py-sm bg-surface-container/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] rounded-t-xl">
        <Link href="/menu" className="flex flex-col items-center justify-center text-primary font-bold after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1 hover:text-primary-container transition-all scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
          <span className="font-label-caps text-label-caps mt-1">Menu</span>
        </Link>
        <Link href="/resumen" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
          <span className="font-label-caps text-label-caps mt-1">Pedido</span>
        </Link>
        <Link href="/pedidos" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
          <span className="font-label-caps text-label-caps mt-1">Mis Pedidos</span>
        </Link>
      </nav>
    </>
  );
}
