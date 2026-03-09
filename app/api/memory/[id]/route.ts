import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const item = db.prepare('SELECT * FROM memory_items WHERE id = ?').get(id);
  if (!item) return NextResponse.json({ error: 'Memory item not found' }, { status: 404 });
  return NextResponse.json(item);
}
