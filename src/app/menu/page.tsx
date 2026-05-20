"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { formatPrice } from "../data/products";

interface DbCategory {
  id: number;
  name: string;
  description: string;
}

interface DbProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  model_3d_url: string | null;
  category_id: number | null;
  is_available: boolean;
}

interface Product {
  id: number;
  name: string;
  price: string; // Formateado "$12.500"
  rawPrice: number;
  description: string;
  img: string;
  imgAlt: string;
  category_id: number | null;
  model_3d_url: string | null;
  badge?: { label: string; className: string };
}

interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

export default function Menu() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Helper para iconos de categorías
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("burg") || n.includes("hamb")) return "lunch_dining";
    if (n.includes("pizz")) return "local_pizza";
    if (n.includes("salch") || n.includes("papa")) return "fastfood";
    if (n.includes("beb") || n.includes("jug") || n.includes("drink") || n.includes("trago") || n.includes("licor")) return "local_drink";
    if (n.includes("post") || n.includes("dul") || n.includes("hel") || n.includes("cake")) return "icecream";
    return "restaurant";
  };

  // Cargar categorías y productos de la base de datos
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const [resCat, resProd] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);

        if (resCat.ok && resProd.ok) {
          const cats: DbCategory[] = await resCat.json();
          const prods: DbProduct[] = await resProd.json();

          setCategories(cats);
          if (cats.length > 0) {
            setActiveCategoryId(cats[0].id);
          }

          // Mapear productos al formato que espera el frontend y filtrar los disponibles
          const mappedProds: Product[] = prods
            .filter((p) => p.is_available)
            .map((p) => ({
              id: p.id,
              name: p.name,
              price: formatPrice(Number(p.price)),
              rawPrice: Number(p.price),
              description: p.description,
              img: p.image_url || "/placeholder-food.svg",
              imgAlt: p.name,
              category_id: p.category_id,
              model_3d_url: p.model_3d_url,
            }));

          setDbProducts(mappedProds);

          // Cargar carrito desde localStorage relacionando con los productos reales
          try {
            const stored = localStorage.getItem("ala2_cart");
            if (stored) {
              const rawItems = JSON.parse(stored) as any[];
              const parsedCart: CartItem[] = rawItems
                .map((item) => {
                  const id = item.productId || item.product?.id;
                  const foundProduct = mappedProds.find((p) => p.id === id);
                  if (!foundProduct) return null;
                  return {
                    product: foundProduct,
                    quantity: item.quantity || 1,
                    notes: item.notes || "",
                  };
                })
                .filter((item): item is CartItem => item !== null);
              setCart(parsedCart);
            }
          } catch (e) {
            console.error("Error reading cart", e);
          }
        }
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    loadMenuData();
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
    const storageItems = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      notes: item.notes,
    }));
    localStorage.setItem("ala2_cart", JSON.stringify(storageItems));
  }, [cart, mounted]);

  function openModal(product: Product) {
    setSelectedProduct(product);
    const existing = cart.find((i) => i.product.id === product.id);
    setQuantity(existing ? existing.quantity : 1);
    setNotes(existing ? existing.notes : "");
  }

  function addToCart() {
    if (!selectedProduct) return;
    setCart((prev) => {
      const existing = prev.findIndex((i) => i.product.id === selectedProduct.id);
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
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === productId);
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

  // Filtrado de productos por búsqueda
  const isSearchingActive = searchQuery.trim() !== "";
  const filteredProducts = isSearchingActive
    ? dbProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const products = isSearchingActive
    ? filteredProducts
    : dbProducts.filter((p) => p.category_id === activeCategoryId);

  const activeCategoryName = categories.find((c) => c.id === activeCategoryId)?.name || "Menú";
  const sectionTitle = isSearchingActive
    ? `Resultados para "${searchQuery}"`
    : activeCategoryName;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center gap-md">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span className="font-body-md text-on-surface-variant">Cargando menú...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 px-md h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.2)] flex items-center overflow-hidden">
        {/* Standard Header Layout */}
        <div
          className={`flex items-center justify-between w-full h-full transition-all duration-300 ${
            isSearchOpen ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0 pointer-events-auto"
          }`}
        >
          <Link
            href="/"
            className="text-primary hover:text-primary transition-colors opacity-80 duration-200 p-sm rounded-full hover:bg-white/5"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_back
            </span>
          </Link>
          <h1 className="font-h2 text-h2 uppercase tracking-tighter text-primary">A LA 2 RESTO-BAR</h1>
          <div className="flex items-center gap-xs">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 cursor-pointer flex items-center justify-center"
              aria-label="Abrir búsqueda"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                search
              </span>
            </button>
            <Link
              href="/resumen"
              className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 relative"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(230,57,70,0.8)] border border-background">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <div
          className={`absolute inset-0 px-md h-full flex items-center justify-between gap-md bg-surface/95 backdrop-blur-xl transition-all duration-300 ease-out ${
            isSearchOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-4 pointer-events-none"
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
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant select-none">
              search
            </span>
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

          <Link
            href="/resumen"
            className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-white/5 relative shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(230,57,70,0.8)] border border-background">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-20 px-gutter max-w-7xl mx-auto w-full pb-24">
        {/* Category Horizontal Scroll */}
        {!isSearchingActive && categories.length > 0 && (
          <div className="overflow-x-auto pt-sm pb-sm mb-xl hide-scrollbar flex space-x-md -mx-gutter px-gutter md:mx-0 md:px-0">
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className="flex flex-col items-center min-w-[80px] group flex-shrink-0 cursor-pointer"
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
                      {getCategoryIcon(cat.name)}
                    </span>
                  </div>
                  <span
                    className={`font-label-caps text-label-caps ${
                      isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                    }`}
                  >
                    {cat.name}
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
                <div
                  key={product.id}
                  className="bg-surface-container-high/80 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col relative group"
                >
                  {/* Image */}
                  <div className="h-48 w-full relative overflow-hidden bg-surface-dim cursor-pointer" onClick={() => openModal(product)}>
                    <img
                      alt={product.imgAlt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={product.img}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop";
                      }}
                    />
                    {/* 3D Button */}
                    {product.model_3d_url && (
                      <Link
                        href={`/producto/3d?model=${encodeURIComponent(product.model_3d_url)}&name=${encodeURIComponent(
                          product.name
                        )}&price=${encodeURIComponent(product.price)}&desc=${encodeURIComponent(product.description)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-sm right-sm bg-surface/90 backdrop-blur-md p-sm rounded-full border border-white/20 text-on-surface hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(230,57,70,0.4)] transition-all flex items-center justify-center group/3d z-10"
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          view_in_ar
                        </span>
                        <span className="max-w-0 overflow-hidden group-hover/3d:max-w-xs transition-all duration-300 font-label-caps text-label-caps whitespace-nowrap px-xs">
                          Ver en 3D
                        </span>
                      </Link>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-high/80 to-transparent"></div>
                  </div>
                  
                  {/* Info */}
                  <div
                    className="p-md flex flex-col flex-grow cursor-pointer transition-colors hover:bg-white/5"
                    onClick={() => openModal(product)}
                  >
                    <div className="flex justify-between items-start mb-sm">
                      <h3 className="font-h3 text-h3 text-on-surface leading-tight font-semibold">{product.name}</h3>
                      <span className="font-h3 text-h3 text-primary whitespace-nowrap ml-2 font-bold">{product.price}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-grow line-clamp-2">
                      {product.description || "Sin descripción disponible."}
                    </p>
                    {quantityInCart > 0 ? (
                      <div className="w-full relative">
                        <div className="w-full flex items-center h-12 bg-emerald-700 text-white rounded-xl border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.5)] overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCartQuantity(product.id, -1);
                            }}
                            className="w-12 h-full flex items-center justify-center hover:bg-emerald-600/50 active:bg-emerald-800 transition-colors border-r border-emerald-400/20 cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <span className="material-symbols-outlined text-[20px] font-bold">remove</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(product);
                            }}
                            className="flex-grow h-full flex items-center justify-center gap-sm hover:bg-emerald-600/40 transition-colors font-label-caps text-[16px] font-bold tracking-wider cursor-pointer select-none"
                          >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              shopping_bag
                            </span>
                            AGREGADO • {formatPrice(product.rawPrice * quantityInCart)}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCartQuantity(product.id, 1);
                            }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(product);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-label-caps text-[16px] font-bold tracking-wider py-md rounded-xl flex items-center justify-center gap-sm transition-all hover:scale-[1.02] active:scale-95 border border-emerald-500/20 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          shopping_bag
                        </span>
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
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-md select-none">
              search_off
            </span>
            <h3 className="font-h3 text-h3 text-on-surface mb-xs">No se encontraron productos</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              No hallamos ningún platillo o bebida en esta sección.
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
            className="relative bg-surface-container border border-white/10 rounded-2xl w-full md:max-w-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] md:max-h-[600px] overflow-hidden animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 hover:scale-105 transition-all z-50 border border-white/10 shadow-lg flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Scrollable Container covering the entire modal content */}
            <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col md:flex-row rounded-2xl">
              {/* Product Image */}
              <div className="relative w-full h-[240px] md:h-auto md:w-1/2 shrink-0 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.imgAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col w-full md:w-1/2 p-5 md:p-8 md:min-h-[480px]">
                <div className="flex justify-between items-start mb-3 pr-8">
                  <h2 className="font-h2 text-[20px] md:text-h2 text-on-surface leading-tight font-semibold">
                    {selectedProduct.name}
                  </h2>
                  <span className="font-h2 text-[20px] md:text-h2 text-primary whitespace-nowrap ml-3 font-bold">
                    {selectedProduct.price}
                  </span>
                </div>
                <p className="text-[14px] md:text-body-lg text-on-surface-variant leading-relaxed mb-4">
                  {selectedProduct.description || "Sin descripción disponible."}
                </p>

                {/* Observaciones */}
                <div className="mb-4">
                  <label
                    htmlFor="product-observations"
                    className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>
                      edit_note
                    </span>
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

                {/* Quantity Controller & Add Button */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-md">
                  <div className="flex items-center bg-surface-dim border border-white/10 rounded-xl overflow-hidden h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-12 h-full flex items-center justify-center hover:bg-white/5 active:bg-white/10 text-on-surface transition-colors cursor-pointer"
                      aria-label="Restar uno"
                    >
                      <span className="material-symbols-outlined text-[18px] font-bold">remove</span>
                    </button>
                    <span className="font-h3 text-h3 text-on-surface min-w-[32px] text-center select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-12 h-full flex items-center justify-center hover:bg-white/5 active:bg-white/10 text-on-surface transition-colors cursor-pointer"
                      aria-label="Sumar uno"
                    >
                      <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                    </button>
                  </div>

                  <button
                    onClick={addToCart}
                    className="flex-grow h-12 bg-primary text-white font-label-caps text-[14px] font-bold tracking-wider rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.3)] hover:shadow-[0_0_20px_rgba(230,57,70,0.5)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      shopping_bag
                    </span>
                    AGREGAR • {formatPrice(selectedProduct.rawPrice * quantity)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
