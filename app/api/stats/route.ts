import { NextResponse } from 'next/server';
import { dbConnect, User } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const count = await User.countDocuments();
    return NextResponse.json({ creatorCount: count });
  } catch (error: any) {
    console.error('[stats]', error);
    return NextResponse.json(
      { creatorCount: 0, error: error?.message || 'Failed to load stats' },
      { status: 500 }
    );
  }
}
