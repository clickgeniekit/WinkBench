import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllUsers, updateUser, addAuditLog } from '@/lib/storage/db';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const users = getAllUsers().map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      countryCode: u.countryCode,
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve user accounts.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    // Prevent admin from locking themselves out
    if (userId === auth.user.id && (status === 'banned' || status === 'suspended' || role === 'user')) {
      return NextResponse.json(
        { success: false, error: 'You cannot demote or suspend your own administrator account.' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (role && ['user', 'company_owner', 'moderator', 'admin'].includes(role)) {
      updates.role = role;
    }
    if (status && ['active', 'suspended', 'banned'].includes(status)) {
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid updates provided.' }, { status: 400 });
    }

    const success = updateUser(userId, updates);
    if (!success) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    addAuditLog(auth.user.id, 'update_user_account', 'user', userId, JSON.stringify(updates));

    return NextResponse.json({ success: true, message: 'User account updated successfully.' });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user account.' },
      { status: 500 }
    );
  }
}
