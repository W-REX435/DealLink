import { NextResponse } from 'next/server';
import { getAllCreators, getAllBusinessLeads, getCreatorCount } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth')?.value;

    if (adminAuth !== 'authenticated_rex') {
      return NextResponse.json({ authenticated: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const creators = getAllCreators();
    const leads = getAllBusinessLeads();
    const creatorCount = getCreatorCount();

    return NextResponse.json({
      authenticated: true,
      creators,
      leads,
      stats: {
        totalCreators: creatorCount,
        totalLeads: leads.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch admin data' }, { status: 500 });
  }
}
