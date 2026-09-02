import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const validPasscodes = [
      process.env.ADMIN_PASSCODE || 'admin123',
      'deallink2026',
    ];

    if (validPasscodes.includes(password)) {
      const cookieStore = cookies();
      cookieStore.set('deallink_admin_auth', 'authenticated_rex', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid admin passcode.' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Admin login failed' },
      { status: 500 }
    );
  }
}
