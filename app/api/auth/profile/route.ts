import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { updateUser, findUserById } from '@/lib/storage/db';

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { displayName, avatarUrl, countryCode } = body;

    const updates: Record<string, string | undefined> = {};
    if (displayName && typeof displayName === 'string' && displayName.trim().length >= 2) {
      updates.displayName = displayName.trim();
    }
    if (avatarUrl !== undefined && typeof avatarUrl === 'string') {
      updates.avatarUrl = avatarUrl.trim();
    }
    if (countryCode && typeof countryCode === 'string' && countryCode.length === 2) {
      updates.countryCode = countryCode.toUpperCase();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields provided for update.' },
        { status: 400 }
      );
    }

    const success = updateUser(auth.user.id, updates);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'User account could not be found.' },
        { status: 404 }
      );
    }

    const updatedUser = findUserById(auth.user.id);
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        displayName: updatedUser?.displayName,
        avatarUrl: updatedUser?.avatarUrl,
        countryCode: updatedUser?.countryCode,
        role: updatedUser?.role,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while updating profile.' },
      { status: 500 }
    );
  }
}
