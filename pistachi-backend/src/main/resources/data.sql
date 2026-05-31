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
    99999,
    'Premium',
    '2026-07-27'
);

-- Forzar la actualización de la contraseña por si la base de datos ya tenía el usuario admin guardado previamente
UPDATE usuario SET password = '$2a$10$fK8UYXg5rZM30JANZMcmBe3mzulJdFnCdUjwG3rdEAoLaWR7uEaoy' WHERE username = 'admin';

-- Productos de prueba
INSERT IGNORE INTO producto (id, nombre, descripcion, precio, imagen, categoria, destacado, unidades, stock)
VALUES 
(
    1, 
    'Croissant Pistachi', 
    'Clásico croissant francés relleno de nuestra exclusiva crema de pistacho tostado. Coronado con pistachos triturados para un crujido perfecto.', 
    3.50, 
    '/img/croissant-de-pistacho.webp', 
    'BOLLERIA', 
    true, 
    1, 
    15
),
(
    2, 
    'Macarons de Pistacho', 
    'Delicadas conchas de almendra rellenas de un ganache suave de pistacho verde. Perfectos para regalar o acompañar tu café.', 
    8.90, 
    '/img/macaron-de-pistacho.webp', 
    'REPOSTERIA', 
    false, 
    5, 
    10
),
(
    3, 
    'Tarta de Queso y Pistacho', 
    'Porción de tarta de queso horneada al estilo vasco, con un corazón fluido de praliné de pistacho 100% artesanal.', 
    6.20, 
    '/img/tarta-de-queso-de-pistacho.webp', 
    'TARTAS', 
    false, 
    1, 
    5
),
(
    4, 
    'Pistachino Latte', 
    'Nuestra bebida estrella: Espresso doble con leche texturizada y sirope de pistacho casero. Reconfortante e irresistible.', 
    4.10, 
    '/img/cafe-de-pistacho.webp', 
    'BEBIDAS', 
    true, 
    1, 
    30
),
(
    5, 
    'Churros bañados en Pistacho', 
    'Nuestra versión del clásico madrileño: Churros crujientes recién hechos, bañados en chocolate blanco y pistacho crujiente.', 
    4.50, 
    '/img/churros-de-pistacho.webp', 
    'DULCES', 
    true, 
    4, 
    20
),
(
    6, 
    'Crema de Pistacho Artesanal', 
    'Tarro de 250g de crema pura de pistacho premium (50% pistacho). Sin aceite de palma. Perfecta para untar o usar en repostería.', 
    12.90, 
    '/img/crema-de-pistacho.webp', 
    'UNTABLES', 
    true, 
    1, 
    25
),
(
    7, 
    'Donut Glaseado de Pistacho', 
    'Donut esponjoso bañado en glaseado de pistacho real con trocitos de pistacho crudo. Una locura dulce.', 
    2.80, 
    '/img/donut-de-pistacho.webp', 
    'BOLLERIA', 
    false, 
    1, 
    15
),
(
    8, 
    'Cookies de Pistacho y Choco', 
    'Galletas crujientes por fuera y tiernas por dentro, con gotas de chocolate blanco y pistachos enteros.', 
    4.50, 
    '/img/galleta-de-pistacho.webp', 
    'GALLETAS', 
    false, 
    3, 
    40
),
(
    9, 
    'Helado Artesano de Pistacho', 
    'Tarrina de helado de pistacho siciliano. Cremoso, intenso y con un color verde 100% natural sin colorantes.', 
    5.50, 
    '/img/helado-tarrina-de-pistacho.webp', 
    'HELADOS', 
    false, 
    1, 
    50
),
(
    10, 
    'Magdalenas Rellenas', 
    'Pack de magdalenas esponjosas con corazón líquido de praliné de pistacho. Ideales para el desayuno.', 
    3.80, 
    '/img/magdalena-de-pistacho.webp', 
    'BOLLERIA', 
    false, 
    2, 
    20
),
(
    11, 
    'Napolitana de Pistacho', 
    'Hojaldre crujiente con triple relleno de crema de pistacho. Un clásico reversionado al estilo obrador.', 
    3.20, 
    '/img/napolitana-de-pistacho.webp', 
    'BOLLERIA', 
    true, 
    1, 
    15
),
(
    12, 
    'Palmera de Hojaldre Pistacho', 
    'Palmera de hojaldre de mantequilla bañada enteramente en nuestra cobertura especial de pistacho.', 
    3.90, 
    '/img/palmera-de-pistacho.webp', 
    'BOLLERIA', 
    false, 
    1, 
    10
),
(
    13, 
    'Smoothie Verde', 
    'Batido fresco de pistacho, plátano, espinacas y leche de almendra. Energía pura y sana para tu día.', 
    4.80, 
    '/img/smoothie-de-pistacho.webp', 
    'BEBIDAS', 
    false, 
    1, 
    15
),
(
    14, 
    'Tiramisú de Pistacho', 
    'La receta italiana clásica pero sustituyendo el cacao por crema mascarpone al pistacho. Irresistible.', 
    6.50, 
    '/img/tiramisu-de-pistacho.webp', 
    'POSTRES', 
    false, 
    1, 
    8
),
(
    15, 
    'Tostada Pistachi', 
    'Dos rebanadas de pan de masa madre tostadas, con ricotta, crema de pistacho y un chorrito de miel artesanal.', 
    5.90, 
    '/img/tostada-de-pistacho.webp', 
    'DESAYUNOS', 
    false, 
    2, 
    12
);

INSERT IGNORE INTO codigo_postal (concello, codigo, descripcion) VALUES
('A_CORUNA', '15001', 'Ciudad Vieja, Pescadera y parte del Centro Histrico.'),
('A_CORUNA', '15002', 'Zonas de Monte Alto, Zalaeta, Adormideras y Orillamar.'),
('A_CORUNA', '15003', 'Orzn, parte del Ensanche y zona de Alta.'),
('A_CORUNA', '15004', 'Ensanche central y la zona norte de Juan Flrez.'),
('A_CORUNA', '15005', 'Cuatro Caminos, Plaza de Vigo y la zona sur de Juan Flrez.'),
('A_CORUNA', '15006', 'Os Mallos, el entorno de la Estacin de Tren, El Puerto comercial y A Silva.'),
('A_CORUNA', '15007', 'Sagrada Familia, Ventorrillo y el Agra del Orzn.'),
('A_CORUNA', '15008', 'Elvia, Someso, Matogrande, Barrio de las Flores y A Zapateira.'),
('A_CORUNA', '15009', 'Os Castros, Castrilln, Eirs y Monelos.'),
('A_CORUNA', '15010', 'Entorno de la Avenida de Finisterre y la zona de Riazor.'),
('A_CORUNA', '15011', 'Los Rosales, Labaou, Ciudad Escolar y San Pedro de Visma.'),
('A_CORUNA', '15070', 'Cdigos de usos especiales, apartados de correos y grandes usuarios.'),
('A_CORUNA', '15071', 'Cdigos de usos especiales, apartados de correos y grandes usuarios.'),
('A_CORUNA', '15080', 'Cdigos de usos especiales, apartados de correos y grandes usuarios.'),
('CULLEREDO', '15189', 'Zonas de Vilaboa, Rutis, Liares y el rea de Alvedro.'),
('CULLEREDO', '15180', 'O Burgo y la zona deportiva y residencial de Acea de Ama.'),
('CULLEREDO', '15670', 'Parte de O Burgo compartida, el ncleo central de Culleredo y Tarro.'),
('CULLEREDO', '15174', 'Zona residencial de Cordeda.'),
('CULLEREDO', '15199', 'Zonas del interior del municipio menos pobladas (S�samo o Celas).'),
('OLEIROS', '15172', 'Perillo y la zona colindante a la r�a, incluyendo Santa Cristina.'),
('OLEIROS', '15173', 'San Pedro de N�s e I��s (incluyendo gran parte de su �rea comercial).'),
('OLEIROS', '15176', 'Dorneda y el entorno natural de Dexo.'),
('OLEIROS', '15177', 'Mera y su entorno costero cercano.'),
('OLEIROS', '15178', 'Maianca.'),
('OLEIROS', '15179', 'Santa Cruz, Li�ns y alrededores.'),
('OLEIROS', '15171', 'Zona residencial espec�fica de Icaria.'),
('CAMBRE', '15660', 'Cambre (n�cleo municipal principal) y Pravio.'),
('CAMBRE', '15679', 'O Temple y O Graxal (la zona urbana m�s pegada a la r�a y a O Burgo).'),
('CAMBRE', '15181', 'A Barcala, Sigr�s y la zona hacia Anceis.'),
('CAMBRE', '15669', 'Bribes, Cela y parroquias colindantes.'),
('CAMBRE', '15668', 'Andeiro y Brexo-Lema.'),
('CAMBRE', '15650', '�reas rurales lim�trofes y menos habitadas del sur del concello.'),
('CAMBRE', '15659', '�reas rurales lim�trofes y menos habitadas del sur del concello.'),
('BERGONDO', '15165', 'Bergondo (la capital municipal) y gran parte de la parroquia de Gu�samo.'),
('BERGONDO', '15166', 'Lubre, Armu�o, Esp�ritu Santo y la zona del pol�gono industrial.'),
('BERGONDO', '15167', 'Ouces, la zona costera de Gandar�o y A Lagoa.'),
('BERGONDO', '15640', '�reas compartidas de Gu�samo con pedan�as vecinas como Brea o Vilar.'),
('BERGONDO', '15319', 'Rois, Bab�o y el l�mite sureste del municipio.'),
('BETANZOS', '15300', 'El n�cleo urbano de Betanzos y los barrios colindantes.'),
('BETANZOS', '15319', 'Las parroquias y aldeas rurales perif�ricas (Piadela, Requi�n e Infesta).');
