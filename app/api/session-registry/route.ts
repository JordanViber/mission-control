import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getWorkerRegistry } from '@/lib/session-registry';

export function GET() {
  return NextResponse.json(getWorkerRegistry());
}
