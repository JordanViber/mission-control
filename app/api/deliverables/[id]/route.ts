import { NextRequest, NextResponse } from 'next/server';
import { updateDeliverable } from '@/lib/deliverables-store';
import type { UpdateDeliverableInput } from '@/lib/api-types';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as UpdateDeliverableInput;
  const record = updateDeliverable(id, body);
  if (!record) return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 });
  return NextResponse.json(record);
}
