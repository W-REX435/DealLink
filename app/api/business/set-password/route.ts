import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect, BusinessApplication, User } from '@/lib/mongo';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required.' },
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
    const application = await BusinessApplication.findOne({
      inviteToken: token,
      inviteExpires: { $gt: new Date() },
      status: 'approved',
    }).select('+inviteToken +inviteExpires');

    if (!application) {
      return NextResponse.json(
        { error: 'This invite link is invalid or has expired.' },
        { status: 400 }
      );
    }

    const email = application.email;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Log in instead.' },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: application.contactName,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'business',
      company: application.company,
      emailVerified: new Date(),
    });

    application.inviteToken = undefined;
    application.inviteExpires = undefined;
    await application.save();

    return NextResponse.json({
      success: true,
      email: user.email,
      name: user.name,
      company: user.company,
    });
  } catch (error: any) {
    console.error('[business/set-password]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to activate account.' },
      { status: 500 }
    );
  }
}
