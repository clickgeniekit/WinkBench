import fs from 'fs';
import path from 'path';
import {
  Company,
  Review,
  ClaimRequest,
  UserAccount,
  UserSessionRecord,
  InAppNotification,
  ReviewReport,
  AuditLogEntry,
} from '../../types';
import { DEMO_COMPANIES, DEMO_REVIEWS } from '../demoData';
import { normalizeDomain, isDomainQuery } from '../utils/domain';
import { hashPassword } from '../auth/password';

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

export interface PasswordResetTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  companies: Company[];
  reviews: Review[];
  announcements: CompanyAnnouncement[];
  articles: CompanyArticle[];
  claims: ClaimRequest[];
  users: UserAccount[];
  sessions: UserSessionRecord[];
  notifications: InAppNotification[];
  reviewReports: ReviewReport[];
  auditLogs: AuditLogEntry[];
  resetTokens: PasswordResetTokenRecord[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'winkbench.json');

function getDefaultUsers(): UserAccount[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'usr-admin-bootstrap',
      email: 'admin@winkbench.com',
      displayName: 'WinkBench Administrator',
      passwordHash: hashPassword('WinkBenchAdmin2026!'),
      role: 'admin',
      countryCode: 'US',
      isEmailVerified: true,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'usr-alex-morris',
      email: 'alex.morris@example.com',
      displayName: 'Alex Morris',
      passwordHash: hashPassword('WinkBenchUser2026!'),
      role: 'user',
      countryCode: 'US',
      isEmailVerified: true,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'usr-elena-rostova',
      email: 'elena@apexlegalaustin.example.ca',
      displayName: 'Elena Rostova',
      passwordHash: hashPassword('WinkBenchOwner2026!'),
      role: 'company_owner',
      countryCode: 'CA',
      isEmailVerified: true,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// Ensure database directory and file exist
export function initializeDatabase(): DatabaseSchema {
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
            content:
              'We are pleased to announce direct domestic bank clearing for all merchant accounts operating across the United Kingdom, Canada, and European Union.',
            publishedAt: '2026-09-20T10:00:00Z',
            authorName: 'Aurora Operations Team',
            priority: 'important',
          },
          {
            id: 'ann-2',
            companySlug: 'nordicstack-cloud',
            title: 'Stockholm DC4 green energy expansion completed',
            content:
              'All workloads in our Scandinavian cluster are now 100% powered by verified geothermal and wind power.',
            publishedAt: '2026-09-15T09:00:00Z',
            authorName: 'NordicStack Infrastructure',
            priority: 'normal',
          },
        ],
        articles: [
          {
            id: 'art-1',
            companySlug: 'aurora-payments-global',
            slug: 'how-to-reduce-chargebacks-in-2026',
            title: 'How Mid-Market Retailers Can Reduce Friendly Fraud and Chargebacks',
            summary:
              'An operational blueprint for multi-currency fraud defense and 3D-Secure 2.2 optimization.',
            content:
              'Chargeback prevention starts with crystal-clear billing descriptors, instant automated refund portals, and pre-arbitration webhook notifications...',
            publishedAt: '2026-09-10T12:00:00Z',
            authorName: 'Marcus Vance, Head of Risk',
            category: 'Fintech & Risk Management',
          },
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
          },
        ],
        users: getDefaultUsers(),
        sessions: [],
        notifications: [],
        reviewReports: [],
        auditLogs: [],
        resetTokens: [],
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf8');
    const db = JSON.parse(fileContent) as DatabaseSchema;

    // Ensure collections exist if upgrading older data
    let modified = false;
    if (!db.companies) { db.companies = DEMO_COMPANIES; modified = true; }
    if (!db.reviews) { db.reviews = DEMO_REVIEWS; modified = true; }
    if (!db.announcements) { db.announcements = []; modified = true; }
    if (!db.articles) { db.articles = []; modified = true; }
    if (!db.claims) { db.claims = []; modified = true; }
    if (!db.users || db.users.length === 0) { db.users = getDefaultUsers(); modified = true; }
    if (!db.sessions) { db.sessions = []; modified = true; }
    if (!db.notifications) { db.notifications = []; modified = true; }
    if (!db.reviewReports) { db.reviewReports = []; modified = true; }
    if (!db.auditLogs) { db.auditLogs = []; modified = true; }
    if (!db.resetTokens) { db.resetTokens = []; modified = true; }

    if (modified) {
      writeDatabase(db);
    }

    return db;
  } catch (error) {
    console.error('Error initializing database, using in-memory fallback:', error);
    return {
      companies: DEMO_COMPANIES,
      reviews: DEMO_REVIEWS,
      announcements: [],
      articles: [],
      claims: [],
      users: getDefaultUsers(),
      sessions: [],
      notifications: [],
      reviewReports: [],
      auditLogs: [],
      resetTokens: [],
    };
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write to database file:', error);
  }
}

// -------------------------------------------------------------
// USER & AUTH OPERATIONS
// -------------------------------------------------------------

export function findUserByEmail(email: string): UserAccount | null {
  const db = initializeDatabase();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function findUserById(id: string): UserAccount | null {
  const db = initializeDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export function createUser(userData: {
  email: string;
  passwordHash: string;
  displayName: string;
  role?: 'user' | 'company_owner' | 'moderator' | 'admin';
  countryCode?: string;
  avatarUrl?: string;
}): UserAccount {
  const db = initializeDatabase();
  const now = new Date().toISOString();
  const newUser: UserAccount = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: userData.email.trim().toLowerCase(),
    passwordHash: userData.passwordHash,
    displayName: userData.displayName.trim(),
    role: userData.role || 'user',
    countryCode: userData.countryCode || 'US',
    avatarUrl: userData.avatarUrl,
    isEmailVerified: true,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<UserAccount>): boolean {
  const db = initializeDatabase();
  const user = db.users.find((u) => u.id === id);
  if (!user) return false;

  if (updates.displayName !== undefined) user.displayName = updates.displayName;
  if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
  if (updates.countryCode !== undefined) user.countryCode = updates.countryCode;
  if (updates.passwordHash !== undefined) user.passwordHash = updates.passwordHash;
  if (updates.role !== undefined) user.role = updates.role;
  if (updates.status !== undefined) user.status = updates.status;
  if (updates.isEmailVerified !== undefined) user.isEmailVerified = updates.isEmailVerified;

  user.updatedAt = new Date().toISOString();
  writeDatabase(db);
  return true;
}

export function getAllUsers(): UserAccount[] {
  const db = initializeDatabase();
  return db.users;
}

// -------------------------------------------------------------
// SESSION OPERATIONS
// -------------------------------------------------------------

export function createSession(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
  ipAddress?: string,
  userAgent?: string
): UserSessionRecord {
  const db = initializeDatabase();
  const session: UserSessionRecord = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    tokenHash,
    ipAddress,
    userAgent,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  // Clean old expired sessions
  db.sessions = db.sessions.filter((s) => new Date(s.expiresAt) > new Date());
  db.sessions.push(session);
  writeDatabase(db);
  return session;
}

export function findSessionByTokenHash(tokenHash: string): {
  session: UserSessionRecord;
  user: UserAccount;
} | null {
  const db = initializeDatabase();
  const session = db.sessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) {
    deleteSession(tokenHash);
    return null;
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return null;

  return { session, user };
}

export function deleteSession(tokenHash: string): boolean {
  const db = initializeDatabase();
  const initialLength = db.sessions.length;
  db.sessions = db.sessions.filter((s) => s.tokenHash !== tokenHash);
  if (db.sessions.length !== initialLength) {
    writeDatabase(db);
    return true;
  }
  return false;
}

export function deleteUserSessions(userId: string): boolean {
  const db = initializeDatabase();
  db.sessions = db.sessions.filter((s) => s.userId !== userId);
  writeDatabase(db);
  return true;
}

// -------------------------------------------------------------
// NOTIFICATIONS
// -------------------------------------------------------------

export function getUserNotifications(userId: string): InAppNotification[] {
  const db = initializeDatabase();
  return db.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNotification(
  userId: string,
  title: string,
  message: string,
  type: 'review' | 'reply' | 'claim' | 'moderation' | 'system' = 'system',
  link?: string
): InAppNotification {
  const db = initializeDatabase();
  const notification: InAppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    title,
    message,
    type,
    link,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db.notifications.unshift(notification);
  writeDatabase(db);
  return notification;
}

export function markNotificationAsRead(id: string, userId: string): boolean {
  const db = initializeDatabase();
  const notif = db.notifications.find((n) => n.id === id && n.userId === userId);
  if (!notif) return false;
  notif.isRead = true;
  writeDatabase(db);
  return true;
}

export function markAllNotificationsAsRead(userId: string): boolean {
  const db = initializeDatabase();
  db.notifications.forEach((n) => {
    if (n.userId === userId) n.isRead = true;
  });
  writeDatabase(db);
  return true;
}

// -------------------------------------------------------------
// COMPANY PROFILE & DOMAIN OPERATIONS
// -------------------------------------------------------------

export function getOrCreateCompany(domainOrSlug: string): Company {
  const db = initializeDatabase();
  const cleanInput = domainOrSlug.trim().toLowerCase();
  const normalized = normalizeDomain(cleanInput);

  const existing = db.companies.find((c) => {
    const companyClean = normalizeDomain(c.website || c.slug);
    return (
      c.slug.toLowerCase() === cleanInput ||
      c.name.toLowerCase() === cleanInput ||
      companyClean === normalized
    );
  });

  if (existing) {
    return existing;
  }

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
    category: 'Unclassified',
    categorySlug: 'unclassified',
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

export function getCompanyBySlug(slug: string): Company | null {
  const db = initializeDatabase();
  const normalized = normalizeDomain(slug);
  return (
    db.companies.find(
      (c) =>
        c.slug.toLowerCase() === slug.toLowerCase() ||
        normalizeDomain(c.slug) === normalized ||
        normalizeDomain(c.website || '') === normalized
    ) || null
  );
}

export function updateCompanyDetails(companySlug: string, updates: Partial<Company>): boolean {
  const db = initializeDatabase();
  const company = db.companies.find(
    (c) => c.slug === companySlug || normalizeDomain(c.slug) === normalizeDomain(companySlug)
  );
  if (!company) return false;

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

export function updateCompanyClassification(
  companySlug: string,
  category: string,
  categorySlug: string
): boolean {
  const db = initializeDatabase();
  const company = db.companies.find(
    (c) => c.slug === companySlug || normalizeDomain(c.slug) === normalizeDomain(companySlug)
  );
  if (!company) return false;

  company.category = category;
  company.categorySlug = categorySlug;
  company.updatedAt = new Date().toISOString();
  writeDatabase(db);
  return true;
}

// -------------------------------------------------------------
// REVIEWS & RATINGS
// -------------------------------------------------------------

export function getCompanyReviews(companySlug: string): Review[] {
  const db = initializeDatabase();
  const normalized = normalizeDomain(companySlug);
  return db.reviews
    .filter((r) => {
      const revNorm = normalizeDomain(r.companySlug);
      return (
        (r.companySlug === companySlug || revNorm === normalized) &&
        r.status !== 'removed'
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUserReviews(userId: string): Review[] {
  const db = initializeDatabase();
  return db.reviews
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllReviews(): Review[] {
  const db = initializeDatabase();
  return db.reviews;
}

export function addReview(
  reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'status'> & {
    status?: 'published' | 'pending_moderation' | 'reported' | 'removed';
  }
): Review {
  const db = initializeDatabase();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    helpfulCount: 0,
    status: reviewData.status || 'published',
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);

  // Recalculate company rating and review count
  recalculateCompanyRating(db, reviewData.companySlug);

  // If review is on a claimed company, notify company owner
  const company = db.companies.find((c) => c.slug === reviewData.companySlug);
  if (company && company.claimedByUserId) {
    const ownerUser = db.users.find(
      (u) => u.displayName === company.claimedByUserId || u.id === company.claimedByUserId
    );
    if (ownerUser) {
      addNotification(
        ownerUser.id,
        'New Customer Review Received',
        `A customer submitted a ${reviewData.rating}-star review for ${company.name}.`,
        'review',
        `/company/${company.slug}`
      );
    }
  }

  writeDatabase(db);
  return newReview;
}

export function deleteReview(id: string, userId?: string, isAdmin = false): boolean {
  const db = initializeDatabase();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) return false;

  // Authorization check
  if (!isAdmin && userId && review.userId !== userId) {
    return false;
  }

  const companySlug = review.companySlug;
  db.reviews = db.reviews.filter((r) => r.id !== id);

  recalculateCompanyRating(db, companySlug);
  writeDatabase(db);
  return true;
}

export function updateReviewStatus(
  id: string,
  status: 'published' | 'pending_moderation' | 'reported' | 'removed'
): boolean {
  const db = initializeDatabase();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) return false;

  review.status = status;
  review.updatedAt = new Date().toISOString();

  recalculateCompanyRating(db, review.companySlug);
  writeDatabase(db);
  return true;
}

export function addBusinessReply(
  reviewId: string,
  responderName: string,
  responderRole: string,
  content: string
): boolean {
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

  // Notify review author
  if (review.userId) {
    addNotification(
      review.userId,
      'Company Replied to Your Review',
      `${responderName} (${responderRole}) posted a response to your review.`,
      'reply',
      `/company/${review.companySlug}`
    );
  }

  writeDatabase(db);
  return true;
}

function recalculateCompanyRating(db: DatabaseSchema, companySlug: string): void {
  const company = db.companies.find(
    (c) => c.slug === companySlug || normalizeDomain(c.slug) === normalizeDomain(companySlug)
  );
  if (!company) return;

  const publishedReviews = db.reviews.filter(
    (r) =>
      (r.companySlug === companySlug ||
        normalizeDomain(r.companySlug) === normalizeDomain(companySlug)) &&
      r.status === 'published'
  );

  company.reviewCount = publishedReviews.length;

  if (publishedReviews.length === 0) {
    company.customerRating = 0;
    company.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    company.trustScore = 50;
    company.trustScoreRating = 'Developing';
  } else {
    const totalRating = publishedReviews.reduce((sum, r) => sum + r.rating, 0);
    company.customerRating = parseFloat((totalRating / publishedReviews.length).toFixed(1));

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach((r) => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (dist[star] !== undefined) dist[star]++;
    });
    company.ratingDistribution = dist;

    // WinkBench Dual-Metric Trust Score:
    // Bayesian blend of volume, average score, and recency
    const baseScore = company.customerRating * 20; // 0 to 100
    const volumeFactor = Math.min(publishedReviews.length * 2, 20); // up to +20 for 10+ reviews
    company.trustScore = Math.min(Math.round(baseScore * 0.8 + volumeFactor), 98);

    if (company.trustScore >= 80) company.trustScoreRating = 'High';
    else if (company.trustScore >= 65) company.trustScoreRating = 'Good';
    else if (company.trustScore >= 50) company.trustScoreRating = 'Fair';
    else if (company.trustScore >= 35) company.trustScoreRating = 'Developing';
    else company.trustScoreRating = 'Caution';
  }

  company.updatedAt = new Date().toISOString();
}

// -------------------------------------------------------------
// REVIEW REPORTS
// -------------------------------------------------------------

export function addReviewReport(
  reviewId: string,
  reporterUserId: string,
  reason: string,
  notes?: string
): ReviewReport {
  const db = initializeDatabase();
  const report: ReviewReport = {
    id: `rep-flag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    reviewId,
    reporterUserId,
    reason,
    notes,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  db.reviewReports.unshift(report);

  // Mark review as reported
  const review = db.reviews.find((r) => r.id === reviewId);
  if (review && review.status === 'published') {
    review.status = 'reported';
  }

  writeDatabase(db);
  return report;
}

export function getReviewReports(): ReviewReport[] {
  const db = initializeDatabase();
  return db.reviewReports;
}

export function updateReviewReportStatus(
  id: string,
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
): boolean {
  const db = initializeDatabase();
  const report = db.reviewReports.find((r) => r.id === id);
  if (!report) return false;
  report.status = status;
  writeDatabase(db);
  return true;
}

// -------------------------------------------------------------
// ANNOUNCEMENTS & ARTICLES
// -------------------------------------------------------------

export function getCompanyAnnouncements(companySlug: string): CompanyAnnouncement[] {
  const db = initializeDatabase();
  const normalized = normalizeDomain(companySlug);
  return db.announcements.filter((a) => normalizeDomain(a.companySlug) === normalized);
}

export function addCompanyAnnouncement(
  announcement: Omit<CompanyAnnouncement, 'id' | 'publishedAt'>
): CompanyAnnouncement {
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

export function addCompanyArticle(
  article: Omit<CompanyArticle, 'id' | 'publishedAt'>
): CompanyArticle {
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

// -------------------------------------------------------------
// CLAIMS & BUSINESS VERIFICATION
// -------------------------------------------------------------

export function submitClaimRequest(
  claim: Omit<ClaimRequest, 'id' | 'status' | 'submittedAt'>
): ClaimRequest {
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

export function updateClaimStatus(
  claimId: string,
  status: 'approved' | 'rejected' | 'more_info_needed'
): boolean {
  const db = initializeDatabase();
  const claim = db.claims.find((c) => c.id === claimId);
  if (!claim) return false;

  claim.status = status;

  if (status === 'approved') {
    const company = db.companies.find(
      (c) =>
        c.id === claim.companyId ||
        c.slug === claim.companyName ||
        normalizeDomain(c.slug) === normalizeDomain(claim.companyName)
    );
    if (company) {
      company.isClaimed = true;
      company.isVerified = true;
      company.claimedByUserId = claim.applicantName;
      company.updatedAt = new Date().toISOString();
    }

    // Upgrade applicant user account to company_owner role if registered
    const applicant = db.users.find(
      (u) => u.email.toLowerCase() === claim.workEmail.toLowerCase()
    );
    if (applicant) {
      applicant.role = 'company_owner';
      applicant.updatedAt = new Date().toISOString();
      addNotification(
        applicant.id,
        'Company Claim Approved!',
        `Your ownership claim for ${claim.companyName} has been verified and approved. You can now manage company details, post announcements, and reply to reviews.`,
        'claim',
        '/dashboard/company'
      );
    }
  } else if (status === 'rejected') {
    const applicant = db.users.find(
      (u) => u.email.toLowerCase() === claim.workEmail.toLowerCase()
    );
    if (applicant) {
      addNotification(
        applicant.id,
        'Company Claim Update',
        `Your ownership claim for ${claim.companyName} could not be verified with the provided information.`,
        'claim',
        '/for-businesses'
      );
    }
  }

  writeDatabase(db);
  return true;
}

export function approveClaimRequest(claimId: string): boolean {
  return updateClaimStatus(claimId, 'approved');
}

// -------------------------------------------------------------
// AUDIT LOGS
// -------------------------------------------------------------

export function addAuditLog(
  actorUserId: string,
  action: string,
  targetType: string,
  targetId: string,
  detailsJson?: string,
  ipAddress?: string
): AuditLogEntry {
  const db = initializeDatabase();
  const log: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actorUserId,
    action,
    targetType,
    targetId,
    detailsJson,
    ipAddress,
    createdAt: new Date().toISOString(),
  };

  db.auditLogs.unshift(log);
  writeDatabase(db);
  return log;
}

export function getAuditLogs(): AuditLogEntry[] {
  const db = initializeDatabase();
  return db.auditLogs;
}

// -------------------------------------------------------------
// PASSWORD RESET TOKENS
// -------------------------------------------------------------

export function createPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date
): boolean {
  const db = initializeDatabase();
  // Clear any existing unused tokens for this user
  db.resetTokens = db.resetTokens.filter((t) => t.userId !== userId);
  db.resetTokens.push({
    id: `reset-${Date.now()}`,
    userId,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  });
  writeDatabase(db);
  return true;
}

export function verifyPasswordResetToken(tokenHash: string): string | null {
  const db = initializeDatabase();
  const record = db.resetTokens.find((t) => t.tokenHash === tokenHash && !t.usedAt);
  if (!record) return null;
  if (new Date(record.expiresAt) < new Date()) return null;
  return record.userId;
}

export function consumePasswordResetToken(tokenHash: string): boolean {
  const db = initializeDatabase();
  const record = db.resetTokens.find((t) => t.tokenHash === tokenHash && !t.usedAt);
  if (!record) return false;
  record.usedAt = new Date().toISOString();
  writeDatabase(db);
  return true;
}
