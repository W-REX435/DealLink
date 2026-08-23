import { NextResponse } from 'next/server';
import { createBusinessLead } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, website, promotion_needs } = body;

    if (!name || !company || !email || !promotion_needs) {
      return NextResponse.json(
        { error: 'Please provide your name, company, email, and details on what you want to promote.' },
        { status: 400 }
      );
    }

    const lead = createBusinessLead({
      name,
      company,
      email,
      website: website || '',
      promotion_needs,
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit inquiry.' }, { status: 500 });
  }
}
