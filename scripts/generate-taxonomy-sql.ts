import fs from 'fs';
import path from 'path';
import { AUTHORITATIVE_CATEGORIES } from '../lib/taxonomy/authoritativeTaxonomy';

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

let sql = `-- ============================================================================
-- WinkBench MySQL Migration 0001: Seed Authoritative Taxonomy
-- 22 Main Categories and 189 Subcategories strictly preserved
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Insert 22 Main Categories
INSERT INTO categories (id, name, slug, icon_name, sort_order, is_active) VALUES
`;

const catValues: string[] = [];
for (const cat of AUTHORITATIVE_CATEGORIES) {
  catValues.push(
    `('${cat.id}', '${escapeSql(cat.name)}', '${cat.slug}', '${cat.iconName}', ${cat.sortOrder}, 1)`
  );
}

sql += catValues.join(',\n') + `
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  slug = VALUES(slug),
  icon_name = VALUES(icon_name),
  sort_order = VALUES(sort_order),
  is_active = VALUES(is_active);

-- 2. Insert 189 Subcategories
INSERT INTO subcategories (id, category_id, name, slug, sort_order, is_active) VALUES
`;

const subValues: string[] = [];
for (const cat of AUTHORITATIVE_CATEGORIES) {
  for (const sub of cat.subcategories) {
    subValues.push(
      `('${sub.id}', '${cat.id}', '${escapeSql(sub.name)}', '${sub.slug}', ${sub.sortOrder}, 1)`
    );
  }
}

sql += subValues.join(',\n') + `
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  slug = VALUES(slug),
  sort_order = VALUES(sort_order),
  is_active = VALUES(is_active);

SET FOREIGN_KEY_CHECKS = 1;
`;

const outPath = path.join(process.cwd(), 'drizzle', 'migrations', '0001_seed_authoritative_taxonomy.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated taxonomy seed SQL at ${outPath}`);
console.log(`Total categories: ${AUTHORITATIVE_CATEGORIES.length}`);
console.log(`Total subcategories: ${subValues.length}`);
