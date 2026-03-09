import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/data';
import { getDb } from '@/lib/db';
import { makeId } from '@/lib/id';
import type { CreateTaskInput } from '@/lib/api-types';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const tasks = getTasks();
  if (!status) return NextResponse.json(tasks);
  return NextResponse.json(tasks.filter((task) => task.status.toLowerCase().replace(/\s+/g, '_') === status.toLowerCase()));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateTaskInput;
  if (!body.title || !body.status || !body.owner || !body.project || !body.priority) {
    return NextResponse.json({ error: 'title, status, owner, project, and priority are required' }, { status: 400 });
  }

  const id = body.id || makeId('MC');
  const db = getDb();
  db.prepare('INSERT INTO tasks (id, title, status, owner, project, priority) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, body.title, body.status, body.owner, body.project, body.priority);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return NextResponse.json(task, { status: 201 });
}
