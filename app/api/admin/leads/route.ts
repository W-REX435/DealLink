import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect, BusinessLead } from '@/lib/mongo';

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

    // Delete lead
    if (action === 'delete') {
      const { leadId } = body;
      if (!leadId) {
        return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });
      }
      await BusinessLead.findByIdAndDelete(leadId);
      return NextResponse.json({ success: true, message: 'Lead deleted successfully.' });
    }

    // Create lead
    if (action === 'create' || !action) {
      const { name, company, email, website, promotion_needs } = body;

      if (!name?.trim() || !company?.trim() || !email?.trim()) {
        return NextResponse.json(
          { error: 'Name, Company, and Email are required.' },
          { status: 400 }
        );
      }

      const lead = await BusinessLead.create({
        name: name.trim(),
        company: company.trim(),
        email: email.toLowerCase().trim(),
        website: website?.trim() || '',
        promotionNeeds: promotion_needs?.trim() || 'General creator sponsorship inquiry',
      });

      return NextResponse.json({
        success: true,
        message: 'Lead created successfully.',
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
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[admin_leads]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process lead.' },
      { status: 500 }
    );
  }
}
