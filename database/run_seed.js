const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  // Cargar variables de entorno manualmente si no se cargan automáticamente
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
  
  const sqlPath = path.join(__dirname, 'seed_resto_bar.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log("Ejecutando script de siembra (seed_resto_bar.sql)...");
  await client.query(sql);
  console.log("¡Script de siembra ejecutado con éxito en la base de datos!");
  
  await client.end();
}

main().catch(err => {
  console.error("Error ejecutando la siembra de la base de datos:", err);
  process.exit(1);
});
