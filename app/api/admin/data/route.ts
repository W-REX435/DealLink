import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, User, BusinessLead } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('deallink_admin_auth')?.value;

    if (adminAuth !== 'authenticated_rex') {
      return NextResponse.json(
        { authenticated: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await dbConnect();

    const [users, leads] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      BusinessLead.find().sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      authenticated: true,
      creators: users.map((u: any) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        emailVerified: Boolean(u.emailVerified),
        channel_url: u.channelUrl || '',
        subscriber_count: u.subscriberCount || 0,
        niche: u.niche || 'Tech & SaaS',
        bio: u.bio || '',
        created_at: u.createdAt,
      })),
      leads: leads.map((l: any) => ({
        id: l._id.toString(),
        name: l.name,
        company: l.company,
        email: l.email,
        website: l.website || '',
        promotion_needs: l.promotionNeeds || '',
        created_at: l.createdAt,
      })),
      stats: {
        totalCreators: users.length,
        totalLeads: leads.length,
      },
    });
  } catch (error: any) {
    console.error('[admin/data]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
}
