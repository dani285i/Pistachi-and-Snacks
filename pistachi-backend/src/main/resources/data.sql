-- Usuario Administrador por defecto
-- Password es 'admin123' encriptado con BCrypt
INSERT IGNORE INTO usuario (id, username, password, nombre, apellidos, email, fecha_nacimiento, rol, tachis, tipo_suscripcion, proxima_entrega)
VALUES (
    1, 
    'admin', 
    '$2a$10$fK8UYXg5rZM30JANZMcmBe3mzulJdFnCdUjwG3rdEAoLaWR7uEaoy', 
    'Administrador', 
    'Sistema', 
    'admin@pistachi.com', 
    '2024-01-01', 
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
    'https://images.unsplash.com/photo-1549903072-7e6e0d654637?q=80&w=600&auto=format&fit=crop', 
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
    'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=600&auto=format&fit=crop', 
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
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop', 
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
    'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop', 
    'Café', 
    true, 
    1, 
    30
);
