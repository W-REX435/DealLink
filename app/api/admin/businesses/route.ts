import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { dbConnect, User } from '@/lib/mongo';

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

    if (action === 'delete') {
      const { businessId } = body;
      if (!businessId) {
        return NextResponse.json({ error: 'Business ID is required.' }, { status: 400 });
      }

      const deleted = await User.findOneAndDelete({ _id: businessId, role: 'business' });
      if (!deleted) {
        return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Business deleted successfully.' });
    }

    if (action === 'create' || !action) {
      const { company, name, email, password, website } = body;

      if (!company?.trim() || !email?.trim()) {
        return NextResponse.json(
          { error: 'Company name and Email are required.' },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return NextResponse.json(
          { error: 'A user with this email already exists.' },
          { status: 400 }
        );
      }

      const rawPassword = password?.trim() || 'business123!';
      const hashedPassword = await bcrypt.hash(rawPassword, 12);

      const user = await User.create({
        company: company.trim(),
        name: (name?.trim() || company.trim()),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'business',
        channelUrl: website?.trim() || '',
        emailVerified: new Date(),
        verified: true,
      });

      return NextResponse.json({
        success: true,
        message: 'Business created successfully.',
        business: {
          id: user._id.toString(),
          company: user.company,
          name: user.name,
          email: user.email,
          website: user.channelUrl,
          created_at: user.createdAt,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[admin_businesses]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process business request.' },
      { status: 500 }
    );
  }
}
