import { cookies } from 'next/headers';
import { generateSecureToken, hashToken } from './password';
import {
  createSession as dbCreateSession,
  findSessionByTokenHash,
  deleteSession as dbDeleteSession,
} from '@/lib/storage/db';
import { UserAccount } from '@/types';

export const SESSION_COOKIE_NAME = 'wb_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Creates a server session, stores its hash in database, and sets HTTP-only cookie.
 */
export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ token: string; user: UserAccount }> {
  const token = generateSecureToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const sessionRecord = dbCreateSession(userId, tokenHash, expiresAt, ipAddress, userAgent);
  const sessionData = findSessionByTokenHash(tokenHash);

  if (!sessionData) {
    throw new Error('Failed to establish user session');
  }

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
    expires: expiresAt,
  });

  return { token, user: sessionData.user };
}

/**
 * Retrieves the currently authenticated user from the request session cookie.
 */
export async function getCurrentUser(): Promise<UserAccount | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const tokenHash = hashToken(token);
    const sessionData = findSessionByTokenHash(tokenHash);

    if (!sessionData) {
      return null;
    }

    // Check expiration
    if (new Date(sessionData.session.expiresAt) < new Date()) {
      dbDeleteSession(tokenHash);
      return null;
    }

    if (sessionData.user.status === 'banned' || sessionData.user.status === 'suspended') {
      return null;
    }

    return sessionData.user;
  } catch {
    return null;
  }
}

/**
 * Destroys the current user session and clears the HTTP-only cookie.
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      const tokenHash = hashToken(token);
      dbDeleteSession(tokenHash);
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch {
    // Non-fatal
  }
}
