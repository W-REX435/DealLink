import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, CampaignBrief } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

function isAdmin() {
  return cookies().get('deallink_admin_auth')?.value === 'authenticated_rex';
}

/** Update brief status (reviewing / matched). */
export async function POST(req: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !['submitted', 'reviewing', 'matched'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    await dbConnect();
    const brief = await CampaignBrief.findById(id);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found.' }, { status: 404 });
    }

    brief.status = status;
    await brief.save();

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update brief.' },
      { status: 500 }
    );
  }
}
