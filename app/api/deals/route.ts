import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect, User, Deal } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

function serializeDeal(d: any) {
  return {
    id: d._id.toString(),
    product: d.product,
    company: d.company,
    niche: d.niche,
    deliverables: d.deliverables,
    budget: d.budget,
    dealValue: d.dealValue || 0,
    paidAmount: d.paidAmount || 0,
    status: d.status,
    creatorName: d.creatorName,
    businessName: d.businessName,
    startedAt: d.startedAt,
    completedAt: d.completedAt,
    paidAt: d.paidAt,
    created_at: d.createdAt,
  };
}

/** Deals for the current user — role-aware. */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const filter =
      user.role === 'business'
        ? { businessId: user._id.toString() }
        : { creatorId: user._id.toString() };

    const deals = await Deal.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ deals: deals.map(serializeDeal) });
  } catch (error: any) {
    console.error('[deals]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to load deals' },
      { status: 500 }
    );
  }
}
