import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { UpdateWorkerInput } from '@/lib/api-types';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as UpdateWorkerInput;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM workers WHERE id = ?').get(id);

  if (!existing) {
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
  }

  const updates: string[] = [];
  const values: unknown[] = [];
  for (const field of ['status', 'focus', 'current_project'] as const) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (!updates.length) return NextResponse.json(existing);

  values.push(id);
  db.prepare(`UPDATE workers SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  return NextResponse.json(db.prepare('SELECT * FROM workers WHERE id = ?').get(id));
}
