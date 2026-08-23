import { NextResponse } from 'next/server';
import { getCreatorByEmail } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const creator = getCreatorByEmail(email);
    if (!creator) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (creator.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const cookieStore = cookies();
    cookieStore.set('deallink_creator_id', creator.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true, creator });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Login failed.' }, { status: 500 });
  }
}
