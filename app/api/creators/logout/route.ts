import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('deallink_creator_id');
  return NextResponse.json({ success: true });
}
