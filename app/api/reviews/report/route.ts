import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { addReviewReport, addAuditLog } from '@/lib/storage/db';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { reviewId, reason, notes } = body;

    if (!reviewId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Review ID and reason for reporting are required.' },
        { status: 400 }
      );
    }

    const report = addReviewReport(reviewId, auth.user.id, reason, notes);
    addAuditLog(
      auth.user.id,
      'report_review',
      'review',
      reviewId,
      JSON.stringify({ reason, reportId: report.id })
    );

    return NextResponse.json({
      success: true,
      message: 'Review report submitted. Our Trust & Safety team will investigate.',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Review reporting error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review report.' },
      { status: 500 }
    );
  }
}
