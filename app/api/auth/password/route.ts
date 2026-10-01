import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { findUserById, updateUser, addNotification } from '@/lib/storage/db';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const user = findUserById(auth.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    const isMatch = verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const newHash = hashPassword(newPassword);
    updateUser(user.id, { passwordHash: newHash });

    addNotification(
      user.id,
      'Security Alert: Password Changed',
      'Your account password was updated successfully. If you did not initiate this change, contact administrator immediately.',
      'system'
    );

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while changing password.' },
      { status: 500 }
    );
  }
}
