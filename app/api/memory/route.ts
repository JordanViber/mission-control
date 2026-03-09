import { NextResponse } from 'next/server';
import { getMemoryItems } from '@/lib/data';

export function GET() {
  return NextResponse.json(getMemoryItems());
}
