import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { dbConnect, User } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

function isAdmin() {
  return cookies().get('deallink_admin_auth')?.value === 'authenticated_rex';
}

export async function POST(req: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      niche,
      subscriber_count,
      channel_url,
      tagline,
      location,
      bio,
      pricingRate,
      verified,
      badges,
      packages,
    } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Name and Email are required fields.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists.' },
        { status: 400 }
      );
    }

    const rawPassword = password?.trim() || 'creator123!';
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const isVerified = Boolean(verified);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'creator',
      niche: niche || 'Tech & SaaS',
      subscriberCount: Number(subscriber_count) || 0,
      channelUrl: channel_url?.trim() || '',
      tagline: tagline?.trim() || '',
      location: location?.trim() || '',
      bio: bio?.trim() || '',
      pricingRate: Number(pricingRate) || 0,
      verified: isVerified,
      verifiedAt: isVerified ? new Date() : undefined,
      emailVerified: new Date(),
      badges: Array.isArray(badges) ? badges : [],
      packages: Array.isArray(packages) ? packages : [],
    });

    return NextResponse.json({
      success: true,
      message: 'Creator created successfully',
      creator: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        niche: user.niche,
        subscriber_count: user.subscriberCount,
        channel_url: user.channelUrl,
        bio: user.bio,
        tagline: user.tagline,
        location: user.location,
        pricingRate: user.pricingRate,
        verified: user.verified,
        badges: user.badges,
        packages: user.packages,
        created_at: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[admin_creator_create]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create creator.' },
      { status: 500 }
    );
  }
}
