import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect, User, CampaignBrief, Match } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const creator = await User.findById(session.user.id);
    if (!creator || creator.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only registered creators can apply to campaign briefs.' },
        { status: 403 }
      );
    }

    const { briefId, pitch, proposedRate } = await req.json();

    if (!briefId) {
      return NextResponse.json({ error: 'Brief ID is required.' }, { status: 400 });
    }

    const brief = await CampaignBrief.findById(briefId);
    if (!brief) {
      return NextResponse.json({ error: 'Campaign brief not found.' }, { status: 404 });
    }

    const existingMatch = await Match.findOne({
      briefId,
      creatorId: creator._id.toString(),
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: 'You have already applied to this campaign brief.' },
        { status: 409 }
      );
    }

    const match = await Match.create({
      briefId: brief._id.toString(),
      creatorId: creator._id.toString(),
      creatorName: creator.name,
      businessName: brief.businessName,
      company: brief.company,
      product: brief.product,
      pitch: (pitch || '').trim(),
      proposedRate: (proposedRate || '').trim(),
      source: 'creator_applied',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      match: {
        id: match._id.toString(),
        product: match.product,
        company: match.company,
        status: match.status,
      },
    });
  } catch (error: any) {
    console.error('[briefs/apply]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit application.' },
      { status: 500 }
    );
  }
}
