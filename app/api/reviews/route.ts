import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, getCompanyReviews, addReview, addBusinessReply } from '@/lib/storage/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get('companySlug');

  if (companySlug) {
    const reviews = getCompanyReviews(companySlug);
    return NextResponse.json(reviews);
  }

  const all = getAllReviews();
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a business reply
    if (body.action === 'reply') {
      const { reviewId, responderName, responderRole, content } = body;
      if (!reviewId || !content) {
        return NextResponse.json({ error: 'Review ID and reply content are required' }, { status: 400 });
      }
      const success = addBusinessReply(reviewId, responderName || 'Company Representative', responderRole || 'Owner', content);
      return NextResponse.json({ success });
    }

    // Standard review submission
    const { companyId, companyName, companySlug, userId, userDisplayName, userCountry, rating, title, content, experienceDate, isVerifiedCustomer } = body;
    if (!companySlug || !rating || !title || !content) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const created = addReview({
      companyId: companyId || `comp-${companySlug}`,
      companyName: companyName || companySlug,
      companySlug,
      userId: userId || 'usr-guest',
      userDisplayName: userDisplayName || 'Verified Reviewer',
      userCountry: userCountry || 'Global',
      rating: Number(rating),
      title,
      content,
      experienceDate: experienceDate || 'Recent purchase',
      isVerifiedCustomer: Boolean(isVerifiedCustomer),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}
