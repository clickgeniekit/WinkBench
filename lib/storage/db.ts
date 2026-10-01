import fs from 'fs';
import path from 'path';
import { Company, Review, CompanyUpdate, ClaimRequest } from '@/types';
import { DEMO_COMPANIES, DEMO_REVIEWS, DEMO_UPDATES } from '@/lib/demoData';
import { normalizeDomain, isDomainQuery } from '@/lib/utils/domain';

export { normalizeDomain, isDomainQuery };

export interface CompanyAnnouncement {
  id: string;
  companySlug: string;
  title: string;
  content: string;
  publishedAt: string;
  authorName: string;
  priority?: 'normal' | 'important';
}

export interface CompanyArticle {
  id: string;
  companySlug: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt: string;
  authorName: string;
  category: string;
}

export interface DatabaseSchema {
  companies: Company[];
  reviews: Review[];
  announcements: CompanyAnnouncement[];
  articles: CompanyArticle[];
  claims: ClaimRequest[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'winkbench.json');

// Ensure database directory and file exist
function initializeDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        companies: DEMO_COMPANIES,
        reviews: DEMO_REVIEWS,
        announcements: [
          {
            id: 'ann-1',
            companySlug: 'aurora-payments-global',
            title: 'EUR and CAD local domestic clearing rails activated',
            content: 'We are pleased to announce direct domestic bank clearing for all merchant accounts operating across the United Kingdom, Canada, and European Union.',
            publishedAt: '2026-09-20T10:00:00Z',
            authorName: 'Aurora Operations Team',
            priority: 'important',
          },
          {
            id: 'ann-2',
            companySlug: 'nordicstack-cloud',
            title: 'Stockholm DC4 green energy expansion completed',
            content: 'All workloads in our Scandinavian cluster are now 100% powered by verified geothermal and wind power.',
            publishedAt: '2026-09-15T09:00:00Z',
            authorName: 'NordicStack Infrastructure',
            priority: 'normal',
          }
        ],
        articles: [
          {
            id: 'art-1',
            companySlug: 'aurora-payments-global',
            slug: 'how-to-reduce-chargebacks-in-2026',
            title: 'How Mid-Market Retailers Can Reduce Friendly Fraud and Chargebacks',
            summary: 'An operational blueprint for multi-currency fraud defense and 3D-Secure 2.2 optimization.',
            content: 'Chargeback prevention starts with crystal-clear billing descriptors, instant automated refund portals, and pre-arbitration webhook notifications...',
            publishedAt: '2026-09-10T12:00:00Z',
            authorName: 'Marcus Vance, Head of Risk',
            category: 'Fintech & Risk Management',
          }
        ],
        claims: [
          {
            id: 'claim-1',
            companyId: 'comp-apex-legal',
            companyName: 'Apex Global Immigration Law',
            applicantName: 'Elena Rostova',
            workEmail: 'elena@apexlegalaustin.example.ca',
            roleInCompany: 'Managing Partner',
            phone: '+1 416 555 7890',
            status: 'pending_review',
            submittedAt: '2026-09-28T14:00:00Z',
          }
        ],
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error initializing database, using in-memory fallback:', error);
    return {
      companies: DEMO_COMPANIES,
      reviews: DEMO_REVIEWS,
      announcements: [],
      articles: [],
      claims: [],
    };
  }
}

function writeDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write to database file:', error);
  }
}

// Trustpilot-style Dynamic Auto-Profile creation for ANY domain
export function getOrCreateCompany(domainOrSlug: string): Company {
  const db = initializeDatabase();
  const cleanInput = domainOrSlug.trim().toLowerCase();
  const normalized = normalizeDomain(cleanInput);

  // Check if exists by exact slug, name, or website domain
  const existing = db.companies.find((c) => {
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

  // Not listed yet: Automatically create a permanent default Trustpilot-style unlisted profile!
  const isWww = cleanInput.startsWith('www.');
  const primaryDomain = isWww ? cleanInput.replace(/^www\./, '') : cleanInput;
  const displayName = isWww ? cleanInput : primaryDomain;

  const newCompany: Company = {
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

  db.companies.push(newCompany);
  writeDatabase(db);
  return newCompany;
}

export function getAllCompanies(): Company[] {
  const db = initializeDatabase();
  return db.companies;
}

export function getCompanyReviews(companySlug: string): Review[] {
  const db = initializeDatabase();
  const normalized = normalizeDomain(companySlug);
  return db.reviews.filter((r) => {
    const revNorm = normalizeDomain(r.companySlug);
    return r.companySlug === companySlug || revNorm === normalized;
  });
}

export function getAllReviews(): Review[] {
  const db = initializeDatabase();
  return db.reviews;
}

export function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'status'>): Review {
  const db = initializeDatabase();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    helpfulCount: 0,
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);

  // Recalculate company rating and review count
  const company = db.companies.find((c) => c.slug === reviewData.companySlug);
  if (company) {
    const compReviews = db.reviews.filter((r) => r.companySlug === reviewData.companySlug);
    const totalRating = compReviews.reduce((sum, r) => sum + r.rating, 0);
    company.reviewCount = compReviews.length;
    company.customerRating = parseFloat((totalRating / compReviews.length).toFixed(1));

    // Update distribution
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    compReviews.forEach((r) => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (dist[star] !== undefined) dist[star]++;
    });
    company.ratingDistribution = dist;
    company.updatedAt = new Date().toISOString();
  }

  writeDatabase(db);
  return newReview;
}

export function addBusinessReply(reviewId: string, responderName: string, responderRole: string, content: string): boolean {
  const db = initializeDatabase();
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review) return false;

  review.reply = {
    id: `rep-${Date.now()}`,
    reviewId,
    companyId: review.companyId,
    responderName,
    responderRole,
    content,
    createdAt: new Date().toISOString(),
  };

  writeDatabase(db);
  return true;
}

export function getCompanyAnnouncements(companySlug: string): CompanyAnnouncement[] {
  const db = initializeDatabase();
  const normalized = normalizeDomain(companySlug);
  return db.announcements.filter((a) => normalizeDomain(a.companySlug) === normalized);
}

export function addCompanyAnnouncement(announcement: Omit<CompanyAnnouncement, 'id' | 'publishedAt'>): CompanyAnnouncement {
  const db = initializeDatabase();
  const newAnn: CompanyAnnouncement = {
    ...announcement,
    id: `ann-${Date.now()}`,
    publishedAt: new Date().toISOString(),
  };
  db.announcements.unshift(newAnn);
  writeDatabase(db);
  return newAnn;
}

export function getCompanyArticles(companySlug: string): CompanyArticle[] {
  const db = initializeDatabase();
  const normalized = normalizeDomain(companySlug);
  return db.articles.filter((a) => normalizeDomain(a.companySlug) === normalized);
}

export function addCompanyArticle(article: Omit<CompanyArticle, 'id' | 'publishedAt'>): CompanyArticle {
  const db = initializeDatabase();
  const newArt: CompanyArticle = {
    ...article,
    id: `art-${Date.now()}`,
    publishedAt: new Date().toISOString(),
  };
  db.articles.unshift(newArt);
  writeDatabase(db);
  return newArt;
}

export function submitClaimRequest(claim: Omit<ClaimRequest, 'id' | 'status' | 'submittedAt'>): ClaimRequest {
  const db = initializeDatabase();
  const newClaim: ClaimRequest = {
    ...claim,
    id: `claim-${Date.now()}`,
    status: 'pending_review',
    submittedAt: new Date().toISOString(),
  };
  db.claims.unshift(newClaim);
  writeDatabase(db);
  return newClaim;
}

export function getClaimRequests(): ClaimRequest[] {
  const db = initializeDatabase();
  return db.claims;
}

export function approveClaimRequest(claimId: string): boolean {
  const db = initializeDatabase();
  const claim = db.claims.find((c) => c.id === claimId);
  if (!claim) return false;

  claim.status = 'approved';

  // Mark company as claimed and verified
  const company = db.companies.find((c) => c.id === claim.companyId || c.slug === claim.companyName || normalizeDomain(c.slug) === normalizeDomain(claim.companyName));
  if (company) {
    company.isClaimed = true;
    company.isVerified = true;
    company.claimedByUserId = claim.applicantName;
    company.updatedAt = new Date().toISOString();
  }

  writeDatabase(db);
  return true;
}

export function updateCompanyDetails(companySlug: string, updates: Partial<Company>): boolean {
  const db = initializeDatabase();
  const company = db.companies.find((c) => c.slug === companySlug || normalizeDomain(c.slug) === normalizeDomain(companySlug));
  if (!company) return false;

  // Protect sensitive fields from unverified changes
  if (updates.name) company.name = updates.name;
  if (updates.tagline) company.tagline = updates.tagline;
  if (updates.description) company.description = updates.description;
  if (updates.category) company.category = updates.category;
  if (updates.categorySlug) company.categorySlug = updates.categorySlug;
  if (updates.website) company.website = updates.website;
  if (updates.phone) company.phone = updates.phone;
  if (updates.email) company.email = updates.email;
  if (updates.address) company.address = updates.address;
  if (updates.city) company.city = updates.city;
  if (updates.country) company.country = updates.country;
  if (updates.countryCode) company.countryCode = updates.countryCode;

  company.updatedAt = new Date().toISOString();
  writeDatabase(db);
  return true;
}
