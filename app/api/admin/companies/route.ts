import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import {
  getAllCompanies,
  updateCompanyDetails,
  updateCompanyClassification,
  addAuditLog,
} from '@/lib/storage/db';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const companies = getAllCompanies();
    return NextResponse.json({ success: true, companies });
  } catch (error) {
    console.error('Admin companies fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve companies.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { action, companySlug, category, categorySlug, isVerified } = body;

    if (!companySlug) {
      return NextResponse.json({ success: false, error: 'Company slug is required.' }, { status: 400 });
    }

    if (action === 'classify' && category && categorySlug) {
      const success = updateCompanyClassification(companySlug, category, categorySlug);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Company not found.' }, { status: 404 });
      }
      addAuditLog(
        auth.user.id,
        'classify_company',
        'company',
        companySlug,
        JSON.stringify({ category, categorySlug })
      );
      return NextResponse.json({ success: true, message: 'Company classification updated.' });
    }

    if (action === 'toggle_verify') {
      const success = updateCompanyDetails(companySlug, { isVerified: Boolean(isVerified) });
      if (!success) {
        return NextResponse.json({ success: false, error: 'Company not found.' }, { status: 404 });
      }
      addAuditLog(
        auth.user.id,
        'toggle_company_verification',
        'company',
        companySlug,
        JSON.stringify({ isVerified })
      );
      return NextResponse.json({ success: true, message: 'Verification status updated.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid company action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin company update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company.' },
      { status: 500 }
    );
  }
}
