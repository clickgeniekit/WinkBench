import { NextResponse } from 'next/server';
import { getCurrentUser } from './session';
import { UserAccount } from '@/types';

export interface AuthContext {
  user: UserAccount;
}

/**
 * Ensures the requester is authenticated. Returns user or a 401 JSON Response.
 */
export async function requireAuth(): Promise<{ user: UserAccount } | NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required. Please log in.' },
      { status: 401 }
    );
  }
  return { user };
}

/**
 * Ensures the requester has administrator privileges. Returns user or a 403 JSON Response.
 */
export async function requireAdmin(): Promise<{ user: UserAccount } | NextResponse> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }
  if (auth.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden. Administrator privileges required.' },
      { status: 403 }
    );
  }
  return auth;
}

/**
 * Ensures the requester is an authorized company owner or administrator.
 */
export async function requireCompanyOwner(): Promise<{ user: UserAccount } | NextResponse> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }
  if (auth.user.role !== 'company_owner' && auth.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden. Verified business ownership required.' },
      { status: 403 }
    );
  }
  return auth;
}
