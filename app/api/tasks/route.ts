import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { makeId } from '@/lib/id';
import type { CreateTaskInput } from '@/lib/api-types';
import type { Task } from '@/lib/types';

function loadTasks(): Task[] {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks ORDER BY id').all() as Task[];
}

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tasks = loadTasks();
    if (!status) return NextResponse.json(tasks);
    return NextResponse.json(tasks.filter((task) => task.status.toLowerCase().replace(/\s+/g, '_') === status.toLowerCase()));
  } catch (error) {
    console.error('Failed to list tasks:', error);
    return NextResponse.json({ error: 'Failed to list tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
