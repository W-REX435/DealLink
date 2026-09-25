import { NextResponse } from 'next/server';
import { dbConnect, Notification } from '@/lib/mongo';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth');

    if (adminAuth?.value !== 'authenticated_rex') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ read: false });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load notifications' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth');

    if (adminAuth?.value !== 'authenticated_rex') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 });
    }

    await dbConnect();
    const notification = await Notification.findById(notificationId);
    
    if (notification) {
      notification.read = true;
      await notification.save();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to mark as read' },
      { status: 500 }
    );
  }
}
