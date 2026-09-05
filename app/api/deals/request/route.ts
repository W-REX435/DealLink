import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect, User, Deal } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const business = await User.findById(session.user.id);
    if (!business || business.role !== 'business') {
      return NextResponse.json(
        { error: 'Only approved businesses can request creators.' },
        { status: 403 }
      );
    }

    const { creatorId, product, deliverables, budget, notes } = await req.json();

    if (!creatorId || !product || !deliverables || !budget) {
      return NextResponse.json(
        { error: 'Creator, product, deliverables, and proposed budget are required.' },
        { status: 400 }
      );
    }

    const creator = await User.findById(creatorId);
    if (!creator || creator.role !== 'creator') {
      return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
    }

    const deal = await Deal.create({
      creatorId: creator._id.toString(),
      creatorName: creator.name,
      creatorEmail: creator.email,
      businessId: business._id.toString(),
      businessName: business.name,
      businessEmail: business.email,
      company: business.company || business.name,
      product: product.trim(),
      niche: creator.niche || 'General',
      deliverables: deliverables.trim(),
      budget: budget.trim(),
      proposedBudget: budget.trim(),
      notes: (notes || '').trim(),
      source: 'direct_request',
      dealValue: 0,
      paidAmount: 0,
      status: 'proposed',
    });

    return NextResponse.json({
      success: true,
      deal: {
        id: deal._id.toString(),
        product: deal.product,
        creatorName: deal.creatorName,
        status: deal.status,
      },
    });
  } catch (error: any) {
    console.error('[deals/request]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit creator request.' },
      { status: 500 }
    );
  }
}
