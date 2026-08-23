import { NextResponse } from 'next/server';
import { getCreatorCount } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = getCreatorCount();
    return NextResponse.json({ creatorCount: count });
  } catch (error: any) {
    return NextResponse.json({ creatorCount: 5, error: error?.message || 'Failed' }, { status: 500 });
  }
}
