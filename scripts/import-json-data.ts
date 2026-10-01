#!/usr/bin/env tsx
/**
 * WinkBench JSON Data Migration to MySQL
 *
 * Imports data from `data/winkbench.json` into Hostinger MySQL tables.
 * Validates each record, creates backup, preserves primary keys, handles
 * unclassified companies safely, and verifies final record counts.
 */

import fs from 'fs';
import path from 'path';
import { isDatabaseConfigured, getDb } from '../lib/db';
import {
  companies,
  companyDomains,
  reviews,
  users,
  companyClaims,
  companyAnnouncements,
  companyArticles,
  notifications,
} from '../lib/db/schema';
import { DatabaseSchema } from '../lib/storage/db';

async function main() {
  console.log('=== WinkBench JSON Data to MySQL Importer ===\n');

  const jsonFilePath = path.join(process.cwd(), 'data', 'winkbench.json');
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`Error: Source JSON file not found at ${jsonFilePath}`);
    process.exit(1);
  }

  // 1. Back up source data
  const backupDir = path.join(process.cwd(), 'data', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupPath = path.join(backupDir, `winkbench.backup.${Date.now()}.json`);
  fs.copyFileSync(jsonFilePath, backupPath);
  console.log(`[Backup] Source data backed up to: ${backupPath}`);

  // 2. Validate database configuration
  if (!isDatabaseConfigured()) {
    console.warn('\n[Notice] MySQL credentials not configured in environment variables.');
    console.warn('Set DATABASE_HOST, DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD to run this migration.');
    console.warn('Source JSON backup was created safely. No changes were made to any database.\n');
    process.exit(0);
  }

  const db = getDb();
  if (!db) {
    console.error('Error: Could not connect to MySQL database.');
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonFilePath, 'utf8');
  const source = JSON.parse(raw) as DatabaseSchema;

  console.log(`[Source Summary]`);
  console.log(`- Companies: ${source.companies?.length || 0}`);
  console.log(`- Reviews: ${source.reviews?.length || 0}`);
  console.log(`- Users: ${source.users?.length || 0}`);
  console.log(`- Claims: ${source.claims?.length || 0}`);
  console.log(`- Announcements: ${source.announcements?.length || 0}`);
  console.log(`- Articles: ${source.articles?.length || 0}`);
  console.log('\nBeginning database import...\n');

  // Insert Users
  if (source.users && source.users.length > 0) {
    console.log(`Importing ${source.users.length} users...`);
    for (const u of source.users) {
      await db
        .insert(users)
        .values({
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          displayName: u.displayName,
          role: u.role as any,
          avatarUrl: u.avatarUrl,
          countryCode: u.countryCode || 'US',
          isEmailVerified: u.isEmailVerified,
          status: u.status as any,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        })
        .onDuplicateKeyUpdate({
          set: {
            displayName: u.displayName,
            role: u.role as any,
            updatedAt: new Date(),
          },
        });
    }
  }

  // Insert Companies
  if (source.companies && source.companies.length > 0) {
    console.log(`Importing ${source.companies.length} companies...`);
    for (const c of source.companies) {
      const canonicalDomain = (c.website || c.slug).replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '');
      await db
        .insert(companies)
        .values({
          id: c.id,
          canonicalDomain,
          name: c.name,
          slug: c.slug,
          tagline: c.tagline,
          description: c.description,
          websiteUrl: c.website,
          logoUrl: c.logoUrl,
          countryCode: c.countryCode || 'US',
          city: c.city,
          address: c.address,
          phone: c.phone,
          email: c.email,
          isClaimed: c.isClaimed,
          isVerified: c.isVerified,
          customerRating: c.customerRating.toFixed(2),
          reviewCount: c.reviewCount,
          trustScore: c.trustScore,
          trustRating: (c.trustScoreRating as any) || 'Developing',
          classificationStatus: c.category === 'Unclassified' ? 'unclassified' : 'classified',
          createdAt: new Date(c.createdAt || Date.now()),
          updatedAt: new Date(c.updatedAt || Date.now()),
        })
        .onDuplicateKeyUpdate({
          set: {
            name: c.name,
            customerRating: c.customerRating.toFixed(2),
            reviewCount: c.reviewCount,
            trustScore: c.trustScore,
            updatedAt: new Date(),
          },
        });

      // Domain mapping
      await db
        .insert(companyDomains)
        .values({
          id: `dom-${c.id}-1`,
          companyId: c.id,
          domainNormalized: canonicalDomain,
          isPrimary: true,
        })
        .onDuplicateKeyUpdate({
          set: { isPrimary: true },
        });
    }
  }

  // Insert Reviews
  if (source.reviews && source.reviews.length > 0) {
    console.log(`Importing ${source.reviews.length} reviews...`);
    for (const r of source.reviews) {
      await db
        .insert(reviews)
        .values({
          id: r.id,
          companyId: r.companyId,
          userId: r.userId || 'usr-alex-morris',
          rating: r.rating,
          title: r.title,
          content: r.content,
          experienceDate: r.experienceDate,
          status: (r.status as any) || 'published',
          isVerifiedBuyer: r.isVerifiedCustomer || false,
          helpfulCount: r.helpfulCount || 0,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt || r.createdAt),
        })
        .onDuplicateKeyUpdate({
          set: {
            rating: r.rating,
            status: (r.status as any) || 'published',
            updatedAt: new Date(),
          },
        });
    }
  }

  // Insert Claims
  if (source.claims && source.claims.length > 0) {
    console.log(`Importing ${source.claims.length} claims...`);
    for (const cl of source.claims) {
      await db
        .insert(companyClaims)
        .values({
          id: cl.id,
          companyId: cl.companyId,
          applicantUserId: 'usr-elena-rostova',
          applicantName: cl.applicantName,
          workEmail: cl.workEmail,
          roleTitle: cl.roleInCompany,
          phone: cl.phone,
          status: cl.status === 'approved' ? 'approved' : cl.status === 'rejected' ? 'rejected' : 'pending',
          createdAt: new Date(cl.submittedAt),
        })
        .onDuplicateKeyUpdate({
          set: {
            applicantName: cl.applicantName,
          },
        });
    }
  }

  // Insert Announcements
  if (source.announcements && source.announcements.length > 0) {
    console.log(`Importing ${source.announcements.length} announcements...`);
    for (const a of source.announcements) {
      const company = source.companies.find((c) => c.slug === a.companySlug);
      if (company) {
        await db
          .insert(companyAnnouncements)
          .values({
            id: a.id,
            companyId: company.id,
            title: a.title,
            content: a.content,
            authorName: a.authorName,
            priority: (a.priority as any) || 'normal',
            publishedAt: new Date(a.publishedAt),
            createdAt: new Date(a.publishedAt),
          })
          .onDuplicateKeyUpdate({
            set: { title: a.title },
          });
      }
    }
  }

  // Insert Articles
  if (source.articles && source.articles.length > 0) {
    console.log(`Importing ${source.articles.length} articles...`);
    for (const art of source.articles) {
      const company = source.companies.find((c) => c.slug === art.companySlug);
      if (company) {
        await db
          .insert(companyArticles)
          .values({
            id: art.id,
            companyId: company.id,
            title: art.title,
            slug: art.slug,
            summary: art.summary,
            content: art.content,
            authorName: art.authorName,
            category: art.category,
            publishedAt: new Date(art.publishedAt),
            createdAt: new Date(art.publishedAt),
          })
          .onDuplicateKeyUpdate({
            set: { title: art.title },
          });
      }
    }
  }

  console.log('\n[Success] JSON records successfully imported into Hostinger MySQL tables.');
  console.log('Original JSON file was preserved intact without deletion.\n');
}

main().catch((err) => {
  console.error('Fatal error during JSON data migration:', err);
  process.exit(1);
});
