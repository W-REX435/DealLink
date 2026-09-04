import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect, User } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      creator: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'creator',
        company: user.company || '',
        emailVerified: Boolean(user.emailVerified),
        channel_url: user.channelUrl || '',
        subscriber_count: user.subscriberCount || 0,
        niche: user.niche || 'Tech & SaaS',
        bio: user.bio || '',
        created_at: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (body.name !== undefined) user.name = body.name;
    if (body.channel_url !== undefined) user.channelUrl = body.channel_url;
    if (body.subscriber_count !== undefined)
      user.subscriberCount = Number(body.subscriber_count) || 0;
    if (body.niche !== undefined) user.niche = body.niche;
    if (body.bio !== undefined) user.bio = body.bio;

    await user.save();

    return NextResponse.json({
      success: true,
      creator: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        emailVerified: Boolean(user.emailVerified),
        channel_url: user.channelUrl || '',
        subscriber_count: user.subscriberCount || 0,
        niche: user.niche || 'Tech & SaaS',
        bio: user.bio || '',
        created_at: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 400 }
    );
  }
}
