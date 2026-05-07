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

## Despliegue en Dokploy

Este proyecto está preparado para ser desplegado en Dokploy:
1. Asegúrate de configurar la variable `DATABASE_URL` en el panel de entorno de Dokploy.
2. Si usas PostgreSQL alojado en la misma instancia de Dokploy, puedes conectarte usando el host interno.

## Notas Adicionales

El sistema de estilos utiliza la nueva directiva `@theme inline` de Tailwind CSS v4, lo que significa que los colores y utilidades personalizados están declarados directamente en `src/app/globals.css`.
