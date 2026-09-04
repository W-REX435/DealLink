import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, User, BusinessLead, BusinessApplication, CampaignBrief, Deal, Match } from '@/lib/mongo';

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

    const [users, leads, applications, briefs, deals, matches] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      BusinessLead.find().sort({ createdAt: -1 }).lean(),
      BusinessApplication.find().sort({ createdAt: -1 }).lean(),
      CampaignBrief.find().sort({ createdAt: -1 }).lean(),
      Deal.find().sort({ createdAt: -1 }).lean(),
      Match.find().sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      authenticated: true,
      creators: users
        .filter((u: any) => u.role !== 'business')
        .map((u: any) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          emailVerified: Boolean(u.emailVerified),
          channel_url: u.channelUrl || '',
          subscriber_count: u.subscriberCount || 0,
          niche: u.niche || 'Tech & SaaS',
          bio: u.bio || '',
          created_at: u.createdAt,
        })),
      businesses: users
        .filter((u: any) => u.role === 'business')
        .map((u: any) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          company: u.company || '',
          emailVerified: Boolean(u.emailVerified),
          created_at: u.createdAt,
        })),
      applications: applications.map((a: any) => ({
        id: a._id.toString(),
        contactName: a.contactName,
        email: a.email,
        company: a.company,
        website: a.website || '',
        budgetRange: a.budgetRange,
        goals: a.goals,
        timeline: a.timeline,
        status: a.status,
        created_at: a.createdAt,
      })),
      briefs: briefs.map((b: any) => ({
        id: b._id.toString(),
        businessName: b.businessName,
        company: b.company,
        product: b.product,
        description: b.description,
        niche: b.niche,
        minAudience: b.minAudience,
        budget: b.budget,
        deliverables: b.deliverables,
        status: b.status,
        created_at: b.createdAt,
      })),
      deals: deals.map((d: any) => ({
        id: d._id.toString(),
        product: d.product,
        company: d.company,
        creatorName: d.creatorName,
        businessName: d.businessName,
        dealValue: d.dealValue || 0,
        paidAmount: d.paidAmount || 0,
        status: d.status,
        created_at: d.createdAt,
      })),
      matches: matches.map((m: any) => ({
        id: m._id.toString(),
        product: m.product,
        company: m.company,
        creatorName: m.creatorName,
        status: m.status,
        created_at: m.createdAt,
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
        totalCreators: users.filter((u: any) => u.role !== 'business').length,
        totalBusinesses: users.filter((u: any) => u.role === 'business').length,
        totalLeads: leads.length,
        totalApplications: applications.length,
        pendingApplications: applications.filter((a: any) => a.status === 'pending').length,
        totalBriefs: briefs.length,
        totalDeals: deals.length,
        totalMatches: matches.length,
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
