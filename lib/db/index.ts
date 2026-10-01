import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

export * from './schema';

let pool: mysql.Pool | null = null;
let dbInstance: MySql2Database<typeof schema> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_HOST &&
    process.env.DATABASE_NAME &&
    process.env.DATABASE_USER &&
    process.env.DATABASE_PASSWORD
  );
}

export function getDatabasePool(): mysql.Pool | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    });
  }

  return pool;
}

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const p = getDatabasePool();
  if (!p) {
    return null;
  }

  dbInstance = drizzle(p, { schema, mode: 'default' });
  return dbInstance;
}
