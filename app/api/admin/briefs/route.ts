import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, CampaignBrief, User } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

function isAdmin() {
  return cookies().get('deallink_admin_auth')?.value === 'authenticated_rex';
}

export async function POST(req: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    await dbConnect();

    // 1. Delete brief
    if (action === 'delete') {
      const { id } = body;
      if (!id) return NextResponse.json({ error: 'Brief ID required.' }, { status: 400 });
      await CampaignBrief.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Brief deleted successfully.' });
    }

    // 2. Create brief
    if (action === 'create') {
      const {
        businessId,
        company,
        product,
        description,
        niche,
        minAudience,
        budget,
        deliverables,
        status,
      } = body;

      if (!product?.trim() || !description?.trim() || !company?.trim()) {
        return NextResponse.json(
          { error: 'Product name, Company, and Description are required.' },
          { status: 400 }
        );
      }

      // If businessId is provided, get business name
      let bName = company.trim();
      let bId = businessId || 'admin_assigned';
      if (businessId) {
        const bUser = await User.findById(businessId);
        if (bUser) {
          bName = bUser.name || bUser.company || company;
        }
      }

      const brief = await CampaignBrief.create({
        businessId: bId,
        businessName: bName,
        company: company.trim(),
        product: product.trim(),
        description: description.trim(),
        niche: niche || 'Tech & SaaS',
        minAudience: Number(minAudience) || 0,
        budget: budget || '$1,000 - $3,000',
        deliverables: deliverables || '1 Dedicated Video + 1 Social Post',
        status: status || 'submitted',
      });

      return NextResponse.json({ success: true, brief });
    }

    // 3. Edit brief
    if (action === 'edit') {
      const {
        id,
        company,
        product,
        description,
        niche,
        minAudience,
        budget,
        deliverables,
        status,
      } = body;

      if (!id) return NextResponse.json({ error: 'Brief ID required.' }, { status: 400 });

      const brief = await CampaignBrief.findById(id);
      if (!brief) return NextResponse.json({ error: 'Brief not found.' }, { status: 404 });

      if (company !== undefined) brief.company = company.trim();
      if (product !== undefined) brief.product = product.trim();
      if (description !== undefined) brief.description = description.trim();
      if (niche !== undefined) brief.niche = niche;
      if (minAudience !== undefined) brief.minAudience = Number(minAudience) || 0;
      if (budget !== undefined) brief.budget = budget;
      if (deliverables !== undefined) brief.deliverables = deliverables;
      if (status !== undefined) brief.status = status;

      await brief.save();
      return NextResponse.json({ success: true, brief });
    }

    // 4. Fallback: Status update (legacy support)
    const { id, status } = body;
    if (id && ['submitted', 'reviewing', 'matched'].includes(status)) {
      const brief = await CampaignBrief.findById(id);
      if (!brief) return NextResponse.json({ error: 'Brief not found.' }, { status: 404 });
      brief.status = status;
      await brief.save();
      return NextResponse.json({ success: true, status });
    }

    return NextResponse.json({ error: 'Invalid request parameters.' }, { status: 400 });
  } catch (error: any) {
    console.error('[admin_briefs]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process brief request.' },
      { status: 500 }
    );
  }
}
