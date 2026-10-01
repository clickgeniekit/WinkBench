import { describe, it, expect } from 'vitest';
import { normalizeDomain, isDomainQuery } from '../lib/utils/domain';

describe('Domain Normalization & Canonical Profile Matching', () => {
  it('normalizes various input formats to canonical domain', () => {
    expect(normalizeDomain('https://example.com/')).toBe('example.com');
    expect(normalizeDomain('http://www.example.com')).toBe('example.com');
    expect(normalizeDomain('WWW.EXAMPLE.COM/path/to/page')).toBe('example.com');
    expect(normalizeDomain('example.com/shop?id=123')).toBe('example.com');
    expect(normalizeDomain('  HTTPS://SUB.EXAMPLE.COM/  ')).toBe('sub.example.com');
  });

  it('detects domain queries accurately', () => {
    expect(isDomainQuery('example.com')).toBe(true);
    expect(isDomainQuery('www.nordicstack.cloud')).toBe(true);
    expect(isDomainQuery('https://aurora.io')).toBe(true);
    expect(isDomainQuery('fintech')).toBe(false);
    expect(isDomainQuery('coffee shop in seattle')).toBe(false);
  });

  it('preserves uppercase to lowercase normalization', () => {
    expect(normalizeDomain('SHOPPING.EXAMPLE.COM')).toBe('shopping.example.com');
  });
});
