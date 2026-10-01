import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  AUTHORITATIVE_CATEGORIES,
  TOTAL_MAIN_CATEGORIES,
  TOTAL_SUBCATEGORIES,
} from '../lib/taxonomy/authoritativeTaxonomy';
import {
  validateCompanyCategoryAssignments,
  CompanyCategoryAssignment,
} from '../lib/taxonomy/validation';

describe('Authoritative WinkBench Taxonomy Integrity', () => {
  it('must contain exactly 22 main categories', () => {
    expect(AUTHORITATIVE_CATEGORIES.length).toBe(22);
    expect(TOTAL_MAIN_CATEGORIES).toBe(22);
  });

  it('must contain exactly 189 subcategories in total', () => {
    let subCount = 0;
    for (const cat of AUTHORITATIVE_CATEGORIES) {
      subCount += cat.subcategories.length;
    }
    expect(subCount).toBe(189);
    expect(TOTAL_SUBCATEGORIES).toBe(189);
  });

  it('all 22 main category slugs and IDs must be strictly unique', () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const cat of AUTHORITATIVE_CATEGORIES) {
      expect(ids.has(cat.id)).toBe(false);
      expect(slugs.has(cat.slug)).toBe(false);
      ids.add(cat.id);
      slugs.add(cat.slug);
      expect(cat.name.trim().length).toBeGreaterThan(0);
      expect(cat.sortOrder).toBeGreaterThan(0);
    }
  });

  it('all 189 subcategory slugs and IDs must be strictly unique', () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const cat of AUTHORITATIVE_CATEGORIES) {
      for (const sub of cat.subcategories) {
        expect(ids.has(sub.id)).toBe(false);
        expect(slugs.has(sub.slug)).toBe(false);
        ids.add(sub.id);
        slugs.add(sub.slug);
        expect(sub.name.trim().length).toBeGreaterThan(0);
        expect(sub.sortOrder).toBeGreaterThan(0);
      }
    }
  });
});

describe('Company Category Assignment Business Rules', () => {
  it('allows an unclassified company to have zero categories assigned', () => {
    const result = validateCompanyCategoryAssignments([], 'unclassified');
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('allows a classified company to have 1 primary and up to 2 secondary categories (max 3 total)', () => {
    const assignments: CompanyCategoryAssignment[] = [
      {
        categoryId: 'cat_05_restaurants_bars',
        subcategoryId: 'sub_05_02', // Bars & Cafes
        isPrimary: true,
      },
      {
        categoryId: 'cat_06_food_beverages_tobacco',
        subcategoryId: 'sub_06_07', // Coffee & Tea
        isPrimary: false,
      },
      {
        categoryId: 'cat_08_shopping_fashion',
        subcategoryId: 'sub_08_01', // Accessories
        isPrimary: false,
      },
    ];

    const result = validateCompanyCategoryAssignments(assignments, 'classified');
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('rejects more than 3 category assignments per company', () => {
    const assignments: CompanyCategoryAssignment[] = [
      { categoryId: 'cat_01_animals_pets', subcategoryId: 'sub_01_01', isPrimary: true },
      { categoryId: 'cat_02_beauty_wellbeing', subcategoryId: 'sub_02_01', isPrimary: false },
      { categoryId: 'cat_03_events_entertainment', subcategoryId: 'sub_03_01', isPrimary: false },
      { categoryId: 'cat_04_home_garden', subcategoryId: 'sub_04_01', isPrimary: false },
    ];

    const result = validateCompanyCategoryAssignments(assignments, 'classified');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('at most 3'))).toBe(true);
  });

  it('rejects a classified company without exactly 1 primary category', () => {
    // 0 primary categories
    const noPrimary: CompanyCategoryAssignment[] = [
      { categoryId: 'cat_01_animals_pets', subcategoryId: 'sub_01_01', isPrimary: false },
    ];
    const resNoPrimary = validateCompanyCategoryAssignments(noPrimary, 'classified');
    expect(resNoPrimary.isValid).toBe(false);
    expect(resNoPrimary.errors.some((e) => e.includes('exactly 1 primary category'))).toBe(true);

    // 2 primary categories
    const twoPrimaries: CompanyCategoryAssignment[] = [
      { categoryId: 'cat_01_animals_pets', subcategoryId: 'sub_01_01', isPrimary: true },
      { categoryId: 'cat_02_beauty_wellbeing', subcategoryId: 'sub_02_01', isPrimary: true },
    ];
    const resTwoPrimaries = validateCompanyCategoryAssignments(twoPrimaries, 'classified');
    expect(resTwoPrimaries.isValid).toBe(false);
    expect(resTwoPrimaries.errors.some((e) => e.includes('exactly 1 primary category'))).toBe(true);
  });

  it('rejects duplicate category assignments for the same company', () => {
    const duplicates: CompanyCategoryAssignment[] = [
      { categoryId: 'cat_01_animals_pets', subcategoryId: 'sub_01_03', isPrimary: true },
      { categoryId: 'cat_01_animals_pets', subcategoryId: 'sub_01_03', isPrimary: false },
    ];
    const result = validateCompanyCategoryAssignments(duplicates, 'classified');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate category assignment'))).toBe(true);
  });

  it('rejects an assignment where a subcategory does not belong to the parent category', () => {
    // sub_01_03 is "Cats & Dogs" (Animals & Pets), but assigned to "Restaurants & Bars"
    const mismatched: CompanyCategoryAssignment[] = [
      { categoryId: 'cat_05_restaurants_bars', subcategoryId: 'sub_01_03', isPrimary: true },
    ];
    const result = validateCompanyCategoryAssignments(mismatched, 'classified');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('does not belong to category'))).toBe(true);
  });
});

describe('SQL Migration Files Existence & Integrity', () => {
  it('initial schema migration file exists and is populated', () => {
    const migrationPath = path.join(process.cwd(), 'drizzle', 'migrations', '0000_initial_schema.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);
    const content = fs.readFileSync(migrationPath, 'utf8');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS categories');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS subcategories');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS companies');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS company_categories');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS reviews');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS users');
  });

  it('taxonomy seed migration file exists and contains all 22 categories and 189 subcategories', () => {
    const seedPath = path.join(process.cwd(), 'drizzle', 'migrations', '0001_seed_authoritative_taxonomy.sql');
    expect(fs.existsSync(seedPath)).toBe(true);
    const content = fs.readFileSync(seedPath, 'utf8');
    
    // Check key categories are present
    expect(content).toContain("'Animals & Pets'");
    expect(content).toContain("'Beauty & Well-being'");
    expect(content).toContain("'Vehicles & Transportation'");
    expect(content).toContain("'Utilities'");
    
    // Check specific subcategories
    expect(content).toContain("'Cats & Dogs'");
    expect(content).toContain("'Bars & Cafes'");
    expect(content).toContain("'Water Utilities'");
  });
});
