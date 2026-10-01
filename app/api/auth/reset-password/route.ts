import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPasswordResetToken,
  consumePasswordResetToken,
  updateUser,
  findUserById,
  addNotification,
} from '@/lib/storage/db';
import { hashToken, hashPassword } from '@/lib/auth/password';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const userId = verifyPasswordResetToken(tokenHash);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'This reset token is invalid or has expired.' },
        { status: 400 }
      );
    }

    const newHash = hashPassword(newPassword);
    updateUser(userId, { passwordHash: newHash });
    consumePasswordResetToken(tokenHash);

    const user = findUserById(userId);
    if (user) {
      addNotification(
        user.id,
        'Password Reset Successful',
        'Your password has been successfully reset. You can now log in with your new credentials.',
        'system'
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. You may now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while resetting password.' },
      { status: 500 }
    );
  }
}
