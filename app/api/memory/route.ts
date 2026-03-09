import { NextRequest, NextResponse } from 'next/server';
import { getMemoryItems } from '@/lib/data';
import { getDb } from '@/lib/db';
import { makeId } from '@/lib/id';
import type { CreateMemoryInput } from '@/lib/api-types';

export function GET() {
  return NextResponse.json(getMemoryItems());
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateMemoryInput;
  if (!body.title || !body.bucket || !body.source || !body.summary) {
    return NextResponse.json({ error: 'title, bucket, source, and summary are required' }, { status: 400 });
  }

  const id = body.id || makeId('mem');
  const db = getDb();
  db.prepare('INSERT INTO memory_items (id, title, bucket, project, source, summary) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, body.title, body.bucket, body.project ?? null, body.source, body.summary);

  return NextResponse.json(db.prepare('SELECT * FROM memory_items WHERE id = ?').get(id), { status: 201 });
}
