# Pistachitos Y Snacks - Tienda Online

## Descripción del Proyecto
Esta aplicación web es una plataforma de comercio electrónico orientada a la venta de productos de repostería y snacks basados en pistacho. El proyecto cumple con los requisitos de un sistema de ventas completo, dividiendo su arquitectura en un frontend interactivo y un backend robusto que gestiona la lógica de negocio y la persistencia de datos. 

[cite_start]Este documento sirve como guía definitiva para la instalación, configuración y despliegue del proyecto, asegurando que cualquier persona con conocimientos técnicos básicos pueda poner en marcha la aplicación.

## Arquitectura y Tecnologías Utilizadas

El proyecto sigue una arquitectura cliente-servidor (Frontend/Backend) separada, comunicada a través de una API REST.

### Frontend
* **Librería Principal:** React.
* **Lenguaje:** TypeScript, proporcionando tipado estático para un desarrollo más seguro y predecible.
* **Herramienta de Construcción:** Vite, utilizado para un empaquetado y recarga en caliente extremadamente rápidos.
* **Enrutamiento:** React Router DOM, gestionando la navegación mediante una Single Page Application (SPA).
* **Gestión de Estado:** React Context API, empleado para manejar el estado global de la autenticación de usuarios (`AuthContext`) y el carrito de compras (`CartContext`).
* **Estilos:** CSS puro, asegurando un diseño responsive adaptable a múltiples resoluciones y dispositivos.

### Backend
* **Framework Principal:** Spring Boot, facilitando la creación de la aplicación basada en Java.
* **Lenguaje:** Java.
* **Gestión de Dependencias:** Maven.
* **Persistencia de Datos:** Spring Data JPA (Hibernate), manejando el mapeo objeto-relacional (ORM).
* **Arquitectura de Capas:** Separación estricta entre Controladores (`Controller`), Servicios (`Service`), Repositorios (`Repository`) y Modelos (`Model`).

### Base de Datos
* **Motor:** MySQL (o compatible como MariaDB).
* **Inicialización:** Script SQL integrado para la creación automática de la estructura y la inyección de datos de prueba.

## Funcionalidades Principales implementadas

1.  **Catálogo de Productos:** Visualización de todos los artículos disponibles, con un sistema de paginación implementado en el cliente para gestionar grandes volúmenes de datos.
2.  **Búsqueda Dinámica:** Motor de búsqueda integrado que consulta directamente a la base de datos por nombre o descripción del producto.
3.  **Vista de Detalles:** Páginas individuales para cada producto que muestran información ampliada, categoría y precio.
4.  **Gestión de Usuarios:** * Registro de nuevos clientes.
    * Inicio de sesión.
    * Protección de rutas privadas (el carrito de la compra solo es accesible para usuarios autenticados).
5.  **Carrito de Compras:** Sistema que permite añadir productos, visualizar el total y gestionar los artículos seleccionados.
6.  **Página Principal (Home):** Sección de bienvenida con exposición de productos "Destacados" o "Favoritos" filtrados desde el servidor.

## Novedades (WIP)
El diseño arquitectónico y de base de datos se ha planteado con la escalabilidad en mente. A continuación, se detallan las futuras funcionalidades y líneas de negocio innovadoras que se irán implementando en las próximas versiones para expandir la plataforma:

* **Club de Suscripción ("Pistachi Box"):** Implementación de un modelo de ingresos recurrentes donde los usuarios podrán suscribirse para recibir una caja mensual sorpresa con degustaciones, nuevos lanzamientos y ediciones limitadas.
* **Programa de Fidelización (Pistachi Puntos):** Un sistema de gamificación para premiar la lealtad del cliente. Los usuarios acumularán puntos por sus compras o acciones específicas (como registrarse o invitar a amigos), que podrán canjear por descuentos directos en futuros pedidos.
* **Sistema de Reseñas Verificadas:** Integración de un sistema de valoraciones (de 1 a 5 estrellas) y comentarios en la ficha de cada producto. Estará restringido a usuarios que hayan completado la compra previamente, aumentando la prueba social y la confianza en la plataforma.
* **Motor de Promociones y Cupones:** Desarrollo de la lógica necesaria para lanzar campañas de marketing estacionales, permitiendo a los usuarios aplicar códigos de descuento (fijos o porcentuales) en el carrito, con control estricto de caducidad y límite de usos.

---

## Requisitos Previos para la Instalación

Antes de proceder, es necesario contar con el siguiente software instalado en el sistema:
* **Java Development Kit (JDK):** Versión 17 o superior.
* **Node.js y npm:** Versión 18 o superior.
* **MySQL Server:** Versión 8 o superior, en ejecución.
* **Git:** Para la clonación del repositorio (opcional si se descarga el código fuente directamente).

---

## Instalación y Configuración

### 1. Base de Datos
1. Abre tu cliente de MySQL (ej. MySQL Workbench).
2. Ejecuta el script SQL que se encuentra en `pistachi-backend/src/main/resources/data.sql`. Esto creará la base de datos `pistachi_and_snacks`, las tablas necesarias y añadirá los datos de prueba.
3. Asegúrate de revisar el archivo `application.properties` en el backend para confirmar que tu usuario y contraseña de MySQL (por defecto root) coinciden con los de tu máquina local.

### 2. Backend (Spring Boot)
1. Navega a la carpeta del backend: `cd pistachi-backend`
2. Compila y ejecuta el proyecto usando Maven:
   - En Windows: `mvnw.cmd spring-boot:run`
   - En Linux/Mac: `./mvnw spring-boot:run`
3. El servidor backend se iniciará en el puerto 80 (http://localhost:80).

### 3. Frontend (React)
1. Abre una nueva terminal y navega a la carpeta del frontend: `cd pistachi-frontend`
2. Instala las dependencias del proyecto ejecutando: `npm install`
3. Inicia el servidor de desarrollo ejecutando: `npm run dev`
4. Accede a la aplicación desde tu navegador a través del enlace local que proporcionará Vite (generalmente http://localhost:5173).
