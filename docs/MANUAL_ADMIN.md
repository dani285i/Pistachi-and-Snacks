# Manual del Administrador: Pistachi & Snacks

Este documento es el manual oficial de despliegue y gestión para el administrador de la tienda **El Obrador de Pistacho**.

Este manual detalla el proceso de instalación y configuración asumiendo un entorno inicial limpio (únicamente con un navegador instalado). El proceso debe seguirse paso a paso y de manera estructurada.

---

## Fase 1: Instalación de Software Necesario

Para poder ejecutar el código fuente, el entorno de despliegue requiere los siguientes programas (todos son de distribución gratuita):

1. **Visual Studio Code (VS Code):** Entorno de desarrollo recomendado para la gestión del código. ([Descargar aquí](https://code.visualstudio.com/))
2. **Git:** Sistema de control de versiones para obtener el código fuente. ([Descargar aquí](https://git-scm.com/downloads))
3. **Node.js (versión 18 o superior):** Entorno de ejecución requerido para el Frontend de la tienda. Incluye el gestor de paquetes `npm`. ([Descargar aquí](https://nodejs.org/))
4. **Java JDK 21:** Kit de desarrollo necesario para compilar y ejecutar el Backend. ([Descargar JDK 21 de Oracle o Eclipse Temurin](https://adoptium.net/))
5. **MySQL Server & Workbench:** Motor de base de datos relacional. Durante su instalación, se requerirá establecer una contraseña para el usuario `root`. **Es indispensable recordar esta contraseña para pasos posteriores.** ([Descargar aquí](https://dev.mysql.com/downloads/installer/))

---

## Fase 2: Descarga del Proyecto

1. Abrir **Visual Studio Code**.
2. Desplegar el menú superior y seleccionar `Terminal > New Terminal`.
3. Navegar mediante comandos a la ruta deseada para el almacenamiento del proyecto (por ejemplo, `cd Documentos`).
4. Ejecutar el siguiente comando para clonar el repositorio:
   ```bash
   git clone https://github.com/dani285i/Pistachi-and-Snacks.git
   ```
5. En VS Code, ir a `File > Open Folder...` y seleccionar el directorio `Pistachi-and-Snacks` recién descargado.

---

## Fase 3: Configuración de Seguridad y Credenciales

Por directrices de seguridad, los archivos con credenciales sensibles no se incluyen en el repositorio público. Es necesario generar el archivo de configuración de correo manualmente:

1. En el explorador de archivos de VS Code, navegar a la ruta:
   `pistachi-backend/src/main/resources`
2. Crear un nuevo archivo dentro del directorio `resources` con el nombre exacto: `application-secrets.properties`
3. Incluir el siguiente contenido, reemplazando los valores por las credenciales reales:
   ```properties
   MAIL_USERNAME=correo_de_la_tienda@gmail.com
   MAIL_PASSWORD=contraseña_de_aplicacion
   ```
   *Nota sobre la contraseña:* No debe utilizarse la contraseña de acceso habitual. En el caso de Google, es necesario acceder a "Gestionar cuenta" > "Seguridad" > Activar "Verificación en 2 pasos" > "Contraseñas de aplicaciones", y generar un código de 16 caracteres.

### Configuración de la Conexión a Base de Datos
En el mismo directorio `resources`, localizar el archivo `application.properties`. Confirmar que los siguientes parámetros coinciden con la configuración establecida durante la instalación de MySQL (Fase 1):
```properties
spring.datasource.username=root
spring.datasource.password=SU_CONTRASEÑA_DE_MYSQL
```

---

## Fase 4: Inicialización de la Base de Datos

1. Ejecutar **MySQL Workbench**.
2. Establecer conexión con el servidor local (`Local instance 3306`) introduciendo la contraseña configurada previamente.
3. Crear un nuevo esquema mediante el icono designado (cilindro con símbolo `+`).
4. Nombrar el esquema estrictamente como `pistachi_db` y aplicar los cambios.
5. Finalizado. La creación de las tablas de productos, pedidos y demás entidades será gestionada automáticamente por la aplicación durante el primer arranque.

---

## Fase 5: Ejecución del Proyecto

La arquitectura del sistema requiere la ejecución simultánea de los servicios de Backend y Frontend en procesos de terminal independientes.

### Ejecución del Backend (Spring Boot)
1. Abrir una nueva terminal y navegar al directorio del backend:
   ```bash
   cd pistachi-backend
   ```
2. Ejecutar el siguiente comando de Maven para inicializar el servidor:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Para sistemas Windows PowerShell, ejecutar: `.\mvnw.cmd spring-boot:run`)*
3. Verá múltiples líneas de carga en la consola. Si el proceso finaliza con el mensaje "Started PistachitosYSnacksApplication", la ejecución habrá sido exitosa. Mantenga esta terminal abierta.

### Ejecución del Frontend (React)
1. Desplegar una **segunda terminal** en el editor.
2. Navegar al directorio del frontend:
   ```bash
   cd pistachi-frontend
   ```
3. Instalar las dependencias del proyecto (acción requerida únicamente en el primer despliegue):
   ```bash
   npm install
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. El sistema proporcionará una dirección de red local (habitualmente `http://localhost:5173/`). Acceda a esta URL desde un navegador web para interactuar con la plataforma.

---

## Fase 6: Uso del Panel de Administración

Una vez que la aplicación esté en funcionamiento, será necesario acceder como administrador para la gestión integral del comercio.

1. Acceder a la sección de **Login** en la aplicación web.
2. Iniciar sesión utilizando credenciales con el rol de Administrador. *(En despliegues limpios, es posible registrar un usuario estándar y posteriormente elevar sus privilegios modificando el campo 'rol' a 'ADMIN' directamente en la tabla de usuarios desde MySQL Workbench).*
3. Una vez autenticado, aparecerá una opción adicional en la navegación denominada **Panel Admin**.

### Capacidades del Panel de Administración

* **Gestión de Productos:**
  * **Stock:** Es posible modificar el stock introduciendo el valor directamente en la celda correspondiente. Al establecer el valor a `0`, la interfaz alertará visualmente en rojo y el producto pasará a estado "Agotado" para el consumidor final. Al reabastecer inventario, el sistema enviará automáticamente un correo electrónico a los usuarios suscritos a alertas de disponibilidad de dicho producto.
  * **Añadir/Editar Productos:** Durante la creación de nuevos ítems, se requerirá proveer la ruta de la imagen. La arquitectura exige que las imágenes se sitúen físicamente en el directorio `pistachi-frontend/public/img/` de su servidor. El panel debe configurarse con la ruta relativa (ejemplo: `/img/mi-nuevo-croissant.jpg`).

* **Gestión de Pedidos:**
  * Monitorización detallada del histórico y estado actual de las compras.
  * **Control Anti-Fraude:** En el supuesto de que un pedido sea modificado a estado `CANCELADO`, el sistema detectará el cambio y deducirá automáticamente del saldo del cliente los puntos de fidelización (Tachis) obtenidos de manera ilegítima.

* **Gestión de Usuarios:**
  * Supervisión general de perfiles registrados, control de saldo en puntos Tachis y revocación de acceso a usuarios mediante eliminación de cuentas.

---
*Fin del manual del administrador.*