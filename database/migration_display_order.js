const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  // Cargar variables de entorno manualmente desde .env
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*DATABASE_URL\s*=\s*["']?(.*?)["']?\s*$/);
      if (match) {
        process.env.DATABASE_URL = match[1];
      }
    });
  }

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL variable de entorno no encontrada en .env");
    process.exit(1);
  }

  console.log("Conectando a la base de datos PostgreSQL...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  console.log("¡Conexión establecida con éxito!");
  
  console.log("Ejecutando alteración de tabla categories para agregar display_order...");
  await client.query("ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;");
  console.log("Columna display_order añadida.");

  console.log("Inicializando display_order de forma secuencial basada en ID...");
  const initSql = `
    WITH ordered_categories AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) as rn
        FROM categories
    )
    UPDATE categories
    SET display_order = ordered_categories.rn
    FROM ordered_categories
    WHERE categories.id = ordered_categories.id;
  `;
  await client.query(initSql);
  console.log("Orden secuencial inicializado con éxito.");
  
  await client.end();
  console.log("Migración completada.");
}

main().catch(err => {
  console.error("Error al ejecutar la migración:", err);
  process.exit(1);
});
