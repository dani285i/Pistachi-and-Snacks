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

---

## Requisitos Previos para la Instalación

Antes de proceder, es necesario contar con el siguiente software instalado en el sistema:
* **Java Development Kit (JDK):** Versión 17 o superior.
* **Node.js y npm:** Versión 18 o superior.
* **MySQL Server:** Versión 8 o superior, en ejecución.
* **Git:** Para la clonación del repositorio (opcional si se descarga el código fuente directamente).

---

## Instrucciones de Instalación y Ejecución

Siga estos pasos de forma secuencial para levantar el proyecto en un entorno local. [cite_start]Estas instrucciones están diseñadas para ser lo suficientemente detalladas para garantizar una ejecución exitosa[cite: 32].

### Paso 1: Configuración de la Base de Datos

1. Abra su cliente de base de datos preferido (MySQL Workbench, DBeaver, o la consola de línea de comandos de MySQL).
2. Conéctese a su servidor local de MySQL.
3. Localice el archivo `data.sql` que se encuentra en la ruta `pistachi-backend/src/main/resources/`.
4. Ejecute el contenido de este script en su servidor. Este script se encargará de:
   * Crear la base de datos `pistachidb`.
   * Crear las tablas necesarias (`producto` y `usuario`).
   * Insertar los datos de prueba iniciales del catálogo.

### Paso 2: Configuración y Ejecución del Backend

1. Abra un terminal o línea de comandos.
2. Navegue hasta el directorio raíz del backend:
   ```bash
   cd ruta/al/proyecto/pistachi-backend