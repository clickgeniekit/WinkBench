import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { addNotification, getAllUsers } from '@/lib/storage/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    // Notify administrators in-app
    const admins = getAllUsers().filter((u) => u.role === 'admin');
    admins.forEach((admin) => {
      addNotification(
        admin.id,
        `New Support Inquiry: ${subject}`,
        `From ${name} (${email}): ${message.substring(0, 120)}...`,
        'system'
      );
    });

    // Send email to support desk if configured
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@winkbench.com',
      subject: `[WinkBench Inquiry] ${subject}`,
      html: `
        <h3>New Support Message from WinkBench Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your message has been received and our team will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while sending message.' },
      { status: 500 }
    );
  }
}
