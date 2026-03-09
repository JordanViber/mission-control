import { NextResponse } from 'next/server';
import { getUsageStatus, listUsageSnapshots, recordUsageSnapshot } from '@/lib/usage';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ current: getUsageStatus(), history: listUsageSnapshots() });
}

export function POST() {
  return NextResponse.json(recordUsageSnapshot(), { status: 201 });
}
