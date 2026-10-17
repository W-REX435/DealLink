import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { dbConnect, User } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

/** Public creator profile. */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
    }

    await dbConnect();
    const user = await User.findById(params.id).lean();

    if (!user || user.role === 'business') {
      return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
    }

    return NextResponse.json({
      creator: {
        id: (user as any)._id.toString(),
        name: user.name,
        email: user.email,
        niche: user.niche || 'Other Niche',
        subscriber_count: user.subscriberCount || 0,
        channel_url: user.channelUrl || '',
        bio: user.bio || '',
        tagline: user.tagline || '',
        location: user.location || '',
        pricingRate: user.pricingRate || 0,
        profileImage: user.profileImage || '',
        coverImage: user.coverImage || '',
        media: user.media || [],
        videos: user.videos || [],
        socialAccounts: user.socialAccounts || {},
        badges: user.badges || [],
        verified: Boolean(user.verified),
        emailVerified: Boolean(user.emailVerified),
        created_at: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load creator.' },
      { status: 500 }
    );
  }
}
