import { NextResponse } from 'next/server';
import { dbConnect, ChatMessage, User } from '@/lib/mongo';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');
    
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth');
    const isAdmin = adminAuth?.value === 'authenticated_rex';

    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!isAdmin && !sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    let messages = [];

    if (isAdmin) {
      if (queryUserId) {
        messages = await ChatMessage.find({
          $or: [
            { fromUserId: queryUserId, toUserId: 'admin' },
            { fromUserId: 'admin', toUserId: queryUserId }
          ]
        }).sort({ createdAt: 1 });
      } else {
        messages = await ChatMessage.find().sort({ createdAt: 1 });
      }
    } else {
      messages = await ChatMessage.find({
        $or: [
          { fromUserId: sessionUserId, toUserId: 'admin' },
          { fromUserId: 'admin', toUserId: sessionUserId }
        ]
      }).sort({ createdAt: 1 });
    }

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth');
    const isAdmin = adminAuth?.value === 'authenticated_rex';

    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!isAdmin && !sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { toUserId, message } = body;

    if (!toUserId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    let fromUserId, fromUserName, fromUserRole;

    if (isAdmin && !sessionUserId) {
      fromUserId = 'admin';
      fromUserName = 'Admin';
      fromUserRole = 'admin';
    } else if (isAdmin && sessionUserId) {
       fromUserId = 'admin';
       fromUserName = 'Admin';
       fromUserRole = 'admin';
    } else {
      const user = await User.findById(sessionUserId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      fromUserId = user._id.toString();
      fromUserName = user.name;
      fromUserRole = user.role;
    }

    const chatMsg = new ChatMessage({
      fromUserId,
      fromUserName,
      fromUserRole,
      toUserId,
      message,
    });

    await chatMsg.save();

    return NextResponse.json({ success: true, message: chatMsg });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
