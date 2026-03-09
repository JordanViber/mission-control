import { NextRequest, NextResponse } from 'next/server';
import { updateDoc } from '@/lib/records-store';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const record = updateDoc(id, body);
  if (!record) return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
  return NextResponse.json(record);
}
