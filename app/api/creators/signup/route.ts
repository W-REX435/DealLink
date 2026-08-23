import { NextResponse } from 'next/server';
import { createCreator } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, channel_url, subscriber_count, niche, bio } = body;

    if (!name || !email || !password || !channel_url || !niche) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, Email, Password, Channel Link, Niche).' },
        { status: 400 }
      );
    }

    const creator = createCreator({
      name,
      email,
      password_hash: password,
      channel_url,
      subscriber_count: Number(subscriber_count) || 0,
      niche,
      bio: bio || '',
    });

    // Set cookie session for creator login
    const cookieStore = cookies();
    cookieStore.set('deallink_creator_id', creator.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true, creator });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create account.' },
      { status: 400 }
    );
  }
}
