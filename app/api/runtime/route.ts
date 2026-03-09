import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getRuntimeStatus } from '@/lib/runtime';

export function GET() {
  return NextResponse.json(getRuntimeStatus());
}
