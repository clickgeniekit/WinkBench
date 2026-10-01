import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, addNotification } from '@/lib/storage/db';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, displayName, countryCode } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Display name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const newUser = createUser({
      email,
      passwordHash,
      displayName: displayName.trim(),
      countryCode: countryCode || 'US',
      role: 'user',
    });

    // Create session and set HTTP-only cookie
    const ip = req.headers.get('x-forwarded-for') || undefined;
    const ua = req.headers.get('user-agent') || undefined;
    await createSession(newUser.id, ip, ua);

    // Send welcome notification
    addNotification(
      newUser.id,
      'Welcome to WinkBench!',
      'Your account has been created. You can now write reviews, verify purchases, and save businesses.',
      'system',
      '/directory'
    );

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        countryCode: newUser.countryCode,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred during registration.' },
      { status: 500 }
    );
  }
}
