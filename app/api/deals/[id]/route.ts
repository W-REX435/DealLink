import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { auth } from '@/auth';
import { dbConnect, User, Deal } from '@/lib/mongo';
import {
  sendDealActivatedEmail,
  sendDealCompletedEmail,
  sendDealPaidEmail,
} from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * Deal transitions (role-guarded):
 *   business + proposed  → start (set dealValue)   → active
 *   creator  + active    → complete                → completed
 *   business + completed → pay (set paidAmount)    → paid
 *   either   + proposed/active → cancel            → cancelled
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Deal not found.' }, { status: 404 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, amount } = await req.json();
    if (!['start', 'complete', 'pay', 'cancel'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const deal = await Deal.findById(params.id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found.' }, { status: 404 });
    }

    const isBusiness = deal.businessId === user._id.toString();
    const isCreator = deal.creatorId === user._id.toString();
    if (!isBusiness && !isCreator) {
      return NextResponse.json({ error: 'Not your deal.' }, { status: 403 });
    }

    switch (action) {
      case 'start': {
        if (!isBusiness || deal.status !== 'proposed') {
          return NextResponse.json(
            { error: 'Only the business can start a proposed deal.' },
            { status: 403 }
          );
        }
        deal.dealValue = Number(amount) || 0;
        deal.status = 'active';
        deal.startedAt = new Date();
        await deal.save();
        if (deal.creatorEmail) {
          await sendDealActivatedEmail(deal.creatorEmail, {
            name: deal.creatorName,
            product: deal.product,
            company: deal.company,
            dealValue: deal.dealValue,
          });
        }
        break;
      }

      case 'complete': {
        if (!isCreator || deal.status !== 'active') {
          return NextResponse.json(
            { error: 'Only the creator can complete an active deal.' },
            { status: 403 }
          );
        }
        deal.status = 'completed';
        deal.completedAt = new Date();
        await deal.save();
        if (deal.businessEmail) {
          await sendDealCompletedEmail(deal.businessEmail, {
            businessName: deal.businessName,
            product: deal.product,
            creatorName: deal.creatorName,
          });
        }
        break;
      }

      case 'pay': {
        if (!isBusiness || deal.status !== 'completed') {
          return NextResponse.json(
            { error: 'Only the business can pay a completed deal.' },
            { status: 403 }
          );
        }
        deal.paidAmount = Number(amount) || deal.dealValue || 0;
        deal.status = 'paid';
        deal.paidAt = new Date();
        await deal.save();
        if (deal.creatorEmail) {
          await sendDealPaidEmail(deal.creatorEmail, {
            name: deal.creatorName,
            product: deal.product,
            company: deal.company,
            amount: deal.paidAmount,
          });
        }
        break;
      }

      case 'cancel': {
        if (!['proposed', 'active'].includes(deal.status)) {
          return NextResponse.json(
            { error: 'This deal can no longer be cancelled.' },
            { status: 400 }
          );
        }
        deal.status = 'cancelled';
        await deal.save();
        break;
      }
    }

    return NextResponse.json({ success: true, status: deal.status });
  } catch (error: any) {
    console.error('[deals transition]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update deal.' },
      { status: 500 }
    );
  }
}
