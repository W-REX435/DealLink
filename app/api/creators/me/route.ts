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
        tagline: user.tagline || '',
        location: user.location || '',
        pricingRate: user.pricingRate || 0,
        socialAccounts: user.socialAccounts || {},
        profileImage: user.profileImage || '',
        coverImage: user.coverImage || '',
        media: user.media || [],
        videos: user.videos || [],
        packages: user.packages || [],
        badges: user.badges || [],
        verified: Boolean(user.verified),
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

    const max = (v: unknown, n: number) =>
      typeof v === 'string' && v.trim().length > n;
    if (max(body.name, 100) || max(body.bio, 2500) || max(body.tagline, 200)) {
      return NextResponse.json(
        { error: 'Some fields are too long.' },
        { status: 400 }
      );
    }

    if (body.name !== undefined) user.name = body.name.trim();
    if (body.channel_url !== undefined) user.channelUrl = body.channel_url;
    if (body.subscriber_count !== undefined)
      user.subscriberCount = Number(body.subscriber_count) || 0;
    if (body.niche !== undefined) user.niche = body.niche;
    if (body.bio !== undefined) user.bio = body.bio;
    if (body.tagline !== undefined) user.tagline = body.tagline;
    if (body.location !== undefined) user.location = body.location;
    if (body.pricingRate !== undefined) user.pricingRate = Number(body.pricingRate) || 0;
    if (body.socialAccounts !== undefined) user.socialAccounts = body.socialAccounts;
    if (body.profileImage !== undefined) user.profileImage = body.profileImage;
    if (body.coverImage !== undefined) user.coverImage = body.coverImage;
    if (body.media !== undefined) user.media = Array.isArray(body.media) ? body.media : [];
    if (body.videos !== undefined) user.videos = Array.isArray(body.videos) ? body.videos : [];
    if (body.packages !== undefined) user.packages = Array.isArray(body.packages) ? body.packages : [];

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
        tagline: user.tagline || '',
        location: user.location || '',
        pricingRate: user.pricingRate || 0,
        socialAccounts: user.socialAccounts || {},
        profileImage: user.profileImage || '',
        coverImage: user.coverImage || '',
        media: user.media || [],
        videos: user.videos || [],
        packages: user.packages || [],
        verified: Boolean(user.verified),
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
