CREATE DATABASE IF NOT EXISTS pistachi_and_snacks;
USE pistachi_and_snacks;

CREATE TABLE IF NOT EXISTS producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    destacado BOOLEAN
);

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL
);

TRUNCATE TABLE producto;
TRUNCATE TABLE usuario;

INSERT INTO producto (nombre, descripcion, precio, imagen, categoria, destacado) VALUES
('Croissant de Pistacho (1 ud.)', 'Croissant de doble horneado relleno con crema de pistacho ibérico.', 2.20, '/img/croissant-de-pistacho.png', 'Bollería', 1),
('Cheesecake Esmeralda (1 ud.)', 'Tarta de queso horneada al estilo Nueva York con praliné de pistacho.', 3.50, '/img/tarta-de-queso-de-pistacho.png', 'Tartas', 0),
('Cookie Bomb Rellena (1 ud.)', 'Galleta artesanal con corazón fundido de chocolate blanco y crema de pistacho.', 1.99, '/img/galleta-de-pistacho.png', 'Galletas', 1),
('Latte Pistaccio', 'Café de especialidad con leche fresca y sirope casero de pistacho tostado.', 1.90, '/img/cafe-de-pistacho.png', 'Bebidas', 0),
('Macaron Trébol (5 uds.)', 'Dulce francés con cáscara de almendra y ganache montada de pistacho.', 6.00, '/img/macaron-de-pistacho.png', 'Postres', 0),
('Crema de Pistacho', 'Tarro de crema untable elaborada con pistachos seleccionados, ideal para desayunos y repostería.', 4.99, '/img/crema-de-pistacho.png', 'Despensa', 0),
('Donut de Pistacho', 'Esponjoso donut artesanal cubierto con glaseado crujiente y trocitos de pistacho tostado.', 2.99, '/img/donut-de-pistacho.png', 'Bollería', 1),
('Smoothie de Pistacho', 'Batido helado y refrescante con base de leche, vainilla y crema de pistacho pura.', 3.49, '/img/smoothie-de-pistacho.png', 'Bebidas', 0),
('Tiramisú de Pistacho', 'Versión del clásico postre italiano con bizcochos empapados en café y mascarpone al pistacho.', 3.99, '/img/tiramisu-de-pistacho.png', 'Postres', 0),
('Churros con Relleno de Pistacho (9 uds.)', 'Deliciosos churros con relleno de crema de pistacho artesanal y chocolate blanco.', 4.99, '/img/churros-de-pistacho.png', 'Bollería', 1),
('Magdalena de Pistacho (1 ud.)', 'Esponjosa magdalena con pistachos en su interior completamente hecha en casa y nata de pistacho por encima.', 1.49, '/img/magdalena-de-pistacho.png', 'Bollería', 0),
('Napolitana de Pistacho', 'Napolitana clásica de toda la vida pero con un relleno cremoso con trocitos de pistacho.', 1.99, '/img/napolitana-de-pistacho.png', 'Bollería', 1),
('Palmera de Pistacho', 'Palmera con glaseado de pistacho por encima y un relleno con crema de pistacho para darle ese toque pistachi.', 1.99, '/img/palmera-de-pistacho.png', 'Bollería', 0),
('Tostadas con Crema de Pistacho (2 uds.)', 'Crujientes y encantadoras tostadas para acompañar con el café mañanero con crema de pistacho.', 2.49, '/img/tostada-de-pistacho.png', 'Bollería', 1);