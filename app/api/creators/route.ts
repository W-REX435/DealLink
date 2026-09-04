import { NextResponse } from 'next/server';
import { dbConnect, User } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

/** Public creator directory — no auth required. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const niche = searchParams.get('niche') || '';
    const sort = searchParams.get('sort') || 'recent';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const perPage = 12;

    await dbConnect();

    const filter: Record<string, unknown> = {
      role: { $in: ['creator', 'admin'] },
    };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
        { niche: { $regex: q, $options: 'i' } },
      ];
    }
    if (niche) filter.niche = niche;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      recent: { createdAt: -1 },
      audience: { subscriberCount: -1 },
      name: { name: 1 },
    };

    const [creators, total] = await Promise.all([
      User.find(filter)
        .sort(sortMap[sort] || sortMap.recent)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      creators: creators.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        niche: c.niche || 'Other Niche',
        subscriber_count: c.subscriberCount || 0,
        channel_url: c.channelUrl || '',
        bio: c.bio || '',
        emailVerified: Boolean(c.emailVerified),
        created_at: c.createdAt,
      })),
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error: any) {
    console.error('[creators]', error);
    return NextResponse.json(
      { creators: [], pagination: { page: 1, perPage: 12, total: 0, totalPages: 0 } },
      { status: 500 }
    );
  }
}
