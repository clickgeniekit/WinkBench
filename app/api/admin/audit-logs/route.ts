import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getAuditLogs } from '@/lib/storage/db';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const logs = getAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve audit logs.' }, { status: 500 });
  }
}
