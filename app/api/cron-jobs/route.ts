import { NextRequest, NextResponse } from 'next/server';
import { getCronJobs } from '@/lib/data';
import { getDb } from '@/lib/db';
import { makeId } from '@/lib/id';
import type { CreateCronJobInput } from '@/lib/api-types';

export function GET() {
  return NextResponse.json(getCronJobs());
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateCronJobInput;
  if (!body.name || !body.schedule || !body.next_run || !body.owner || !body.status || !body.notes) {
    return NextResponse.json({ error: 'name, schedule, next_run, owner, status, and notes are required' }, { status: 400 });
  }

  const id = body.id || makeId('cron');
  const db = getDb();
  db.prepare('INSERT INTO cron_jobs (id, name, schedule, next_run, owner, project, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, body.name, body.schedule, body.next_run, body.owner, body.project ?? null, body.status, body.notes);

  return NextResponse.json(db.prepare('SELECT * FROM cron_jobs WHERE id = ?').get(id), { status: 201 });
}
