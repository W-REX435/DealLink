import { NextResponse } from 'next/server';
import { rateLimit, rateLimitKey } from '@/lib/rate-limit';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { dbConnect, User } from '@/lib/mongo';
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email';

export async function POST(req: Request) {
  const rl = rateLimit(rateLimitKey(req), 10);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      channel_url,
      subscriber_count,
      niche,
      bio,
    } = body;

    if (!name || !email || !password || !channel_url || !niche) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, Email, Password, Channel Link, Niche).' },
        { status: 400 }
      );
    }

    const max = (v: unknown, n: number) =>
      typeof v === 'string' && v.trim().length > n;
    if (max(name, 80) || max(channel_url, 300) || max(niche, 60) || max(bio, 1000)) {
      return NextResponse.json(
        { error: 'Some fields are too long.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    await dbConnect();
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'A creator with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      emailVerified: null,
      channelUrl: channel_url.trim(),
      subscriberCount: Number(subscriber_count) || 0,
      niche,
      bio: (bio || '').trim(),
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendVerificationEmail(user.email, user.name, token);

    return NextResponse.json({
      success: true,
      emailConfigured: isEmailConfigured(),
      creator: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        channel_url: user.channelUrl,
        subscriber_count: user.subscriberCount,
        niche: user.niche,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    console.error('[register]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create account.' },
      { status: 500 }
    );
  }
}
