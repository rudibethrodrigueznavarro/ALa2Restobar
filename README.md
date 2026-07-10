# A LA 2 RESTO-BAR

Bienvenido al repositorio del proyecto **A La 2 Restobar**. Este proyecto está construido con Next.js (App Router), Tailwind CSS v4 y utiliza PostgreSQL para la persistencia de datos.

## Tecnologías Principales

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Backend:** Conexión nativa a PostgreSQL usando la librería `pg`.
- **Diseño:** Sistema de diseño personalizado, modo oscuro, fuentes "Space Grotesk" e "Inter", e íconos de Google Material Symbols.

## Estructura de Pantallas Implementadas

- `/` : Página de Bienvenida y hero principal.
- `/menu` : Menú interactivo con productos y categorías.
- `/resumen` : Resumen de pedido para envío por WhatsApp.
- `/admin` : Panel de control y Dashboard.
- `/admin/inventario` : Panel de gestión de inventario y subida de archivos (incluyendo 3D).
- `/producto/3d` : Visor inmersivo 3D del producto.

## Requisitos Previos

- Node.js (v18 o superior).
- Base de datos PostgreSQL (local o usando Dokploy/Supabase/Neon).

## Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de Variables de Entorno:**
   Copia el archivo de ejemplo para configurar tus variables de entorno locales:
   ```bash
   cp .env.example .env
   ```
   Abre el archivo `.env` y configura el parámetro `DATABASE_URL` con los datos de conexión a tu base de datos PostgreSQL.
   
3. **Inicializar la Base de Datos:**
   Debes ejecutar de forma manual el script SQL para crear las tablas necesarias.
   Abre tu cliente SQL favorito (DBeaver, pgAdmin, psql) y ejecuta el contenido del archivo `database/schema.sql` en tu base de datos `ala2restobar`.

4. **Ejecución en Desarrollo:**
   ```bash
   npm run dev
   ```
   El sitio estará disponible en `http://localhost:3000`.

## Despliegue en Producción (On-Premise con Docker)

Este proyecto está completamente dockerizado para ser instalado en la computadora del cliente de forma local, incluyendo base de datos, almacenamiento, túnel hacia internet y sistema de respaldos.

### Componentes de la Arquitectura
- **App (Next.js)**: Optimizada con modo `standalone` para mínimo consumo.
- **PostgreSQL 16**: Base de datos relacional persistente.
- **MinIO**: Servidor de almacenamiento (S3-compatible) para imágenes.
- **Ngrok**: Túnel seguro que expone la aplicación local a internet mediante un dominio estático y código QR.
- **Watchtower**: Actualizador automático silencioso.
- **Backup Agent**: Script automatizado (`scripts/backup.sh`) que realiza volcados diarios de PostgreSQL y MinIO a las 3:00 AM.

### ¿Qué llevarás a la computadora del Cliente?

Para facilitarte la vida, el archivo `docker-compose.prod.yml` ya tiene apuntado tu nombre de usuario real (`mariodiazgomez2/ala2-restobar:latest`).

En la computadora del cliente **solo necesitas copiar 3 cosas**:

1. El archivo `docker-compose.prod.yml`
2. El archivo `.env.production` (asegúrate de ponerle tu token de Ngrok adentro)
3. La carpeta `scripts` (donde está el archivo `.bat` de actualizar y el de los backups).

Cuando estés en la computadora del cliente (con Docker Desktop ya instalado ahí), solo abres la terminal donde pusiste esos 3 archivos y escribes:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

Docker descargará automáticamente tu imagen de internet, levantará PostgreSQL, MinIO, Ngrok y todo funcionará mágicamente.

### Actualización Manual (Por el Cliente)
El cliente cuenta con el archivo `scripts/Actualizar_Sistema.bat`. Si el desarrollador sube una nueva actualización a Docker Hub, el cliente solo debe hacer **doble clic** en el `.bat` para descargar la versión más reciente sin perder su información.

## Despliegue en Dokploy

Este proyecto está preparado para ser desplegado en Dokploy:
1. Asegúrate de configurar la variable `DATABASE_URL` en el panel de entorno de Dokploy.
2. Si usas PostgreSQL alojado en la misma instancia de Dokploy, puedes conectarte usando el host interno.

## Notas Adicionales

El sistema de estilos utiliza la nueva directiva `@theme inline` de Tailwind CSS v4, lo que significa que los colores y utilidades personalizados están declarados directamente en `src/app/globals.css`.
