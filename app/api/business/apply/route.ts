import { NextResponse } from 'next/server';
import { dbConnect, BusinessApplication } from '@/lib/mongo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactName, email, company, website, budgetRange, goals, timeline } = body;

    if (!contactName || !email || !company || !budgetRange || !goals || !timeline) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    await dbConnect();
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await BusinessApplication.findOne({ email: normalizedEmail });
    if (existing && existing.status === 'pending') {
      return NextResponse.json(
        { error: 'You already have a pending application. We will review it shortly.' },
        { status: 409 }
      );
    }

    const application = await BusinessApplication.create({
      contactName: contactName.trim(),
      email: normalizedEmail,
      company: company.trim(),
      website: (website || '').trim(),
      budgetRange,
      goals: goals.trim(),
      timeline,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application._id.toString(),
        status: application.status,
        created_at: application.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[business/apply]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit application.' },
      { status: 500 }
    );
  }
}
