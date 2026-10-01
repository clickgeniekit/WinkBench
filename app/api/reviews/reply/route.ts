import { NextRequest, NextResponse } from 'next/server';
import { requireCompanyOwner } from '@/lib/auth/guards';
import { addBusinessReply, addAuditLog } from '@/lib/storage/db';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCompanyOwner();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { reviewId, responderName, responderRole, content } = body;

    if (!reviewId || !content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Review ID and response content are required.' },
        { status: 400 }
      );
    }

    const success = addBusinessReply(
      reviewId,
      responderName || auth.user.displayName,
      responderRole || 'Verified Representative',
      content.trim()
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Review could not be found.' },
        { status: 404 }
      );
    }

    addAuditLog(
      auth.user.id,
      'post_business_reply',
      'review',
      reviewId,
      JSON.stringify({ responderName, responderRole })
    );

    return NextResponse.json({
      success: true,
      message: 'Business reply posted successfully.',
    });
  } catch (error) {
    console.error('Business reply error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post business reply.' },
      { status: 500 }
    );
  }
}
