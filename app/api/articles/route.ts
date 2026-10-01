import { NextRequest, NextResponse } from 'next/server';
import { getCompanyArticles, addCompanyArticle } from '@/lib/storage/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get('companySlug');
  if (!companySlug) {
    return NextResponse.json({ error: 'companySlug is required' }, { status: 400 });
  }
  const items = getCompanyArticles(companySlug);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companySlug, title, summary, content, authorName, category } = body;
    if (!companySlug || !title || !content) {
      return NextResponse.json({ error: 'Missing required article fields' }, { status: 400 });
    }

    const created = addCompanyArticle({
      companySlug,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary: summary || title,
      content,
      authorName: authorName || 'Editorial Staff',
      category: category || 'Updates',
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
