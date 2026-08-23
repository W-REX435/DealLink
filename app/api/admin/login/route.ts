import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // Default admin passcode: admin123 or deallink2026
    if (password === 'admin123' || password === 'deallink2026') {
      const cookieStore = cookies();
      cookieStore.set('deallink_admin_auth', 'authenticated_rex', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid admin passcode.' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Admin login failed' }, { status: 500 });
  }
}
