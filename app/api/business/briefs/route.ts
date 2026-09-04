import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect, User, CampaignBrief } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'business') {
      return NextResponse.json({ error: 'Business account required.' }, { status: 403 });
    }

    const briefs = await CampaignBrief.find({ businessId: user._id.toString() })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      briefs: briefs.map((b: any) => ({
        id: b._id.toString(),
        product: b.product,
        niche: b.niche,
        minAudience: b.minAudience,
        budget: b.budget,
        deliverables: b.deliverables,
        description: b.description,
        status: b.status,
        created_at: b.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load briefs' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'business') {
      return NextResponse.json({ error: 'Business account required.' }, { status: 403 });
    }

    const body = await req.json();
    const { product, description, niche, minAudience, budget, deliverables } = body;

    if (!product || !description || !niche || !budget || !deliverables) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const brief = await CampaignBrief.create({
      businessId: user._id.toString(),
      businessName: user.name,
      company: user.company || '',
      product: product.trim(),
      description: description.trim(),
      niche,
      minAudience: Number(minAudience) || 0,
      budget,
      deliverables: deliverables.trim(),
      status: 'submitted',
    });

    return NextResponse.json({
      success: true,
      brief: {
        id: brief._id.toString(),
        product: brief.product,
        status: brief.status,
        created_at: brief.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to submit brief.' },
      { status: 500 }
    );
  }
}
