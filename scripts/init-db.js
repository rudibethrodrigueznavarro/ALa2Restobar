const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      // Ignorar comentarios y líneas vacías
      if (line.trim().startsWith('#') || !line.includes('=')) return;
      const [key, ...valueParts] = line.split('=');
      const val = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && val) {
        process.env[key.trim()] = val;
      }
    });
  }
}

async function main() {
  // Cargar variables de entorno locales si existen (.env o .env.production) para testing local
  loadEnvFile(path.join(__dirname, '../.env'));
  loadEnvFile(path.join(__dirname, '../.env.production'));

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Error: DATABASE_URL no encontrada en el entorno.");
    process.exit(1);
  }

  const client = new Client({ connectionString });

  // 1. Reintentar conexión si Postgres aún no está listo (ej. al levantar docker compose)
  let retries = 10;
  let connected = false;
  console.log("Intentando conectar a PostgreSQL...");
  while (retries > 0 && !connected) {
    try {
      await client.connect();
      connected = true;
      console.log("¡Conexión establecida con éxito a la base de datos!");
    } catch (err) {
      retries -= 1;
      console.log(`La base de datos aún no está lista. Reintentando en 5 segundos... (Intentos restantes: ${retries})`);
      if (retries === 0) {
        console.error("No se pudo conectar a la base de datos:", err);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  try {
    // 2. Ejecutar schema.sql base
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log("Aplicando schema.sql...");
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
    } else {
      console.warn("Advertencia: No se encontró schema.sql en", schemaPath);
    }

    // 3. Ejecutar admin_schema.sql
    const adminSchemaPath = path.join(__dirname, '../database/admin_schema.sql');
    if (fs.existsSync(adminSchemaPath)) {
      console.log("Aplicando admin_schema.sql...");
      const adminSchemaSql = fs.readFileSync(adminSchemaPath, 'utf8');
      await client.query(adminSchemaSql);
    } else {
      console.warn("Advertencia: No se encontró admin_schema.sql en", adminSchemaPath);
    }

    // 4. Configurar administrador dinámico si se proporcionaron credenciales
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminUsername && adminPassword) {
      console.log(`Configurando administrador dinámico: "${adminUsername}"...`);
      const passwordHash = sha256(adminPassword);
      
      await client.query(`
        INSERT INTO users (username, password_hash, role)
        VALUES ($1, $2, 'admin')
        ON CONFLICT (username)
        DO UPDATE SET password_hash = EXCLUDED.password_hash;
      `, [adminUsername, passwordHash]);
      
      console.log("¡Usuario administrador dinámico asegurado con éxito!");
    } else {
      console.warn("Aviso: ADMIN_USERNAME o ADMIN_PASSWORD no definidos. No se configuró ningún administrador dinámico.");
    }

  } catch (error) {
    console.error("Error durante la inicialización de la base de datos:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
