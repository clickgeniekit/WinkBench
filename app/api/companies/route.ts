import { NextRequest, NextResponse } from 'next/server';
import { getAllCompanies, getOrCreateCompany } from '@/lib/storage/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const country = searchParams.get('country');

  let companies = getAllCompanies();

  if (q) {
    const query = q.toLowerCase().trim();
    companies = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        c.website.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
    );
  }

  if (category) {
    companies = companies.filter((c) => c.categorySlug === category || c.category.toLowerCase() === category.toLowerCase());
  }

  if (country) {
    companies = companies.filter((c) => c.countryCode.toLowerCase() === country.toLowerCase());
  }

  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domainOrSlug } = body;
    if (!domainOrSlug) {
      return NextResponse.json({ error: 'domainOrSlug is required' }, { status: 400 });
    }
    const company = getOrCreateCompany(domainOrSlug);
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create or retrieve company' }, { status: 500 });
  }
}
