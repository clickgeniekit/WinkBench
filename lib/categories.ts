import {
  AUTHORITATIVE_CATEGORIES,
  AuthoritativeCategory,
  AuthoritativeSubcategory,
} from './taxonomy/authoritativeTaxonomy';

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  subcategories: string[];
  subcategoriesDetailed: AuthoritativeSubcategory[];
  companyCount: number;
}

/**
 * Single Source of Truth for frontend categories:
 * Derived directly from the authoritative 22 main categories and 189 subcategories.
 */
export const GLOBAL_CATEGORIES: CategoryDetail[] = AUTHORITATIVE_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  iconName: cat.iconName || 'Building2',
  description: `Find top-rated businesses, verified reviews, and customer ratings in ${cat.name}.`,
  subcategories: cat.subcategories.map((s) => s.name),
  subcategoriesDetailed: cat.subcategories,
  companyCount: 0,
}));

export function getCategoryBySlug(slug: string): CategoryDetail | undefined {
  return GLOBAL_CATEGORIES.find((c) => c.slug === slug);
}
