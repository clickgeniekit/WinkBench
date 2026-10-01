import { z } from 'zod';
import { AUTHORITATIVE_CATEGORIES } from './authoritativeTaxonomy';
import { normalizeDomain, isDomainQuery } from '../utils/domain';

// Map of categoryId -> Set of valid subcategoryIds for instant lookups
const categorySubcategoryMap = new Map<string, Set<string>>();
const allCategoryIds = new Set<string>();
const allSubcategoryIds = new Set<string>();

for (const cat of AUTHORITATIVE_CATEGORIES) {
  allCategoryIds.add(cat.id);
  const subIds = new Set<string>();
  for (const sub of cat.subcategories) {
    subIds.add(sub.id);
    allSubcategoryIds.add(sub.id);
  }
  categorySubcategoryMap.set(cat.id, subIds);
}

/**
 * Individual Category Assignment for a company
 */
export const CompanyCategoryAssignmentSchema = z.object({
  categoryId: z.string().refine((id) => allCategoryIds.has(id), {
    message: 'Invalid categoryId: must match an authoritative main category.',
  }),
  subcategoryId: z.string().nullable().optional(),
  isPrimary: z.boolean(),
});

export type CompanyCategoryAssignment = z.infer<typeof CompanyCategoryAssignmentSchema>;

/**
 * Validation function for a company's complete category assignment set
 * Enforces:
 * 1. Maximum of 3 total assignments (1 primary + max 2 secondary).
 * 2. Exactly 1 primary assignment if classified.
 * 3. No duplicate assignments.
 * 4. Subcategory must strictly belong to the specified category.
 */
export function validateCompanyCategoryAssignments(
  assignments: CompanyCategoryAssignment[],
  classificationStatus: 'unclassified' | 'pending_review' | 'classified'
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // For unclassified companies, empty assignments is valid and expected
  if (classificationStatus === 'unclassified' || classificationStatus === 'pending_review') {
    if (assignments.length === 0) {
      return { isValid: true, errors: [] };
    }
  }

  // 1. Max 3 assignments
  if (assignments.length > 3) {
    errors.push(`A company can have at most 3 category assignments (1 primary and up to 2 secondary). Received ${assignments.length}.`);
  }

  // 2. Exactly 1 primary category when classified
  const primaryCount = assignments.filter((a) => a.isPrimary).length;
  if (classificationStatus === 'classified') {
    if (primaryCount !== 1) {
      errors.push(`A classified company must have exactly 1 primary category. Found ${primaryCount}.`);
    }
  } else {
    // If not yet classified, at most 1 primary
    if (primaryCount > 1) {
      errors.push(`A company cannot have more than 1 primary category.`);
    }
  }

  // 3. No duplicates & parent-child validation
  const seenCombos = new Set<string>();

  for (const a of assignments) {
    const key = `${a.categoryId}:${a.subcategoryId || 'none'}`;
    if (seenCombos.has(key)) {
      errors.push(`Duplicate category assignment detected for ${key}.`);
    }
    seenCombos.add(key);

    // Verify subcategory belongs to category
    if (a.subcategoryId) {
      const allowedSubs = categorySubcategoryMap.get(a.categoryId);
      if (!allowedSubs || !allowedSubs.has(a.subcategoryId)) {
        errors.push(`Subcategory "${a.subcategoryId}" does not belong to category "${a.categoryId}".`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export { normalizeDomain, isDomainQuery };
