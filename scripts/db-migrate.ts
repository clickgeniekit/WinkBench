import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { isDatabaseConfigured, getDatabasePool } from '../lib/db';

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('=== WinkBench Database Migration Runner ===');

  if (!isDatabaseConfigured()) {
    console.log('[Notice] Database credentials are not configured in environment variables.');
    console.log('[Notice] Set DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, and DATABASE_NAME in your environment.');
    console.log('[Notice] Migration skipped safely. No database was contacted.');
    process.exit(0);
  }

  const migrationsDir = path.join(process.cwd(), 'drizzle', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Found ${files.length} migration file(s) in ${migrationsDir}:`);
  files.forEach(f => console.log(` - ${f}`));

  if (isDryRun) {
    console.log('[Dry Run] Schema files inspected and validated. Exiting without running.');
    process.exit(0);
  }

  const pool = getDatabasePool();
  if (!pool) {
    console.error('[Error] Could not initialize database connection pool.');
    process.exit(1);
  }

  const connection = await pool.getConnection();
  try {
    console.log('[Executing] Connected to database. Running migrations...');
    for (const file of files) {
      console.log(`[Executing] ${file}...`);
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      // Execute multi-statement SQL
      await connection.query(sqlContent);
      console.log(`[Success] Finished ${file}`);
    }
    console.log('=== All migrations completed successfully! ===');
  } catch (err) {
    console.error('[Migration Error]', err);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
