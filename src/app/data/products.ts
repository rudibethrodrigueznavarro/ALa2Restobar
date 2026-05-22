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
  { id: "entradas",          label: "Entradas",          icon: "restaurant" },
  { id: "burgers",           label: "Hamburguesas",      icon: "lunch_dining" },
  { id: "patacones",         label: "Patacones",         icon: "restaurant" },
  { id: "salchipapas",       label: "Salchipapas",       icon: "fastfood" },
  { id: "asados",            label: "Asados",            icon: "restaurant" },
  { id: "burritos",          label: "Burritos",          icon: "restaurant" },
  { id: "perros",            label: "Perros",            icon: "restaurant" },
  { id: "desgranados",       label: "Desgranados",       icon: "restaurant" },
  { id: "alitas",            label: "Alitas BBQ",        icon: "restaurant" },
  { id: "bebidas",           label: "Bebidas",           icon: "local_drink" },
  { id: "micheladas",        label: "Micheladas",        icon: "local_bar" },
  { id: "sodas_saborizadas", label: "Sodas",             icon: "local_drink" },
  { id: "cervezas",          label: "Cervezas",          icon: "sports_bar" },
  { id: "adicionales",       label: "Adicionales",       icon: "add_circle" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/* ─── Mock product data ──────────────────────────────────────── */
export const PRODUCTS: Record<CategoryId, Product[]> = {
  entradas: [
    {
      id: 1,
      name: "Croquetas de yuca con suero y queso costeño",
      price: "$10.000",
      description: "Croquetas crujientes de yuca acompañadas con suero costeño artesanal y queso costeño rallado.",
      img: "/api/media?key=products/entradas/croquetas_yuca.jpg",
      imgAlt: "Croquetas de yuca con suero y queso costeño"
    }
  ],
  burgers: [
    {
      id: 2,
      name: "Hamburguesa tradicional",
      price: "$15.000",
      description: "Pan, carne de res 150g, jamón, queso mozarella, vegetales, cebolla caramelizada y papa francesa.",
      img: "/api/media?key=products/hamburguesas/tradicional.jpg",
      imgAlt: "Hamburguesa tradicional"
    },
    {
      id: 3,
      name: "Hamburguesa smash",
      price: "$15.000",
      description: "Pan, doble carne de res 70g, tocineta, queso cheddar, vegetales y papa francesa.",
      img: "/api/media?key=products/hamburguesas/smash.jpg",
      imgAlt: "Hamburguesa smash"
    },
    {
      id: 4,
      name: "Hamburguesa doble carne",
      price: "$22.000",
      description: "Pan, doble carne de res 150g, tocineta, queso mozarella, queso cheddar, cebolla caramelizada y papa francesa.",
      img: "/api/media?key=products/hamburguesas/doble_carne.jpg",
      imgAlt: "Hamburguesa doble carne"
    },
    {
      id: 5,
      name: "Hamburguesa de la casa",
      price: "$20.000",
      description: "Pan, carne de res 150g, pollo, tocineta, queso mozarella, cebolla caramelizada, vegetales y papa francesa.",
      img: "/api/media?key=products/hamburguesas/de_la_casa.jpg",
      imgAlt: "Hamburguesa de la casa"
    },
    {
      id: 6,
      name: "Hamburguesa hawaiana",
      price: "$18.000",
      description: "Pan, carne de res 150g, jamón, queso asado, cebolla caramelizada, vegetales y papa francesa.",
      img: "/api/media?key=products/hamburguesas/hawaiana.jpg",
      imgAlt: "Hamburguesa hawaiana"
    }
  ],
  patacones: [
    {
      id: 7,
      name: "Patacon sencillo",
      price: "$12.000",
      description: "Patacón crujiente de plátano verde grande con ajo, sal y mantequilla.",
      img: "/api/media?key=products/patacones/sencillo.jpg",
      imgAlt: "Patacon sencillo"
    },
    {
      id: 8,
      name: "Patacón especial",
      price: "$18.000",
      description: "Patacón de plátano verde crujiente cubierto con carne desmechada, pollo, queso rallado y salsas de la casa.",
      img: "/api/media?key=products/patacones/especial.jpg",
      imgAlt: "Patacón especial"
    }
  ],
  salchipapas: [
    {
      id: 9,
      name: "Salchipapa tradicional",
      price: "$12.000",
      description: "Papa francesa, salchicha, lechuga, queso costeño y salsas de la casa.",
      img: "/api/media?key=products/salchipapas/tradicional.jpg",
      imgAlt: "Salchipapa tradicional"
    },
    {
      id: 10,
      name: "Salchipapa especial",
      price: "$18.000",
      description: "Papa francesa, salchicha, butifarra, chorizo, carnes, tocineta, maíz, queso costeño, lechuga y salsas de la casa.",
      img: "/api/media?key=products/salchipapas/especial.jpg",
      imgAlt: "Salchipapa especial"
    },
    {
      id: 11,
      name: "Salchipapa ranchera",
      price: "$17.000",
      description: "Papa francesa, salchicha ranchera, tocineta, queso fundido, maíz, lechuga y salsas de la casa.",
      img: "/api/media?key=products/salchipapas/ranchera.jpg",
      imgAlt: "Salchipapa ranchera"
    },
    {
      id: 12,
      name: "Salvajada para 2",
      price: "$32.000",
      description: "Papa francesa, salchicha, chorizo, tocineta, carnes de res, pollo y cerdo, queso costeño, lechuga y maíz.",
      img: "/api/media?key=products/salchipapas/salvajada_para_2.jpg",
      imgAlt: "Salvajada para 2"
    }
  ],
  asados: [
    {
      id: 13,
      name: "Punta de anca",
      price: "$22.000",
      description: "Corte premium de punta de anca de res a la parrilla, acompañada con papas fritas y ensalada fresca.",
      img: "/api/media?key=products/asados/punta_anca.jpg",
      imgAlt: "Punta de anca"
    },
    {
      id: 14,
      name: "Pechuga asada",
      price: "$18.000",
      description: "Filete de pechuga de pollo a la plancha, sazonado al gusto y acompañado con papas fritas.",
      img: "/api/media?key=products/asados/pechuga_asada.jpg",
      imgAlt: "Pechuga asada"
    },
    {
      id: 15,
      name: "Pechuga gratinada",
      price: "$20.000",
      description: "Pechuga de pollo jugosa a la plancha gratinada con abundante queso mozzarella, servida con papas.",
      img: "/api/media?key=products/asados/pechuga_gratinada.jpg",
      imgAlt: "Pechuga gratinada"
    },
    {
      id: 16,
      name: "Cerdo a la plancha",
      price: "$18.000",
      description: "Lomo de cerdo jugoso asado a la plancha con condimentos del chef, servido con papas.",
      img: "/api/media?key=products/asados/cerdo_plancha.jpg",
      imgAlt: "Cerdo a la plancha"
    },
    {
      id: 17,
      name: "Cerdo gratinado",
      price: "$20.000",
      description: "Lomo de cerdo asado a la plancha y gratinado con queso mozzarella fundido, servido con papas.",
      img: "/api/media?key=products/asados/cerdo_gratinado.jpg",
      imgAlt: "Cerdo gratinado"
    }
  ],
  burritos: [
    {
      id: 18,
      name: "Burrito especial",
      price: "$15.000",
      description: "Tortilla de trigo gigante, carne desmechada, pechuga, jamón, quesillo y salsa de la casa, acompañado con papa francesa.",
      img: "/api/media?key=products/burrito/especial.jpg",
      imgAlt: "Burrito especial"
    }
  ],
  perros: [
    {
      id: 19,
      name: "Perro tradicional",
      price: "$10.000",
      description: "Pan suave, salchicha, papa ripio crujiente, queso mozzarella fundido, vegetales y salsa de la casa, acompañado con papa francesa.",
      img: "/api/media?key=products/perros/tradicional.jpg",
      imgAlt: "Perro tradicional"
    },
    {
      id: 20,
      name: "Perro hawaiano",
      price: "$15.000",
      description: "Pan suave, salchicha, papa ripio, queso mozzarella, queso costeño rallado, dulce piña y salsa de la casa, con papas francesas.",
      img: "/api/media?key=products/perros/hawaiano.jpg",
      imgAlt: "Perro hawaiano"
    }
  ],
  desgranados: [
    {
      id: 21,
      name: "Desgranado",
      price: "$20.000",
      description: "Maíz tierno desgranado con carnes mixtas (pollo, res, tocineta), queso costeño rallado, papa ripio y salsas.",
      img: "/api/media?key=products/desgranado/desgranado.jpg",
      imgAlt: "Desgranado"
    }
  ],
  alitas: [
    {
      id: 22,
      name: "Alitas BBQ",
      price: "$14.000",
      description: "Porción de alitas de pollo crocantes bañadas en una salsa BBQ tradicional especial de la casa.",
      img: "/api/media?key=products/alitas/alitas_bbq.jpg",
      imgAlt: "Alitas BBQ"
    }
  ],
  bebidas: [
    {
      id: 23,
      name: "Coca-cola 1.5 L",
      price: "$6.500",
      description: "Gaseosa Coca-Cola tamaño familiar de 1.5 Litros.",
      img: "/api/media?key=products/bebidas/cocacola_15l.jpg",
      imgAlt: "Coca-cola 1.5 L"
    },
    {
      id: 24,
      name: "Postobon 2.5 L",
      price: "$6.000",
      description: "Gaseosa Postobón de 2.5 Litros (sabores variados según disponibilidad).",
      img: "/api/media?key=products/bebidas/postobon_25l.jpg",
      imgAlt: "Postobon 2.5 L"
    },
    {
      id: 25,
      name: "Coca-cola 400 ml",
      price: "$3.500",
      description: "Gaseosa Coca-Cola personal de 400 ml.",
      img: "/api/media?key=products/bebidas/cocacola_400ml.jpg",
      imgAlt: "Coca-cola 400 ml"
    },
    {
      id: 26,
      name: "Jugo hit 500 ml",
      price: "$3.500",
      description: "Jugo Hit de 500 ml en botella (mango, lulo o mora).",
      img: "/api/media?key=products/bebidas/jugo_hit_500ml.jpg",
      imgAlt: "Jugo hit 500 ml"
    },
    {
      id: 27,
      name: "Agua brisa",
      price: "$2.000",
      description: "Botella de agua mineral Brisa de 500 ml (con o sin gas).",
      img: "/api/media?key=products/bebidas/agua_brisa.jpg",
      imgAlt: "Agua brisa"
    },
    {
      id: 28,
      name: "Soda",
      price: "$3.000",
      description: "Bebida gaseosa sin sabor tipo Soda / Agua con gas.",
      img: "/api/media?key=products/bebidas/soda.jpg",
      imgAlt: "Soda"
    }
  ],
  micheladas: [
    {
      id: 29,
      name: "Michelada frutal",
      price: "$10.000",
      description: "Bebida refrescante michelada saborizada con extracto y trozos de frutas frescas.",
      img: "/api/media?key=products/micheladas/frutal.jpg",
      imgAlt: "Michelada frutal"
    },
    {
      id: 30,
      name: "Michelada de maracuyá",
      price: "$8.000",
      description: "Bebida refrescante michelada con pulpa y semillas de maracuyá fresco, limón y sal.",
      img: "/api/media?key=products/micheladas/maracuya.jpg",
      imgAlt: "Michelada de maracuyá"
    }
  ],
  sodas_saborizadas: [
    {
      id: 31,
      name: "Limón",
      price: "$7.000",
      description: "Soda burbujeante saborizada con jarabe concentrado de limón natural.",
      img: "/api/media?key=products/sodas_saborizadas/limon.jpg",
      imgAlt: "Limón"
    },
    {
      id: 32,
      name: "Maracuyá",
      price: "$7.000",
      description: "Soda burbujeante saborizada con concentrado natural de maracuyá.",
      img: "/api/media?key=products/sodas_saborizadas/maracuya.jpg",
      imgAlt: "Maracuyá"
    },
    {
      id: 33,
      name: "Cereza",
      price: "$7.000",
      description: "Soda burbujeante saborizada con almíbar artesanal de cereza y decoración.",
      img: "/api/media?key=products/sodas_saborizadas/cereza.jpg",
      imgAlt: "Cereza"
    }
  ],
  cervezas: [
    {
      id: 34,
      name: "Aguila original",
      price: "$4.000",
      description: "Cerveza nacional Club Colombia / Águila en botella de vidrio de 330 ml.",
      img: "/api/media?key=products/cervezas/aguila.jpg",
      imgAlt: "Aguila original"
    },
    {
      id: 35,
      name: "Heineken",
      price: "$4.000",
      description: "Cerveza Heineken premium de importación fría en botella.",
      img: "/api/media?key=products/cervezas/heineken.jpg",
      imgAlt: "Heineken"
    },
    {
      id: 36,
      name: "Póker",
      price: "$3.500",
      description: "Cerveza nacional Póker en presentación botella de vidrio fría.",
      img: "/api/media?key=products/cervezas/poker.jpg",
      imgAlt: "Póker"
    },
    {
      id: 37,
      name: "Coronita",
      price: "$4.000",
      description: "Cerveza Corona de presentación pequeña (Coronita) fría.",
      img: "/api/media?key=products/cervezas/coronita.jpg",
      imgAlt: "Coronita"
    }
  ],
  adicionales: [
    {
      id: 38,
      name: "Porción de papa",
      price: "$4.000",
      description: "Porción extra de papas francesas fritas sazonadas.",
      img: "/api/media?key=products/adicionales/papas.jpg",
      imgAlt: "Porción de papa"
    },
    {
      id: 39,
      name: "Tocineta",
      price: "$2.000",
      description: "Adición de tiras de tocineta ahumada crujientes.",
      img: "/api/media?key=products/adicionales/tocineta.jpg",
      imgAlt: "Tocineta"
    },
    {
      id: 40,
      name: "Maíz",
      price: "$1.500",
      description: "Adición de granos de maíz tierno salteados.",
      img: "/api/media?key=products/adicionales/maiz.jpg",
      imgAlt: "Maíz"
    }
  ]
};

export const SECTION_TITLES: Record<CategoryId, string> = {
  entradas:          "Entradas",
  burgers:           "Hamburguesas",
  patacones:         "Patacones",
  salchipapas:       "Salchipapas",
  asados:            "Asados",
  burritos:          "Burritos",
  perros:            "Perros",
  desgranados:       "Desgranados",
  alitas:            "Alitas BBQ",
  bebidas:           "Bebidas",
  micheladas:        "Micheladas",
  sodas_saborizadas: "Sodas Saborizadas",
  cervezas:          "Cervezas",
  adicionales:       "Adicionales",
};

/* ─── Shared Helpers ─────────────────────────────────────────── */
export function parsePrice(priceStr: string): number {
  const clean = priceStr.replace(/[^0-9]/g, "");
  return parseInt(clean, 10) || 0;
}

export function formatPrice(value: number): string {
  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
