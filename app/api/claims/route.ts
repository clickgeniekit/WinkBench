import { NextRequest, NextResponse } from 'next/server';
import { getClaimRequests, submitClaimRequest, approveClaimRequest } from '@/lib/storage/db';

export async function GET() {
  const claims = getClaimRequests();
  return NextResponse.json(claims);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, companyName, applicantName, workEmail, roleInCompany, phone, additionalNotes } = body;

    if (!companyName || !applicantName || !workEmail) {
      return NextResponse.json({ error: 'Missing required claim fields' }, { status: 400 });
    }

    const claim = submitClaimRequest({
      companyId: companyId || `comp-${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      companyName,
      applicantName,
      workEmail,
      roleInCompany: roleInCompany || 'Representative',
      phone: phone || '',
      additionalNotes: additionalNotes || '',
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, action } = body;

    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 });
    }

    if (action === 'approve') {
      const success = approveClaimRequest(claimId);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process claim update' }, { status: 500 });
  }
}
