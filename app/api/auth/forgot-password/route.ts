import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createPasswordResetToken } from '@/lib/storage/db';
import { generateSecureToken, hashToken } from '@/lib/auth/password';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    // Generic response to prevent user enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been dispatched.',
      });
    }

    const token = generateSecureToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    createPasswordResetToken(user.id, tokenHash, expiresAt);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://winkbench.com';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const emailResult = await sendEmail({
      to: user.email,
      subject: 'WinkBench Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.displayName},</p>
        <p>You requested a password reset for your WinkBench account. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}" style="padding:10px 20px; background:#1e3a8a; color:#fff; text-decoration:none; border-radius:8px;">Reset Password</a></p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been dispatched.',
      // In development when SMTP is not configured, provide token for test convenience
      developmentToken: !emailResult.configured ? token : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
