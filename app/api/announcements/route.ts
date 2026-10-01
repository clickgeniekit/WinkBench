import { NextRequest, NextResponse } from 'next/server';
import { getCompanyAnnouncements, addCompanyAnnouncement } from '@/lib/storage/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get('companySlug');
  if (!companySlug) {
    return NextResponse.json({ error: 'companySlug is required' }, { status: 400 });
  }
  const items = getCompanyAnnouncements(companySlug);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companySlug, title, content, authorName, priority } = body;
    if (!companySlug || !title || !content) {
      return NextResponse.json({ error: 'Missing required announcement fields' }, { status: 400 });
    }

    const created = addCompanyAnnouncement({
      companySlug,
      title,
      content,
      authorName: authorName || 'Company Executive',
      priority: priority || 'normal',
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
