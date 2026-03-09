import { NextResponse } from 'next/server';
import { getWorkers } from '@/lib/data';

export function GET() {
  return NextResponse.json(getWorkers());
}
