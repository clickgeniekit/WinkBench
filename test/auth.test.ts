import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashToken,
} from '../lib/auth/password';

describe('Authentication & Cryptography Module', () => {
  it('hashes passwords with unique random salts', () => {
    const password = 'StrongPassword2026!';
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);

    expect(hash1).not.toBe(hash2); // Different salts
    expect(hash1).toContain(':');
    expect(hash2).toContain(':');
  });

  it('correctly verifies valid passwords', () => {
    const password = 'SecretPassword123#';
    const hash = hashPassword(password);

    expect(verifyPassword(password, hash)).toBe(true);
  });

  it('rejects incorrect passwords', () => {
    const password = 'RealPassword123!';
    const hash = hashPassword(password);

    expect(verifyPassword('WrongPassword123!', hash)).toBe(false);
    expect(verifyPassword('', hash)).toBe(false);
    expect(verifyPassword('realpassword123!', hash)).toBe(false); // Case sensitive
  });

  it('rejects passwords shorter than 8 characters', () => {
    expect(() => hashPassword('short')).toThrow('Password must be at least 8 characters long');
  });

  it('generates secure random hex tokens', () => {
    const token1 = generateSecureToken(32);
    const token2 = generateSecureToken(32);

    expect(token1).toHaveLength(64); // 32 bytes in hex = 64 chars
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });

  it('deterministically hashes tokens with SHA-256', () => {
    const token = 'sample-session-token-12345';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // sha256 hex length
  });
});
