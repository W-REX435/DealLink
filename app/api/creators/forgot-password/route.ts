import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect, User } from '@/lib/mongo';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    await dbConnect();
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      '+passwordResetToken +passwordResetExpires'
    );

    // Always respond success to avoid account enumeration
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = token;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      await sendPasswordResetEmail(user.email, user.name, token);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[forgot-password]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send reset email.' },
      { status: 500 }
    );
  }
}
