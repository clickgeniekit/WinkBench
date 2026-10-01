import { NextRequest, NextResponse } from 'next/server';
import {
  getAllReviews,
  getCompanyReviews,
  getUserReviews,
  addReview,
  deleteReview,
  addBusinessReply,
  addAuditLog,
} from '@/lib/storage/db';
import { getCurrentUser } from '@/lib/auth/session';
import { requireAuth } from '@/lib/auth/guards';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get('companySlug');
  const userId = searchParams.get('userId');

  if (companySlug) {
    const reviews = getCompanyReviews(companySlug);
    return NextResponse.json(reviews);
  }

  if (userId) {
    const reviews = getUserReviews(userId);
    return NextResponse.json(reviews);
  }

  const all = getAllReviews();
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    // Check if it's a business reply
    if (body.action === 'reply') {
      if (!currentUser || (currentUser.role !== 'company_owner' && currentUser.role !== 'admin')) {
        return NextResponse.json(
          { error: 'Unauthorized: Business owner privileges required to reply.' },
          { status: 403 }
        );
      }

      const { reviewId, responderName, responderRole, content } = body;
      if (!reviewId || !content) {
        return NextResponse.json(
          { error: 'Review ID and reply content are required' },
          { status: 400 }
        );
      }
      const success = addBusinessReply(
        reviewId,
        responderName || currentUser.displayName,
        responderRole || 'Verified Representative',
        content
      );
      return NextResponse.json({ success });
    }

    // Standard review submission
    const {
      companyId,
      companyName,
      companySlug,
      rating,
      title,
      content,
      experienceDate,
      isVerifiedCustomer,
    } = body;

    if (!companySlug || !rating || !title || !content) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    const authorId = currentUser ? currentUser.id : body.userId || 'usr-guest';
    const authorName = currentUser ? currentUser.displayName : body.userDisplayName || 'Verified Reviewer';
    const authorCountry = currentUser ? currentUser.countryCode : body.userCountry || 'Global';

    const created = addReview({
      companyId: companyId || `comp-${companySlug}`,
      companyName: companyName || companySlug,
      companySlug,
      userId: authorId,
      userDisplayName: authorName,
      userCountry: authorCountry,
      rating: numRating,
      title: title.trim(),
      content: content.trim(),
      experienceDate: experienceDate || 'Recent purchase',
      isVerifiedCustomer: Boolean(isVerifiedCustomer),
    });

    if (currentUser) {
      addAuditLog(currentUser.id, 'submit_review', 'review', created.id);
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const isAdmin = auth.user.role === 'admin';
    const success = deleteReview(id, auth.user.id, isAdmin);

    if (!success) {
      return NextResponse.json(
        { error: 'Review not found or you are not authorized to delete it.' },
        { status: 403 }
      );
    }

    addAuditLog(auth.user.id, 'delete_review', 'review', id);
    return NextResponse.json({ success: true, message: 'Review removed successfully.' });
  } catch (error) {
    console.error('Review deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

