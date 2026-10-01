import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  datetime,
  decimal,
  mysqlEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/**
 * 1. Main Categories (22 items)
 */
export const categories = mysqlTable(
  'categories',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    iconName: varchar('icon_name', { length: 50 }).default('Layers'),
    description: text('description'),
    sortOrder: int('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    slugIdx: uniqueIndex('idx_categories_slug').on(table.slug),
    activeOrderIdx: index('idx_categories_active_order').on(table.isActive, table.sortOrder),
  })
);

/**
 * 2. Subcategories (189 items)
 */
export const subcategories = mysqlTable(
  'subcategories',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    categoryId: varchar('category_id', { length: 36 })
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    description: text('description'),
    sortOrder: int('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    categorySubcatIdx: uniqueIndex('uq_cat_subcat').on(table.categoryId, table.id),
    categoryIdx: index('idx_subcategories_category').on(table.categoryId),
    slugIdx: uniqueIndex('idx_subcategories_slug').on(table.slug),
    activeOrderIdx: index('idx_subcategories_active_order').on(table.isActive, table.sortOrder),
  })
);

/**
 * 3. Companies Registry
 */
export const companies = mysqlTable(
  'companies',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    canonicalDomain: varchar('canonical_domain', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    tagline: varchar('tagline', { length: 255 }),
    description: text('description'),
    websiteUrl: varchar('website_url', { length: 500 }),
    logoUrl: varchar('logo_url', { length: 500 }),
    countryCode: varchar('country_code', { length: 2 }).default('US'),
    city: varchar('city', { length: 100 }),
    address: varchar('address', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    isClaimed: boolean('is_claimed').notNull().default(false),
    isVerified: boolean('is_verified').notNull().default(false),
    customerRating: decimal('customer_rating', { precision: 3, scale: 2 }).notNull().default('0.00'),
    reviewCount: int('review_count').notNull().default(0),
    trustScore: int('trust_score').notNull().default(50),
    trustRating: mysqlEnum('trust_rating', ['High', 'Good', 'Fair', 'Developing', 'Caution'])
      .notNull()
      .default('Developing'),
    classificationStatus: mysqlEnum('classification_status', ['unclassified', 'pending_review', 'classified'])
      .notNull()
      .default('unclassified'),
    primaryCategoryId: varchar('primary_category_id', { length: 36 }).references(() => categories.id, {
      onDelete: 'set null',
    }),
    primarySubcategoryId: varchar('primary_subcategory_id', { length: 36 }).references(
      () => subcategories.id,
      { onDelete: 'set null' }
    ),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    canonicalDomainIdx: uniqueIndex('idx_companies_canonical_domain').on(table.canonicalDomain),
    slugIdx: uniqueIndex('idx_companies_slug').on(table.slug),
    countryIdx: index('idx_companies_country').on(table.countryCode),
    classificationIdx: index('idx_companies_classification').on(table.classificationStatus),
  })
);

/**
 * 4. Company Domains (Canonical and Aliases)
 */
export const companyDomains = mysqlTable(
  'company_domains',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    companyId: varchar('company_id', { length: 36 })
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    domainNormalized: varchar('domain_normalized', { length: 255 }).notNull().unique(),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    domainIdx: uniqueIndex('idx_company_domains_norm').on(table.domainNormalized),
    companyIdx: index('idx_company_domains_company').on(table.companyId),
  })
);

/**
 * 5. Company Categories (Primary + Max 2 Secondary)
 */
export const companyCategories = mysqlTable(
  'company_categories',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    companyId: varchar('company_id', { length: 36 })
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    categoryId: varchar('category_id', { length: 36 })
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    subcategoryId: varchar('subcategory_id', { length: 36 }).references(() => subcategories.id, {
      onDelete: 'restrict',
    }),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uqCompanyCatSubcat: uniqueIndex('uq_company_cat_subcat').on(
      table.companyId,
      table.categoryId,
      table.subcategoryId
    ),
    companyIdx: index('idx_comp_cat_company').on(table.companyId),
    categoryIdx: index('idx_comp_cat_category').on(table.categoryId, table.subcategoryId),
  })
);

/**
 * 6. Users & Authentication
 */
export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 100 }).notNull(),
    role: mysqlEnum('role', ['user', 'company_owner', 'moderator', 'admin'])
      .notNull()
      .default('user'),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    countryCode: varchar('country_code', { length: 2 }).default('US'),
    isEmailVerified: boolean('is_email_verified').notNull().default(false),
    status: mysqlEnum('status', ['active', 'suspended', 'banned']).notNull().default('active'),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: uniqueIndex('idx_users_email').on(table.email),
    roleIdx: index('idx_users_role').on(table.role),
    statusIdx: index('idx_users_status').on(table.status),
  })
);

/**
 * 7. User Sessions
 */
export const userSessions = mysqlTable(
  'user_sessions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 255 }),
    expiresAt: datetime('expires_at').notNull(),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    tokenIdx: uniqueIndex('idx_sessions_token').on(table.tokenHash),
    expiresIdx: index('idx_sessions_expires').on(table.expiresAt),
  })
);

/**
 * 8. Customer Reviews
 */
export const reviews = mysqlTable(
  'reviews',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    companyId: varchar('company_id', { length: 36 })
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    rating: int('rating').notNull(),
    title: varchar('title', { length: 150 }).notNull(),
    content: text('content').notNull(),
    experienceDate: varchar('experience_date', { length: 50 }),
    status: mysqlEnum('status', ['published', 'pending_moderation', 'flagged', 'removed'])
      .notNull()
      .default('published'),
    isVerifiedBuyer: boolean('is_verified_buyer').notNull().default(false),
    helpfulCount: int('helpful_count').notNull().default(0),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdx: index('idx_reviews_company').on(table.companyId),
    userIdx: index('idx_reviews_user').on(table.userId),
    statusIdx: index('idx_reviews_status').on(table.status),
    createdIdx: index('idx_reviews_created').on(table.createdAt),
  })
);

/**
 * 9. Business Replies to Reviews
 */
export const reviewReplies = mysqlTable('review_replies', {
  id: varchar('id', { length: 36 }).primaryKey(),
  reviewId: varchar('review_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => reviews.id, { onDelete: 'cascade' }),
  companyId: varchar('company_id', { length: 36 })
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  responderUserId: varchar('responder_user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  content: text('content').notNull(),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

/**
 * 10. Company Ownership Claims
 */
export const companyClaims = mysqlTable(
  'company_claims',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    companyId: varchar('company_id', { length: 36 })
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    applicantUserId: varchar('applicant_user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    applicantName: varchar('applicant_name', { length: 100 }).notNull(),
    workEmail: varchar('work_email', { length: 255 }).notNull(),
    roleTitle: varchar('role_title', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    documentType: varchar('document_type', { length: 100 }),
    documentUrl: varchar('document_url', { length: 500 }),
    notes: text('notes'),
    status: mysqlEnum('status', ['pending', 'under_review', 'approved', 'rejected'])
      .notNull()
      .default('pending'),
    reviewedByAdminId: varchar('reviewed_by_admin_id', { length: 36 }),
    reviewedAt: datetime('reviewed_at'),
    createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdx: index('idx_claims_company').on(table.companyId),
    statusIdx: index('idx_claims_status').on(table.status),
  })
);

/**
 * 11. Company Announcements
 */
export const companyAnnouncements = mysqlTable('company_announcements', {
  id: varchar('id', { length: 36 }).primaryKey(),
  companyId: varchar('company_id', { length: 36 })
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  priority: mysqlEnum('priority', ['normal', 'important']).notNull().default('normal'),
  publishedAt: datetime('published_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 12. Company Articles & Blog
 */
export const companyArticles = mysqlTable('company_articles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  companyId: varchar('company_id', { length: 36 })
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  summary: text('summary'),
  content: text('content').notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  category: varchar('category', { length: 100 }),
  publishedAt: datetime('published_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 13. Review Reports (Moderation Flags)
 */
export const reviewReports = mysqlTable('review_reports', {
  id: varchar('id', { length: 36 }).primaryKey(),
  reviewId: varchar('review_id', { length: 36 })
    .notNull()
    .references(() => reviews.id, { onDelete: 'cascade' }),
  reporterUserId: varchar('reporter_user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  reason: varchar('reason', { length: 100 }).notNull(),
  notes: text('notes'),
  status: mysqlEnum('status', ['open', 'investigating', 'resolved', 'dismissed'])
    .notNull()
    .default('open'),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 14. Slug Redirects (Permanent 301 SEO redirects on renames)
 */
export const slugRedirects = mysqlTable('slug_redirects', {
  oldSlug: varchar('old_slug', { length: 100 }).primaryKey(),
  entityType: mysqlEnum('entity_type', ['category', 'subcategory', 'company']).notNull(),
  targetId: varchar('target_id', { length: 36 }).notNull(),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 15. Audit Logs for Sensitive Actions
 */
export const auditLogs = mysqlTable('audit_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  actorUserId: varchar('actor_user_id', { length: 36 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetId: varchar('target_id', { length: 100 }).notNull(),
  detailsJson: text('details_json'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
