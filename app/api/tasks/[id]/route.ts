import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { UpdateTaskInput } from '@/lib/api-types';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as UpdateTaskInput;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const updates: string[] = [];
  const values: unknown[] = [];
  for (const field of ['title', 'status', 'owner', 'project', 'priority'] as const) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (!updates.length) {
    return NextResponse.json(existing);
  }

  values.push(id);
  db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return NextResponse.json(task);
}
