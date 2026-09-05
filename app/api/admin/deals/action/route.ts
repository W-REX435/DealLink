import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, User, CampaignBrief, Deal, Match } from '@/lib/mongo';
import { sendDealActivatedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function isAdmin() {
  return cookies().get('deallink_admin_auth')?.value === 'authenticated_rex';
}

export async function POST(req: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetType, targetId, action, dealValue } = await req.json();

    if (!targetType || !targetId || !action) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    await dbConnect();

    if (targetType === 'deal') {
      const deal = await Deal.findById(targetId);
      if (!deal) {
        return NextResponse.json({ error: 'Deal not found.' }, { status: 404 });
      }

      if (action === 'approve_and_start') {
        const val = Number(dealValue) || deal.dealValue || 0;
        deal.dealValue = val;
        deal.status = 'active';
        deal.startedAt = new Date();
        await deal.save();

        if (deal.creatorEmail) {
          await sendDealActivatedEmail(deal.creatorEmail, {
            name: deal.creatorName,
            product: deal.product,
            company: deal.company,
            dealValue: val,
          });
        }

        return NextResponse.json({ success: true, deal });
      }

      if (action === 'cancel') {
        deal.status = 'cancelled';
        await deal.save();
        return NextResponse.json({ success: true, deal });
      }
    }

    if (targetType === 'match') {
      const match = await Match.findById(targetId);
      if (!match) {
        return NextResponse.json({ error: 'Match not found.' }, { status: 404 });
      }

      if (action === 'approve_and_create_deal') {
        const brief = await CampaignBrief.findById(match.briefId);
        const creator = await User.findById(match.creatorId);

        if (!brief || !creator) {
          return NextResponse.json({ error: 'Brief or creator not found.' }, { status: 404 });
        }

        const business = await User.findById(brief.businessId);
        const val = Number(dealValue) || 0;

        match.status = 'accepted';
        await match.save();

        let deal = await Deal.findOne({ matchId: match._id.toString() });
        if (!deal) {
          deal = await Deal.create({
            briefId: brief._id.toString(),
            matchId: match._id.toString(),
            creatorId: creator._id.toString(),
            creatorName: creator.name,
            creatorEmail: creator.email,
            businessId: brief.businessId,
            businessName: brief.businessName,
            businessEmail: business?.email || '',
            company: brief.company,
            product: brief.product,
            niche: brief.niche,
            deliverables: brief.deliverables,
            budget: brief.budget,
            proposedBudget: match.proposedRate || brief.budget,
            notes: match.pitch || '',
            source: 'brief_application',
            dealValue: val,
            paidAmount: 0,
            status: 'active',
            startedAt: new Date(),
          });
        } else {
          deal.status = 'active';
          deal.dealValue = val;
          deal.startedAt = new Date();
          await deal.save();
        }

        if (creator.email) {
          await sendDealActivatedEmail(creator.email, {
            name: creator.name,
            product: brief.product,
            company: brief.company,
            dealValue: val,
          });
        }

        return NextResponse.json({ success: true, deal, match });
      }

      if (action === 'decline') {
        match.status = 'declined';
        await match.save();
        return NextResponse.json({ success: true, match });
      }
    }

    return NextResponse.json({ error: 'Invalid targetType or action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[admin/deals/action]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process admin deal action.' },
      { status: 500 }
    );
  }
}
