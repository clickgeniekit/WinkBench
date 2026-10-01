import { Company, Review } from '@/types';
import { normalizeDomain } from '@/lib/utils/domain';
import { DEMO_COMPANIES, DEMO_REVIEWS } from '@/lib/demoData';

// Generates an unlisted company profile object directly for any domain in client components
export function createDefaultCompany(domainOrSlug: string): Company {
  const cleanInput = domainOrSlug.trim().toLowerCase();
  const normalized = normalizeDomain(cleanInput);

  // Check demo data first
  const existing = DEMO_COMPANIES.find((c) => {
    const companyClean = normalizeDomain(c.website || c.slug);
    return (
      c.slug.toLowerCase() === cleanInput ||
      c.slug.toLowerCase() === normalized ||
      companyClean === normalized ||
      c.website.toLowerCase().includes(normalized)
    );
  });

  if (existing) {
    return existing;
  }

  // Not listed yet: Generate dynamic default unlisted profile (Trustpilot style!)
  const isWww = cleanInput.startsWith('www.');
  const primaryDomain = isWww ? cleanInput.replace(/^www\./, '') : cleanInput;
  const displayName = isWww ? cleanInput : primaryDomain;

  return {
    id: `comp-${primaryDomain.replace(/[^a-z0-9-]/gi, '-')}`,
    name: displayName,
    slug: displayName,
    tagline: `Customer reviews and reputation for ${displayName}`,
    description: `${displayName} has an open business profile on WinkBench. If you have purchased products, contracted services, or dealt with this company, share your honest experience below to help global consumers.`,
    website: `https://${displayName}`,
    category: 'Business Services',
    categorySlug: 'business-services',
    country: 'International',
    countryCode: 'US',
    city: 'Global',
    isClaimed: false,
    isVerified: false,
    customerRating: 0,
    reviewCount: 0,
    trustScore: 50,
    trustScoreRating: 'Developing',
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
