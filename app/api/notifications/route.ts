import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/storage/db';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const notifications = getUserNotifications(auth.user.id);
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notifications.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      markAllNotificationsAsRead(auth.user.id);
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (id) {
      const success = markNotificationAsRead(id, auth.user.id);
      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid notification action.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Notifications update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification.' },
      { status: 500 }
    );
  }
}
