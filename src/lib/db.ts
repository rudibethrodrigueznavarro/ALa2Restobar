import { Pool } from 'pg';

let pool: Pool;

if (!global.pgPool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Puedes descomentar la siguiente línea si usas SSL en Dokploy (ej. con Supabase o Neon)
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });
  if (process.env.NODE_ENV !== 'production') {
    global.pgPool = pool;
  }
} else {
  pool = global.pgPool;
}

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

// Declaración para mantener el pool en dev y que no se creen múltiples conexiones por HMR
declare global {
  var pgPool: Pool | undefined;
}
