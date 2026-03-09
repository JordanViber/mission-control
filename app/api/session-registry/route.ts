import { NextResponse } from 'next/server';
import { getWorkerRegistry } from '@/lib/session-registry';

export function GET() {
  return NextResponse.json(getWorkerRegistry());
}
