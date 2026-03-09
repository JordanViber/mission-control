import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { makeId } from '@/lib/id';
import { createTask, listTasks } from '@/lib/tasks-store';
import type { CreateTaskInput } from '@/lib/api-types';
import type { Task } from '@/lib/types';

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tasks = listTasks();
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
    const task = createTask({
      id,
      title: body.title,
      status: body.status,
      owner: body.owner,
      project: body.project,
      priority: body.priority,
    } as Task);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
