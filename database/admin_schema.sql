-- Tablas adicionales para el sistema administrativo de A La 2 Restobar

-- Alterar la tabla products para agregar soporte a archivos 3D
ALTER TABLE products ADD COLUMN IF NOT EXISTS model_3d_url TEXT;

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    order_type VARCHAR(20) NOT NULL, -- 'domicilio', 'recoger', 'mesa'
    table_number VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'preparando', 'listo', 'entregado', 'cancelado'
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de detalles de items del pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuraciones generales
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuraciones por defecto
INSERT INTO settings (key, value) VALUES
('restaurant_name', 'A La 2 Resto-Bar'),
('whatsapp_phone', '573001234567'),
('delivery_fee', '3500'),
('tables_count', '15'),
('restaurant_address', 'Calle Principal #12-34')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Asegurar usuario administrador por defecto
-- Contraseña en texto plano: admin123 (Hash SHA-256 hexadecimal: 2407891877f68c9b00708515c010b7a82767d4f40f12a3d0f73f98a2455e43c5)
INSERT INTO users (username, password_hash, role) VALUES
('admin', '2407891877f68c9b00708515c010b7a82767d4f40f12a3d0f73f98a2455e43c5', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Semillas iniciales para categorías si están vacías
INSERT INTO categories (id, name, description) VALUES
(1, 'Burgers', 'Hamburguesas premium artesanales'),
(2, 'Pizzas', 'Nuestras Pizzas de masa lenta'),
(3, 'Salchipapas', 'Salchipapas y papas loaded'),
(4, 'Bebidas', 'Bebidas refrescantes y licores'),
(5, 'Postres', 'Postres dulces artesanales')
ON CONFLICT (id) DO NOTHING;

-- Semillas iniciales para productos si están vacíos
INSERT INTO products (id, name, description, price, image_url, category_id, is_available) VALUES
(1, 'La A La 2 Clásica', 'Doble carne premium, queso cheddar fundido, tocino crujiente, lechuga fresca, tomate y nuestra salsa secreta de la casa en pan brioche artesanal.', 12500.00, '/api/media?key=products/burgers/classic.jpg', 1, true),
(2, 'Diablo Burger', 'Carne de res, queso pepper jack, jalapeños rostizados, cebolla caramelizada y aderezo de sriracha picante.', 14000.00, '/api/media?key=products/burgers/diablo.jpg', 1, true),
(3, 'La Alternativa', 'Medallón de proteína vegetal crujiente, aguacate fresco, espinaca baby y mayonesa vegana de ajo rostizado.', 13500.00, '/api/media?key=products/burgers/alternativa.jpg', 1, true),
(4, 'Pizza A La 2', 'Salsa de tomate artesanal, mozzarella premium, pepperoni importado y albahaca fresca sobre masa de fermentación lenta.', 16000.00, '/api/media?key=products/pizzas/pizza-a-la-2.jpg', 2, true),
(5, 'Pizza Cuatro Quesos', 'Mozzarella, parmesano, gorgonzola y queso de cabra sobre base de crema blanca y orégano fresco.', 17500.00, '/api/media?key=products/pizzas/cuatro-quesos.jpg', 2, true),
(6, 'Pizza BBQ Bacon', 'Salsa BBQ ahumada, pollo a la parrilla, tocino crujiente, cebolla morada y mozzarella derretida.', 18000.00, '/api/media?key=products/pizzas/bbq-bacon.jpg', 2, true),
(7, 'Salchipapa Clásica', 'Papas fritas crocantes con rodajas de salchicha, ketchup, mostaza y mayonesa de la casa.', 7000.00, '/api/media?key=products/salchipapas/clasica.jpg', 3, true),
(8, 'Salchipapa Especial', 'Papas crinkle, salchicha premium, queso cheddar fundido, tocineta y jalapeños encurtidos.', 9500.00, '/api/media?key=products/salchipapas/especial.jpg', 3, true),
(9, 'Papas Loaded', 'Papas gruesas horneadas, queso fundido, crema agria, cebollín y tiras de pollo BBQ.', 10000.00, '/api/media?key=products/salchipapas/loaded.jpg', 3, true),
(10, 'Limonada de Menta', 'Limón fresco exprimido, menta fresca, jarabe natural y agua con gas. Refrescante y sin azúcar añadida.', 4500.00, '/api/media?key=products/bebidas/limonada.jpg', 4, true),
(11, 'Michelada A La 2', 'Cerveza fría, jugo de tomate, limón, salsa inglesa, salsa picante y chamoy en el borde. La favorita de la casa.', 6000.00, '/api/media?key=products/bebidas/michelada.jpg', 4, true),
(12, 'Jugo Natural', 'Jugos naturales de temporada: mango, maracuyá, mora o naranja. Preparados al momento sin conservantes.', 3500.00, '/api/media?key=products/bebidas/jugo.jpg', 4, true),
(13, 'Brownie Caliente', 'Brownie de chocolate oscuro tibio servido con una bola de helado de vainilla y salsa de caramelo.', 5500.00, '/api/media?key=products/postres/brownie.jpg', 5, true),
(14, 'Helado Artesanal', 'Tres bolas de helado artesanal. Sabores disponibles: vainilla, chocolate, fresa, mango o maracuyá.', 4000.00, '/api/media?key=products/postres/helado.jpg', 5, true),
(15, 'Cheesecake de Frutos Rojos', 'Base de galleta, crema de queso suave y coulis de frutos rojos frescos. Sin gluten disponible.', 6500.00, '/api/media?key=products/postres/cheesecake.jpg', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Ajustar secuencias de ID
SELECT setval(pg_get_serial_sequence('categories', 'id'), coalesce(max(id), 1)) FROM categories;
SELECT setval(pg_get_serial_sequence('products', 'id'), coalesce(max(id), 1)) FROM products;
