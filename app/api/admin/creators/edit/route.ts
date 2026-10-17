import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, User } from '@/lib/mongo';
import { isValidObjectId } from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth')?.value;

    if (adminAuth !== 'authenticated_rex') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const { creatorId } = body;

    if (!creatorId || !isValidObjectId(creatorId)) {
      return NextResponse.json({ error: 'Valid creator ID is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(creatorId);

    if (!user) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // Update allowable fields
    if (body.name !== undefined) user.name = body.name.trim();
    if (body.bio !== undefined) user.bio = body.bio;
    if (body.niche !== undefined) user.niche = body.niche;
    if (body.subscriber_count !== undefined) {
      user.subscriberCount = Number(body.subscriber_count) || 0;
    }
    if (body.tagline !== undefined) user.tagline = body.tagline;
    if (body.location !== undefined) user.location = body.location;
    if (body.pricingRate !== undefined) user.pricingRate = Number(body.pricingRate) || 0;
    if (body.profileImage !== undefined) user.profileImage = body.profileImage;
    if (body.coverImage !== undefined) user.coverImage = body.coverImage;
    if (body.media !== undefined) user.media = Array.isArray(body.media) ? body.media : [];
    if (body.videos !== undefined) user.videos = Array.isArray(body.videos) ? body.videos : [];
    if (body.packages !== undefined) user.packages = Array.isArray(body.packages) ? body.packages : [];
    if (body.socialAccounts !== undefined) user.socialAccounts = body.socialAccounts;
    if (body.verified !== undefined) {
      user.verified = Boolean(body.verified);
      if (user.verified && !user.verifiedAt) {
        user.verifiedAt = new Date();
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Creator profile updated successfully',
      creator: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        niche: user.niche,
        subscriber_count: user.subscriberCount,
        bio: user.bio,
        tagline: user.tagline,
        location: user.location,
        pricingRate: user.pricingRate,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        media: user.media,
        videos: user.videos,
        packages: user.packages,
        socialAccounts: user.socialAccounts,
        verified: user.verified,
        emailVerified: Boolean(user.emailVerified),
        created_at: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[admin/creators/edit]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update creator profile' },
      { status: 500 }
    );
  }
}
