import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { updateTask } from '@/lib/tasks-store';
import type { UpdateTaskInput } from '@/lib/api-types';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as UpdateTaskInput;
  const task = updateTask(id, body);

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}
