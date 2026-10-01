import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import {
  getAllReviews,
  getReviewReports,
  updateReviewStatus,
  updateReviewReportStatus,
  deleteReview,
  addAuditLog,
} from '@/lib/storage/db';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const reviews = getAllReviews();
    const reports = getReviewReports();
    return NextResponse.json({ success: true, reviews, reports });
  } catch (error) {
    console.error('Admin reviews fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve moderation data.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { action, reviewId, reportId, status } = body;

    if (action === 'update_review_status' && reviewId && status) {
      const success = updateReviewStatus(reviewId, status);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Review not found.' }, { status: 404 });
      }
      addAuditLog(auth.user.id, 'moderate_review', 'review', reviewId, JSON.stringify({ status }));
      return NextResponse.json({ success: true, message: `Review status updated to ${status}.` });
    }

    if (action === 'delete_review' && reviewId) {
      const success = deleteReview(reviewId, undefined, true);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Review not found.' }, { status: 404 });
      }
      addAuditLog(auth.user.id, 'admin_delete_review', 'review', reviewId);
      return NextResponse.json({ success: true, message: 'Review permanently removed.' });
    }

    if (action === 'update_report_status' && reportId && status) {
      const success = updateReviewReportStatus(reportId, status);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Report not found.' }, { status: 404 });
      }
      addAuditLog(auth.user.id, 'resolve_report', 'report', reportId, JSON.stringify({ status }));
      return NextResponse.json({ success: true, message: `Report marked as ${status}.` });
    }

    return NextResponse.json({ success: false, error: 'Invalid moderation action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin moderation action error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute moderation action.' },
      { status: 500 }
    );
  }
}
