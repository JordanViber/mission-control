import { NextRequest, NextResponse } from 'next/server';
import { getDeliverables } from '@/lib/data';
import { createDeliverable } from '@/lib/deliverables-store';
import { makeId } from '@/lib/id';
import type { CreateDeliverableInput } from '@/lib/api-types';
import type { Deliverable } from '@/lib/types';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(getDeliverables());
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateDeliverableInput;
  if (!body.project || !body.title || !body.deliverable_type || !body.summary || !body.created_at) {
    return NextResponse.json({ error: 'project, title, deliverable_type, summary, and created_at are required' }, { status: 400 });
  }

  const created = createDeliverable({
    id: body.id || makeId('deliv'),
    task_id: body.task_id ?? null,
    project: body.project,
    title: body.title,
    deliverable_type: body.deliverable_type,
    path: body.path ?? null,
    url: body.url ?? null,
    summary: body.summary,
    created_at: body.created_at,
  } as Deliverable);

  return NextResponse.json(created, { status: 201 });
}
