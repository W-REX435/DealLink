import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect, User, CampaignBrief, Match, Deal } from '@/lib/mongo';
import { sendOfferAcceptedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/** Briefs matched to the logged-in creator's niche + audience size. */
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

    const niche = user.niche || 'Tech & SaaS';
    const audience = user.subscriberCount || 0;

    // Briefs that fit this creator and have no decision yet
    const available = await CampaignBrief.find({
      niche,
      minAudience: { $lte: audience },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Decisions this creator already made
    const decisions = await Match.find({ creatorId: user._id.toString() }).lean();
    const decidedBriefIds = new Set(decisions.map((d) => d.briefId));

    const inbox = available
      .filter((b: any) => !decidedBriefIds.has(b._id.toString()))
      .map((b: any) => ({
        id: b._id.toString(),
        company: b.company,
        businessName: b.businessName,
        product: b.product,
        description: b.description,
        niche: b.niche,
        minAudience: b.minAudience,
        budget: b.budget,
        deliverables: b.deliverables,
        status: b.status,
        created_at: b.createdAt,
      }));

    const decided = decisions.map((d) => ({
      id: d.briefId,
      product: d.product,
      company: d.company,
      status: d.status,
      decided_at: d.createdAt,
    }));

    return NextResponse.json({ inbox, decided });
  } catch (error: any) {
    console.error('[creators/matches]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to load matches' },
      { status: 500 }
    );
  }
}

/** Accept or decline a matched brief. */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { briefId, action } = await req.json();
    if (!briefId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const brief = await CampaignBrief.findById(briefId);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found.' }, { status: 404 });
    }

    const match = await Match.create({
      briefId: brief._id.toString(),
      creatorId: user._id.toString(),
      creatorName: user.name,
      businessName: brief.businessName,
      company: brief.company,
      product: brief.product,
      status: action === 'accept' ? 'accepted' : 'declined',
    });

    if (action === 'accept') {
      brief.status = 'matched';
      await brief.save();

      // Create the deal pipeline entry
      const business = await User.findById(brief.businessId);
      await Deal.create({
        briefId: brief._id.toString(),
        matchId: match._id.toString(),
        creatorId: user._id.toString(),
        creatorName: user.name,
        creatorEmail: user.email,
        businessId: brief.businessId,
        businessName: brief.businessName,
        businessEmail: business?.email || '',
        company: brief.company,
        product: brief.product,
        niche: brief.niche,
        deliverables: brief.deliverables,
        budget: brief.budget,
        status: 'proposed',
      });

      if (business?.email) {
        await sendOfferAcceptedEmail(business.email, {
          businessName: business.name,
          product: brief.product,
          creatorName: user.name,
        });
      }
    }

    return NextResponse.json({
      success: true,
      match: {
        id: match._id.toString(),
        status: match.status,
      },
    });
  } catch (error: any) {
    // Duplicate key = already decided
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: 'You have already responded to this brief.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || 'Failed to update match.' },
      { status: 500 }
    );
  }
}
