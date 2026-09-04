import { NextResponse } from 'next/server';
import { rateLimit, rateLimitKey } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';
import { dbConnect, User } from '@/lib/mongo';

export async function POST(req: Request) {
  const rl = rateLimit(rateLimitKey(req), 10);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
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
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[reset-password]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to reset password.' },
      { status: 500 }
    );
  }
}
