import { NextRequest, NextResponse } from 'next/server';
import { 
  getOrCreateCompany, 
  getCompanyReviews, 
  getCompanyAnnouncements, 
  getCompanyArticles,
  updateCompanyDetails 
} from '@/lib/storage/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const company = getOrCreateCompany(slug);
  const reviews = getCompanyReviews(company.slug);
  const announcements = getCompanyAnnouncements(company.slug);
  const articles = getCompanyArticles(company.slug);

  return NextResponse.json({
    company,
    reviews,
    announcements,
    articles,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const success = updateCompanyDetails(slug, body);
    if (!success) {
      return NextResponse.json({ error: 'Company not found or update failed' }, { status: 404 });
    }
    const updated = getOrCreateCompany(slug);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
