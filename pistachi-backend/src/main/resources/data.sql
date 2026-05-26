INSERT IGNORE INTO usuario (id, username, password, nombre, apellidos, email, fecha_nacimiento, rol, tachis, tipo_suscripcion, proxima_entrega)
VALUES (
    1, 
    'admin', 
    '$2a$10$fK8UYXg5rZM30JANZMcmBe3mzulJdFnCdUjwG3rdEAoLaWR7uEaoy', 
    'Administrador', 
    'Sistema', 
    'pistachiandsnacks@gmail.com', 
    '2006-07-27', 
    'ADMIN',
    2450,
    'Degustación',
    '2026-07-27'
);

-- Forzar la actualización por si la base de datos ya tenía el usuario admin guardado previamente
UPDATE usuario SET password = '$2a$10$fK8UYXg5rZM30JANZMcmBe3mzulJdFnCdUjwG3rdEAoLaWR7uEaoy', tachis = 2450, tipo_suscripcion = 'Degustación', proxima_entrega = '2026-07-27' WHERE username = 'admin';

-- Productos de prueba
INSERT IGNORE INTO producto (id, nombre, descripcion, precio, imagen, categoria, destacado, unidades, stock)
VALUES 
(
    1, 
    'Croissant de Pistacho', 
    'Clásico croissant francés relleno de nuestra exclusiva crema de pistacho tostado. Coronado con pistachos triturados para un crujido perfecto.', 
    3.50, 
    '/img/croissant-de-pistacho.png', 
    'Bollería', 
    true, 
    1, 
    15
),
(
    2, 
    'Macarons de Pistacho', 
    'Delicadas conchas de almendra rellenas de un ganache suave de pistacho verde. Perfectos para regalar o acompañar tu café.', 
    8.90, 
    '/img/macaron-de-pistacho.png', 
    'Repostería', 
    true, 
    5, 
    10
),
(
    3, 
    'Tarta de Queso y Pistacho', 
    'Porción de tarta de queso horneada al estilo vasco, con un corazón fluido de praliné de pistacho 100% artesanal.', 
    6.20, 
    '/img/tarta-de-queso-de-pistacho.png', 
    'Tartas', 
    false, 
    1, 
    5
),
(
    4, 
    'Pistachino Latte', 
    'Nuestra bebida estrella: Espresso doble con leche texturizada y sirope de pistacho casero. Reconfortante e irresistible.', 
    4.10, 
    '/img/cafe-de-pistacho.png', 
    'Bebidas', 
    true, 
    1, 
    30
),
(
    5, 
    'Churros bañados en Pistacho', 
    'Nuestra versión del clásico madrileño: Churros crujientes recién hechos, bañados en chocolate blanco y pistacho crujiente.', 
    4.50, 
    '/img/churros-de-pistacho.png', 
    'Dulces', 
    false, 
    4, 
    20
),
(
    6, 
    'Crema de Pistacho Artesanal', 
    'Tarro de 250g de crema pura de pistacho premium (50% pistacho). Sin aceite de palma. Perfecta para untar o usar en repostería.', 
    12.90, 
    '/img/crema-de-pistacho.png', 
    'Untables', 
    true, 
    1, 
    25
),
(
    7, 
    'Donut Glaseado de Pistacho', 
    'Donut esponjoso bañado en glaseado de pistacho real con trocitos de pistacho crudo. Una locura dulce.', 
    2.80, 
    '/img/donut-de-pistacho.png', 
    'Bollería', 
    false, 
    1, 
    15
),
(
    8, 
    'Cookies de Pistacho y Choco', 
    'Galletas crujientes por fuera y tiernas por dentro, con gotas de chocolate blanco y pistachos enteros.', 
    4.50, 
    '/img/galleta-de-pistacho.png', 
    'Galletas', 
    true, 
    3, 
    40
),
(
    9, 
    'Helado Artesano de Pistacho', 
    'Tarrina de helado de pistacho siciliano. Cremoso, intenso y con un color verde 100% natural sin colorantes.', 
    5.50, 
    '/img/helado-tarrina-de-pistacho.png', 
    'Helados', 
    true, 
    1, 
    50
),
(
    10, 
    'Magdalenas Rellenas', 
    'Pack de magdalenas esponjosas con corazón líquido de praliné de pistacho. Ideales para el desayuno.', 
    3.80, 
    '/img/magdalena-de-pistacho.png', 
    'Bollería', 
    false, 
    2, 
    20
),
(
    11, 
    'Napolitana de Pistacho', 
    'Hojaldre crujiente con triple relleno de crema de pistacho. Un clásico reversionado al estilo obrador.', 
    3.20, 
    '/img/napolitana-de-pistacho.png', 
    'Bollería', 
    false, 
    1, 
    15
),
(
    12, 
    'Palmera de Hojaldre Pistacho', 
    'Palmera de hojaldre de mantequilla bañada enteramente en nuestra cobertura especial de pistacho.', 
    3.90, 
    '/img/palmera-de-pistacho.png', 
    'Bollería', 
    true, 
    1, 
    10
),
(
    13, 
    'Smoothie Verde', 
    'Batido fresco de pistacho, plátano, espinacas y leche de almendra. Energía pura y sana para tu día.', 
    4.80, 
    '/img/smoothie-de-pistacho.png', 
    'Bebidas', 
    false, 
    1, 
    15
),
(
    14, 
    'Tiramisú de Pistacho', 
    'La receta italiana clásica pero sustituyendo el cacao por crema mascarpone al pistacho. Irresistible.', 
    6.50, 
    '/img/tiramisu-de-pistacho.png', 
    'Postres', 
    true, 
    1, 
    8
),
(
    15, 
    'Tostada Pistachi Premium', 
    'Dos rebanadas de pan de masa madre tostadas, con ricotta, crema de pistacho y un chorrito de miel artesanal.', 
    5.90, 
    '/img/tostada-de-pistacho.png', 
    'Desayunos', 
    false, 
    2, 
    12
);
