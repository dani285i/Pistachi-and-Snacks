# Pistachi & Snacks - Tienda Online

## Descripción del Proyecto
Esta aplicación web es una plataforma de comercio electrónico orientada a la venta de productos de repostería y snacks basados en pistacho. El proyecto cumple con los requisitos de un sistema de ventas completo, dividiendo su arquitectura en un frontend interactivo y un backend robusto que gestiona la lógica de negocio y la persistencia de datos.

Este documento sirve como guía definitiva para la instalación, configuración y despliegue del proyecto, asegurando que cualquier persona con conocimientos técnicos básicos pueda poner en marcha la aplicación.

## Arquitectura y Tecnologías Utilizadas

El proyecto sigue una arquitectura cliente-servidor (Frontend/Backend) separada, comunicada a través de una API REST.

### Frontend
* **Librería Principal:** React 19.
* **Lenguaje:** TypeScript, proporcionando tipado estático para un desarrollo más seguro y predecible.
* **Herramienta de Construcción:** Vite, utilizado para un empaquetado y recarga en caliente extremadamente rápidos.
* **Enrutamiento:** React Router DOM v7, gestionando la navegación, incluyendo el paso de parámetros y paginación mediante URL (Search Params).
* **Gestión de Estado:** React Context API, empleado para manejar el estado global de la autenticación de usuarios (`AuthContext`), el carrito de compras (`CartContext`), favoritos (`FavoritosContext`) y notificaciones (`ToastContext`).
* **Estilos e Iconografía:** CSS puro para un diseño responsive y Phosphor Icons para la iconografía de la interfaz.

### Backend
* **Framework Principal:** Spring Boot 4, facilitando la creación de la API REST.
* **Lenguaje:** Java 21.
* **Gestión de Dependencias:** Maven.
* **Persistencia de Datos:** Spring Data JPA (Hibernate), manejando el mapeo objeto-relacional (ORM).
* **Seguridad y Correo:** Módulos de Spring Security y Spring Boot Starter Mail (`JavaMailSender`).
* **Arquitectura de Capas:** Separación estricta entre Controladores (`Controller`), Servicios (`Service`), Repositorios (`Repository`) y Modelos (`Model`).

### Base de Datos
* **Motor:** MySQL (o compatible como MariaDB).
* **Modelo Entidad-Relación:** Conformado por las entidades principales: `Usuario`, `Producto`, `Pedido` y `LineaPedido`.
* **Inicialización:** Script SQL integrado para la creación automática de la estructura y la inyección de datos de prueba.

## Funcionalidades Principales Implementadas

1. **Catálogo de Productos Dinámico:** Visualización de artículos con sistema de **paginación integrada en la URL** (`?page=2`) y filtrado funcional por categorías (`?categoria=Snacks`).
2. **Panel de Gestión de Administrador:** Un *Dashboard* protegido que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre el catálogo de productos directamente desde la web, actualizando el stock, categorías y precios en tiempo real.
3. **Gestión de Inventario y Notificaciones:** Los productos reflejan el stock real de la base de datos. Si un producto llega a stock 0, se deshabilita la compra y se ofrece añadirlo a una **lista de avisos/deseos** (botón "Agotado - Avisadme").
4. **Sistema de Favoritos:** Funcionalidad para que los usuarios puedan guardar y consultar rápidamente sus productos preferidos para compras futuras.
5. **Autenticación y Notificaciones Automáticas por Email:** 
   * Registro y Login de usuarios protegiendo el ecosistema.
   * **Envío automático de correo electrónico** de bienvenida a los nuevos usuarios al registrarse con éxito, validado en el servidor con Spring Mail.
6. **Carrito y Pasarela de Pago:** Sistema completo de carrito de la compra con integración del entorno de pagos de **PayPal** (`@paypal/react-paypal-js`).
7. **UX/UI Optimizada y Semántica Web:** Diseño moderno con etiquetas HTML5 semánticas que incluye animaciones fluidas, notificaciones tipo *Toast*, feedback visual inmediato y correcta implementación de Meta-etiquetas y Favicon multiplataforma.

## Trabajo Futuro y Funcionalidades en Desarrollo

Para continuar expandiendo la plataforma de cara a la evaluación y futuras versiones, se contemplan las siguientes integraciones que completan el ciclo de la aplicación:

* **Panel Admin - Pedidos y Usuarios:** Finalizar las vistas en el Dashboard de administración para gestionar el estado de los envíos de los clientes e inhabilitar perfiles de usuario.
* **Lista de Deseos Backend:** Conectar el botón actual de "Avisadme cuando haya stock" del frontend a una tabla relacional en base de datos para disparar automáticamente un email al cliente cuando el administrador suba el stock.
* **Recuperación de Contraseña:** Flujo completo de "He olvidado mi contraseña" usando el motor de envíos de correo implementado.
* **Club de Suscripción ("Pistachi Box"):** Implementación de modelo de ingresos recurrentes para suscripción de cajas mensuales sorpresa.
* **Programa de Fidelización (Pistachi Puntos) y Reseñas:** Acumulación de puntos por pedidos y valoración (1 a 5 estrellas) para usuarios con compra verificada.

---

## Requisitos Previos para la Instalación

Antes de proceder, es necesario contar con el siguiente software instalado en el sistema:
* **Java Development Kit (JDK):** Versión 21 o superior.
* **Node.js y npm:** Version 18 o superior.
* **MySQL Server:** Versión 8 o superior, en ejecución.
* **Git:** Para la clonación del repositorio (opcional si se descarga el código fuente directamente).

---

## Instalación y Configuración

### 1. Base de Datos
1. Abre tu cliente de MySQL (ej. MySQL Workbench).
2. Ejecuta el script SQL que se encuentra en `pistachi-backend/src/main/resources/data.sql` (o deja que Hibernate inicialice la estructura si está configurado en update). Esto creará la base de datos, las tablas necesarias y añadirá los datos de prueba.
3. Asegúrate de revisar el archivo `application.properties` en el backend para confirmar que tu usuario y contraseña de MySQL (por defecto root) coinciden con los de tu máquina local.

### 2. Backend (Spring Boot)
1. Navega a la carpeta del backend: `cd pistachi-backend`
2. Compila y ejecuta el proyecto usando Maven:
   - En Windows: `mvnw.cmd spring-boot:run`
   - En Linux/Mac: `./mvnw spring-boot:run`
3. El servidor backend se iniciará y escuchará peticiones (usualmente en el puerto 9090 según configuración).

### 3. Frontend (React)
1. Abre una nueva terminal y navega a la carpeta del frontend: `cd pistachi-frontend`
2. Instala las dependencias del proyecto ejecutando: `npm install`
3. Inicia el servidor de desarrollo ejecutando: `npm run dev`
4. Accede a la aplicación desde tu navegador a través del enlace local que proporcionará Vite (generalmente http://localhost:5173).