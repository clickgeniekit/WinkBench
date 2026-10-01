import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getClaimRequests, updateClaimStatus, addAuditLog } from '@/lib/storage/db';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const claims = getClaimRequests();
    return NextResponse.json({ success: true, claims });
  } catch (error) {
    console.error('Admin claims fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve claims.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { claimId, status } = body;

    if (!claimId || !status || !['approved', 'rejected', 'more_info_needed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid claim ID and status are required.' },
        { status: 400 }
      );
    }

    const success = updateClaimStatus(claimId, status);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Claim not found.' }, { status: 404 });
    }

    addAuditLog(auth.user.id, 'review_claim', 'claim', claimId, JSON.stringify({ status }));

    return NextResponse.json({
      success: true,
      message: `Claim status successfully updated to ${status}.`,
    });
  } catch (error) {
    console.error('Admin claim update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update claim status.' },
      { status: 500 }
    );
  }
}
