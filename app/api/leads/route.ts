import { NextResponse } from 'next/server';
import { dbConnect, BusinessLead } from '@/lib/mongo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, website, promotion_needs } = body;

    if (!name || !company || !email || !promotion_needs) {
      return NextResponse.json(
        {
          error:
            'Please provide your name, company, email, and details on what you want to promote.',
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const lead = await BusinessLead.create({
      name: name.trim(),
      company: company.trim(),
      email: email.toLowerCase().trim(),
      website: (website || '').trim(),
      promotionNeeds: promotion_needs.trim(),
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: lead._id.toString(),
        name: lead.name,
        company: lead.company,
        email: lead.email,
        website: lead.website,
        promotion_needs: lead.promotionNeeds,
        created_at: lead.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[leads]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit inquiry.' },
      { status: 500 }
    );
  }
}
