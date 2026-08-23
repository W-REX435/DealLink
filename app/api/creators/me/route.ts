import { NextResponse } from 'next/server';
import { getCreatorById, updateCreator } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const creatorId = cookieStore.get('deallink_creator_id')?.value;

    if (!creatorId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const creator = getCreatorById(creatorId);
    if (!creator) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, creator });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const creatorId = cookieStore.get('deallink_creator_id')?.value;

    if (!creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updated = updateCreator(creatorId, body);

    return NextResponse.json({ success: true, creator: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update profile' }, { status: 400 });
  }
}
