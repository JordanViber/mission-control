import { NextResponse } from 'next/server';
import { getRuntimeStatus } from '@/lib/runtime';

export function GET() {
  return NextResponse.json(getRuntimeStatus());
}
