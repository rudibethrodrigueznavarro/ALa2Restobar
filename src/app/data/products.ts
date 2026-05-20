/* ─── Types ─────────────────────────────────────────────────── */
export type Badge = { label: string; className: string };

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  img: string;
  imgAlt: string;
  badge?: Badge;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

export interface CartStorageItem {
  productId: number;
  quantity: number;
  notes: string;
}

export function deserializeCart(storedJson: string | null): CartItem[] {
  if (!storedJson) return [];
  try {
    const rawItems = JSON.parse(storedJson) as any[];
    const allProducts = Object.values(PRODUCTS).flat();
    return rawItems
      .map(item => {
        const id = item.productId || item.product?.id;
        const foundProduct = allProducts.find(p => p.id === id);
        if (!foundProduct) return null;
        return {
          product: foundProduct,
          quantity: item.quantity || 1,
          notes: item.notes || ""
        };
      })
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export function serializeCart(cart: CartItem[]): string {
  const storageItems: CartStorageItem[] = cart.map(item => ({
    productId: item.product.id,
    quantity: item.quantity,
    notes: item.notes
  }));
  return JSON.stringify(storageItems);
}

/* ─── Category definitions ───────────────────────────────────── */
export const CATEGORIES = [
  { id: "burgers",     label: "Burgers",     icon: "lunch_dining" },
  { id: "pizzas",      label: "Pizzas",      icon: "local_pizza"  },
  { id: "salchipapas", label: "Salchipapas", icon: "fastfood"     },
  { id: "bebidas",     label: "Bebidas",     icon: "local_drink"  },
  { id: "postres",     label: "Postres",     icon: "icecream"     },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/* ─── Mock product data ──────────────────────────────────────── */
export const PRODUCTS: Record<CategoryId, Product[]> = {
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

export const SECTION_TITLES: Record<CategoryId, string> = {
  burgers:     "Burgers Destacadas",
  pizzas:      "Nuestras Pizzas",
  salchipapas: "Salchipapas",
  bebidas:     "Bebidas",
  postres:     "Postres",
};

/* ─── Shared Helpers ─────────────────────────────────────────── */
export function parsePrice(priceStr: string): number {
  const clean = priceStr.replace(/[^0-9]/g, "");
  return parseInt(clean, 10) || 0;
}

export function formatPrice(value: number): string {
  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
