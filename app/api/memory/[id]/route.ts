import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { updateMemoryItem } from '@/lib/records-store';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const item = db.prepare('SELECT * FROM memory_items WHERE id = ?').get(id);
  if (!item) return NextResponse.json({ error: 'Memory item not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const record = updateMemoryItem(id, body);
  if (!record) return NextResponse.json({ error: 'Memory item not found' }, { status: 404 });
  return NextResponse.json(record);
}
