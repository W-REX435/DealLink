import { NextResponse } from 'next/server';
import { dbConnect, User } from '@/lib/mongo';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth');

    if (adminAuth?.value !== 'authenticated_rex') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { creatorId, action } = body;

    if (!creatorId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(creatorId);
    
    if (!user) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    if (action === 'verify') {
      user.verified = true;
      user.verifiedAt = new Date();
      await user.save();
    } else if (action === 'unverify') {
      user.verified = false;
      user.verifiedAt = undefined;
      await user.save();
    } else if (action === 'delete') {
      await User.findByIdAndDelete(creatorId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
