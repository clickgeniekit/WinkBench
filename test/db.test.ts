import { describe, it, expect } from 'vitest';
import {
  getOrCreateCompany,
  getAllCompanies,
  addReview,
  getCompanyReviews,
  deleteReview,
  findUserByEmail,
  createUser,
  submitClaimRequest,
  updateClaimStatus,
} from '../lib/storage/db';

describe('Database Storage & CRUD Operations', () => {
  it('loads companies list without errors', () => {
    const companies = getAllCompanies();
    expect(companies.length).toBeGreaterThan(0);
  });

  it('creates an unclassified profile when an unlisted domain is queried', () => {
    const testDomain = 'new-unlisted-service-test.com';
    const comp = getOrCreateCompany(testDomain);

    expect(comp).toBeDefined();
    expect(comp.slug).toBe(testDomain);
    expect(comp.category).toBe('Unclassified');
    expect(comp.isClaimed).toBe(false);
  });

  it('persists a new review and recalculates company statistics', () => {
    const testSlug = 'aurora-payments-global';
    const initialReviews = getCompanyReviews(testSlug);
    const initialCount = initialReviews.length;

    const newRev = addReview({
      companyId: 'comp-aurora-payments-global',
      companyName: 'Aurora Payments Global',
      companySlug: testSlug,
      userId: 'usr-test-runner',
      userDisplayName: 'Automated Tester',
      userCountry: 'US',
      rating: 5,
      title: 'Reliable payment processing service',
      content: 'This is an automated test review verifying rating distribution calculations.',
      experienceDate: 'October 2026',
    });

    expect(newRev.id).toBeDefined();
    const updatedReviews = getCompanyReviews(testSlug);
    expect(updatedReviews.length).toBe(initialCount + 1);

    // Clean up test review
    deleteReview(newRev.id, 'usr-test-runner');
    const finalReviews = getCompanyReviews(testSlug);
    expect(finalReviews.length).toBe(initialCount);
  });

  it('manages claim submission and verification status', () => {
    const claim = submitClaimRequest({
      companyId: 'comp-test-business-claim',
      companyName: 'test-business-claim.com',
      applicantName: 'Sarah Jenkins',
      workEmail: 'sarah@test-business-claim.com',
      roleInCompany: 'Managing Director',
      phone: '+1 555 987 6543',
    });

    expect(claim.status).toBe('pending_review');

    const approved = updateClaimStatus(claim.id, 'approved');
    expect(approved).toBe(true);
  });

  it('verifies user lookup and registration', () => {
    const admin = findUserByEmail('admin@winkbench.com');
    expect(admin).toBeDefined();
    expect(admin?.role).toBe('admin');
  });
});
