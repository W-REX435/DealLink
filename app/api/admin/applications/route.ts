import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { dbConnect, BusinessApplication } from '@/lib/mongo';
import {
  sendBusinessInviteEmail,
  sendBusinessRejectedEmail,
  isEmailConfigured,
} from '@/lib/email';

export const dynamic = 'force-dynamic';

function isAdmin() {
  return cookies().get('deallink_admin_auth')?.value === 'authenticated_rex';
}

export async function GET() {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const applications = await BusinessApplication.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      applications: applications.map((a: any) => ({
        id: a._id.toString(),
        contactName: a.contactName,
        email: a.email,
        company: a.company,
        website: a.website || '',
        budgetRange: a.budgetRange,
        goals: a.goals,
        timeline: a.timeline,
        status: a.status,
        created_at: a.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load applications' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = await req.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    await dbConnect();
    const application = await BusinessApplication.findById(id).select(
      '+inviteToken +inviteExpires'
    );
    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (action === 'approve') {
      application.status = 'approved';
      application.inviteToken = crypto.randomBytes(32).toString('hex');
      application.inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await application.save();
      await sendBusinessInviteEmail(
        application.email,
        application.contactName,
        application.company,
        application.inviteToken
      );
      return NextResponse.json({
        success: true,
        status: 'approved',
        emailConfigured: isEmailConfigured(),
      });
    }

    application.status = 'rejected';
    await application.save();
    await sendBusinessRejectedEmail(application.email, application.contactName, application.company);
    return NextResponse.json({
      success: true,
      status: 'rejected',
      emailConfigured: isEmailConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update application.' },
      { status: 500 }
    );
  }
}
