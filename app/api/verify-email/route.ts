import { NextResponse } from 'next/server';
import { rateLimit, rateLimitKey } from '@/lib/rate-limit';
import { dbConnect, User } from '@/lib/mongo';

export async function POST(req: Request) {
  const rl = rateLimit(rateLimitKey(req), 15);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing verification token.' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'This verification link is invalid or has expired.' },
        { status: 400 }
      );
    }

    user.emailVerified = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, email: user.email });
  } catch (error: any) {
    console.error('[verify-email]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify email.' },
      { status: 500 }
    );
  }
}
