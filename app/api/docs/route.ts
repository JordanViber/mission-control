import { NextRequest, NextResponse } from 'next/server';
import { getDocs } from '@/lib/data';
import { getDb } from '@/lib/db';
import { makeId } from '@/lib/id';
import type { CreateDocInput } from '@/lib/api-types';

export function GET() {
  return NextResponse.json(getDocs());
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateDocInput;
  if (!body.title || !body.type || !body.updated || !body.summary) {
    return NextResponse.json({ error: 'title, type, updated, and summary are required' }, { status: 400 });
  }

  const id = body.id || makeId('doc');
  const db = getDb();
  db.prepare('INSERT INTO docs (id, title, type, updated, project, summary) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, body.title, body.type, body.updated, body.project ?? null, body.summary);

  return NextResponse.json(db.prepare('SELECT * FROM docs WHERE id = ?').get(id), { status: 201 });
}
