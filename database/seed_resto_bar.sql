-- Semillas para inicializar el menú de A La 2 Resto-Bar
-- Basado en las imágenes del menú físico del local

-- Limpiar datos previos de productos y categorías para evitar duplicaciones
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- Inicializar Categorías del Menú
INSERT INTO categories (id, name, description, display_order) VALUES
(1, 'Entradas', 'Entradas deliciosas para empezar tu comida', 1),
(2, 'Hamburguesas', 'Hamburguesas premium artesanales acompañadas de papa francesa', 2),
(3, 'Patacones', 'Patacones de plátano verde crujientes con exquisitos toppings', 3),
(4, 'Salchipapas', 'Las mejores salchipapas de la casa con ingredientes cargados', 4),
(5, 'Asados', 'Cortes seleccionados asados a la plancha o parrilla', 5),
(6, 'Burritos', 'Burritos envueltos en tortilla gigante rellenos de sabor', 6),
(7, 'Perros', 'Perros calientes con combinaciones especiales y aderezos', 7),
(8, 'Desgranados', 'Maíz tierno desgranado con carnes, queso y salsas', 8),
(9, 'Alitas BBQ', 'Alitas de pollo crujientes bañadas en salsa barbacoa artesanal', 9),
(10, 'Bebidas', 'Bebidas frías y refrescantes para calmar la sed', 10),
(11, 'Micheladas', 'Micheladas refrescantes escarchadas con limón y sal o frutas', 11),
(12, 'Sodas Saborizadas', 'Sodas burbujeantes saborizadas con frutas naturales', 12),
(13, 'Cervezas', 'Cervezas nacionales e internacionales servidas bien frías', 13),
(14, 'Adicionales', 'Porciones y complementos extras para armar tu plato ideal', 14)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- Inicializar Productos del Menú
INSERT INTO products (id, name, description, price, image_url, category_id, is_available) VALUES
-- 1. Entradas
(1, 'Croquetas de yuca con suero y queso costeño', 'Croquetas crujientes de yuca acompañadas con suero costeño artesanal y queso costeño rallado.', 10000.00, '/api/media?key=products/entradas/croquetas_yuca.jpg', 1, true),

-- 2. Hamburguesas
(2, 'Hamburguesa tradicional', 'Pan, carne de res 150g, jamón, queso mozarella, vegetales, cebolla caramelizada y papa francesa.', 15000.00, '/api/media?key=products/hamburguesas/tradicional.jpg', 2, true),
(3, 'Hamburguesa smash', 'Pan, doble carne de res 70g, tocineta, queso cheddar, vegetales y papa francesa.', 15000.00, '/api/media?key=products/hamburguesas/smash.jpg', 2, true),
(4, 'Hamburguesa doble carne', 'Pan, doble carne de res 150g, tocineta, queso mozarella, queso cheddar, cebolla caramelizada y papa francesa.', 22000.00, '/api/media?key=products/hamburguesas/doble_carne.jpg', 2, true),
(5, 'Hamburguesa de la casa', 'Pan, carne de res 150g, pollo, tocineta, queso mozarella, cebolla caramelizada, vegetales y papa francesa.', 20000.00, '/api/media?key=products/hamburguesas/de_la_casa.jpg', 2, true),
(6, 'Hamburguesa hawaiana', 'Pan, carne de res 150g, jamón, queso asado, cebolla caramelizada, vegetales y papa francesa.', 18000.00, '/api/media?key=products/hamburguesas/hawaiana.jpg', 2, true),

-- 3. Patacones
(7, 'Patacon sencillo', 'Patacón crujiente de plátano verde grande con ajo, sal y mantequilla.', 12000.00, '/api/media?key=products/patacones/sencillo.jpg', 3, true),
(8, 'Patacón especial', 'Patacón de plátano verde crujiente cubierto con carne desmechada, pollo, queso rallado y salsas de la casa.', 18000.00, '/api/media?key=products/patacones/especial.jpg', 3, true),

-- 4. Salchipapas
(9, 'Salchipapa tradicional', 'Papa francesa, salchicha, lechuga, queso costeño y salsas de la casa.', 12000.00, '/api/media?key=products/salchipapas/tradicional.jpg', 4, true),
(10, 'Salchipapa especial', 'Papa francesa, salchicha, butifarra, chorizo, carnes, tocineta, maíz, queso costeño, lechuga y salsas de la casa.', 18000.00, '/api/media?key=products/salchipapas/especial.jpg', 4, true),
(11, 'Salchipapa ranchera', 'Papa francesa, salchicha ranchera, tocineta, queso fundido, maíz, lechuga y salsas de la casa.', 17000.00, '/api/media?key=products/salchipapas/ranchera.jpg', 4, true),
(12, 'Salvajada para 2', 'Papa francesa, salchicha, chorizo, tocineta, carnes de res, pollo y cerdo, queso costeño, lechuga y maíz.', 32000.00, '/api/media?key=products/salchipapas/salvajada_para_2.jpg', 4, true),

-- 5. Asados
(13, 'Punta de anca', 'Corte premium de punta de anca de res a la parrilla, acompañada con papas fritas y ensalada fresca.', 22000.00, '/api/media?key=products/asados/punta_anca.jpg', 5, true),
(14, 'Pechuga asada', 'Filete de pechuga de pollo a la plancha, sazonado al gusto y acompañado con papas fritas.', 18000.00, '/api/media?key=products/asados/pechuga_asada.jpg', 5, true),
(15, 'Pechuga gratinada', 'Pechuga de pollo jugosa a la plancha gratinada con abundante queso mozzarella, servida con papas.', 20000.00, '/api/media?key=products/asados/pechuga_gratinada.jpg', 5, true),
(16, 'Cerdo a la plancha', 'Lomo de cerdo jugoso asado a la plancha con condimentos del chef, servido con papas.', 18000.00, '/api/media?key=products/asados/cerdo_plancha.jpg', 5, true),
(17, 'Cerdo gratinado', 'Lomo de cerdo asado a la plancha y gratinado con queso mozzarella fundido, servido con papas.', 20000.00, '/api/media?key=products/asados/cerdo_gratinado.jpg', 5, true),

-- 6. Burritos
(18, 'Burrito especial', 'Tortilla de trigo gigante, carne desmechada, pechuga, jamón, quesillo y salsa de la casa, acompañado con papa francesa.', 15000.00, '/api/media?key=products/burrito/especial.jpg', 6, true),

-- 7. Perros
(19, 'Perro tradicional', 'Pan suave, salchicha, papa ripio crujiente, queso mozzarella fundido, vegetales y salsa de la casa, acompañado con papa francesa.', 10000.00, '/api/media?key=products/perros/tradicional.jpg', 7, true),
(20, 'Perro hawaiano', 'Pan suave, salchicha, papa ripio, queso mozzarella, queso costeño rallado, dulce piña y salsa de la casa, con papas francesas.', 15000.00, '/api/media?key=products/perros/hawaiano.jpg', 7, true),

-- 8. Desgranados
(21, 'Desgranado', 'Maíz tierno desgranado con carnes mixtas (pollo, res, tocineta), queso costeño rallado, papa ripio y salsas.', 20000.00, '/api/media?key=products/desgranado/desgranado.jpg', 8, true),

-- 9. Alitas BBQ
(22, 'Alitas BBQ', 'Porción de alitas de pollo crocantes bañadas en una salsa BBQ tradicional especial de la casa.', 14000.00, '/api/media?key=products/alitas/alitas_bbq.jpg', 9, true),

-- 10. Bebidas
(23, 'Coca-cola 1.5 L', 'Gaseosa Coca-Cola tamaño familiar de 1.5 Litros.', 6500.00, '/api/media?key=products/bebidas/cocacola_15l.jpg', 10, true),
(24, 'Postobon 2.5 L', 'Gaseosa Postobón de 2.5 Litros (sabores variados según disponibilidad).', 6000.00, '/api/media?key=products/bebidas/postobon_25l.jpg', 10, true),
(25, 'Coca-cola 400 ml', 'Gaseosa Coca-Cola personal de 400 ml.', 3500.00, '/api/media?key=products/bebidas/cocacola_400ml.jpg', 10, true),
(26, 'Jugo hit 500 ml', 'Jugo Hit de 500 ml en botella (mango, lulo o mora).', 3500.00, '/api/media?key=products/bebidas/jugo_hit_500ml.jpg', 10, true),
(27, 'Agua brisa', 'Botella de agua mineral Brisa de 500 ml (con o sin gas).', 2000.00, '/api/media?key=products/bebidas/agua_brisa.jpg', 10, true),
(28, 'Soda', 'Bebida gaseosa sin sabor tipo Soda / Agua con gas.', 3000.00, '/api/media?key=products/bebidas/soda.jpg', 10, true),

-- 11. Micheladas
(29, 'Michelada frutal', 'Bebida refrescante michelada saborizada con extracto y trozos de frutas frescas.', 10000.00, '/api/media?key=products/micheladas/frutal.jpg', 11, true),
(30, 'Michelada de maracuyá', 'Bebida refrescante michelada con pulpa y semillas de maracuyá fresco, limón y sal.', 8000.00, '/api/media?key=products/micheladas/maracuya.jpg', 11, true),

-- 12. Sodas Saborizadas
(31, 'Limón', 'Soda burbujeante saborizada con jarabe concentrado de limón natural.', 7000.00, '/api/media?key=products/sodas_saborizadas/limon.jpg', 12, true),
(32, 'Maracuyá', 'Soda burbujeante saborizada con concentrado natural de maracuyá.', 7000.00, '/api/media?key=products/sodas_saborizadas/maracuya.jpg', 12, true),
(33, 'Cereza', 'Soda burbujeante saborizada con almíbar artesanal de cereza y decoración.', 7000.00, '/api/media?key=products/sodas_saborizadas/cereza.jpg', 12, true),

-- 13. Cervezas
(34, 'Aguila original', 'Cerveza nacional Club Colombia / Águila en botella de vidrio de 330 ml.', 4000.00, '/api/media?key=products/cervezas/aguila.jpg', 13, true),
(35, 'Heineken', 'Cerveza Heineken premium de importación fría en botella.', 4000.00, '/api/media?key=products/cervezas/heineken.jpg', 13, true),
(36, 'Póker', 'Cerveza nacional Póker en presentación botella de vidrio fría.', 3500.00, '/api/media?key=products/cervezas/poker.jpg', 13, true),
(37, 'Coronita', 'Cerveza Corona de presentación pequeña (Coronita) fría.', 4000.00, '/api/media?key=products/cervezas/coronita.jpg', 13, true),

-- 14. Adicionales
(38, 'Porción de papa', 'Porción extra de papas francesas fritas sazonadas.', 4000.00, '/api/media?key=products/adicionales/papas.jpg', 14, true),
(39, 'Tocineta', 'Adición de tiras de tocineta ahumada crujientes.', 2000.00, '/api/media?key=products/adicionales/tocineta.jpg', 14, true),
(40, 'Maíz', 'Adición de granos de maíz tierno salteados.', 1500.00, '/api/media?key=products/adicionales/maiz.jpg', 14, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    category_id = EXCLUDED.category_id,
    is_available = EXCLUDED.is_available;

-- Actualizar configuración de WhatsApp del restaurante basado en el menú físico
INSERT INTO settings (key, value) VALUES
('whatsapp_phone', '573145569719')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Ajustar secuencias de ID en Postgres para que los próximos inserts manuales funcionen sin error
SELECT setval(pg_get_serial_sequence('categories', 'id'), COALESCE(MAX(id), 1)) FROM categories;
SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE(MAX(id), 1)) FROM products;
