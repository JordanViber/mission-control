import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { UpdateProjectInput } from '@/lib/api-types';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const project = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(id, id);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as UpdateProjectInput;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(id, id) as { id: string } | undefined;
  if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const updates: string[] = [];
  const values: unknown[] = [];
  for (const field of ['summary', 'priority', 'stage', 'owner', 'default_team', 'milestones'] as const) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (!updates.length) return NextResponse.json(existing);

  values.push(existing.id);
  db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  return NextResponse.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(existing.id));
}
