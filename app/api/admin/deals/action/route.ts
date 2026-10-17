import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, User, CampaignBrief, Deal, Match, Notification } from '@/lib/mongo';
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

    const body = await req.json();
    const { action, targetType, targetId, dealValue } = body;

    await dbConnect();

    // 1. DELETE DEAL
    if (action === 'delete_deal') {
      const dealId = body.dealId || targetId;
      if (!dealId) {
        return NextResponse.json({ error: 'Deal ID is required.' }, { status: 400 });
      }
      await Deal.findByIdAndDelete(dealId);
      return NextResponse.json({ success: true, message: 'Deal deleted successfully.' });
    }

    // 2. CREATE FULL CAMPAIGN (Links a business to one or multiple creators)
    if (action === 'create_campaign') {
      const {
        businessId,
        creatorIds,
        product,
        niche,
        deliverables,
        budget,
        notes,
        status = 'active',
      } = body;

      if (!product?.trim()) {
        return NextResponse.json({ error: 'Campaign / Product name is required.' }, { status: 400 });
      }

      if (!businessId) {
        return NextResponse.json({ error: 'Please select a business for this campaign.' }, { status: 400 });
      }

      const business = await User.findById(businessId);
      if (!business) {
        return NextResponse.json({ error: 'Selected business not found.' }, { status: 404 });
      }

      const selectedCreatorIds = Array.isArray(creatorIds) && creatorIds.length > 0
        ? creatorIds
        : (body.creatorId ? [body.creatorId] : []);

      if (selectedCreatorIds.length === 0) {
        return NextResponse.json({ error: 'Please select at least one creator for this campaign.' }, { status: 400 });
      }

      const creators = await User.find({ _id: { $in: selectedCreatorIds } });
      if (creators.length === 0) {
        return NextResponse.json({ error: 'No valid creators found.' }, { status: 404 });
      }

      const numVal = Number(dealValue) || (Number(String(budget).replace(/[^0-9.]/g, '')) || 1500);
      const isAutoActive = status === 'active';

      const createdDeals = [];

      for (const creator of creators) {
        const deal = await Deal.create({
          creatorId: creator._id.toString(),
          creatorName: creator.name,
          creatorEmail: creator.email,
          businessId: business._id.toString(),
          businessName: business.name || business.company,
          businessEmail: business.email,
          company: business.company || business.name,
          product: product.trim(),
          niche: niche || creator.niche || 'Tech & SaaS',
          deliverables: deliverables || '1 Instagram Reel + 1 Story',
          budget: budget ? String(budget) : `$${numVal.toLocaleString()}`,
          dealValue: numVal,
          paidAmount: 0,
          notes: notes?.trim() || '',
          source: 'direct_request',
          status: status,
          startedAt: isAutoActive ? new Date() : undefined,
        });

        createdDeals.push(deal);

        // Notify Creator
        try {
          await Notification.create({
            type: 'new_message',
            message: `New Campaign Partnership: ${product.trim()} with ${business.company || business.name} ($${numVal.toLocaleString()})`,
            fromUserId: 'admin',
            fromUserName: 'DealLink Admin',
            fromUserEmail: 'admin@deallink.co',
            toUserId: creator._id.toString(),
            relatedId: deal._id.toString(),
            read: false,
          });

          if (isAutoActive && creator.email) {
            await sendDealActivatedEmail(creator.email, {
              name: creator.name,
              product: product.trim(),
              company: business.company || business.name,
              dealValue: numVal,
            });
          }
        } catch (notifErr) {
          console.error('[create_campaign_notify_creator]', notifErr);
        }
      }

      // Notify Business
      try {
        await Notification.create({
          type: 'new_message',
          message: `Campaign Activated: ${product.trim()} with ${createdDeals.length} creator(s)`,
          fromUserId: 'admin',
          fromUserName: 'DealLink Admin',
          fromUserEmail: 'admin@deallink.co',
          toUserId: business._id.toString(),
          read: false,
        });
      } catch (bNotifErr) {}

      return NextResponse.json({
        success: true,
        message: `Campaign created successfully with ${createdDeals.length} creator(s).`,
        deals: createdDeals,
      });
    }

    // 3. LEGACY DEAL ACTIONS
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

    // 4. LEGACY MATCH ACTIONS
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

    return NextResponse.json({ error: 'Invalid parameters or action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[admin/deals/action]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process admin deal action.' },
      { status: 500 }
    );
  }
}
