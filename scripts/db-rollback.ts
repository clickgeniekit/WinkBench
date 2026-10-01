import mysql from 'mysql2/promise';
import { isDatabaseConfigured, getDatabasePool } from '../lib/db';

async function main() {
  console.log('=== WinkBench Database Rollback Runner ===');

  if (!isDatabaseConfigured()) {
    console.log('[Notice] Database credentials are not configured in environment variables.');
    console.log('[Notice] Rollback skipped safely. No database was contacted.');
    process.exit(0);
  }

  const pool = getDatabasePool();
  if (!pool) {
    console.error('[Error] Could not initialize database connection pool.');
    process.exit(1);
  }

  const connection = await pool.getConnection();
  try {
    console.log('[Executing] Connected to database. Dropping tables in reverse order...');
    
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    const tables = [
      'audit_logs',
      'slug_redirects',
      'review_reports',
      'company_articles',
      'company_announcements',
      'company_claims',
      'review_replies',
      'reviews',
      'user_sessions',
      'users',
      'company_categories',
      'company_domains',
      'companies',
      'subcategories',
      'categories',
    ];

    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS ${table};`);
      console.log(`[Dropped] Table ${table}`);
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('=== Rollback completed cleanly. Database is restored. ===');
  } catch (err) {
    console.error('[Rollback Error]', err);
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
