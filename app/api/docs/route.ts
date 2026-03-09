import { NextResponse } from 'next/server';
import { getDocs } from '@/lib/data';

export function GET() {
  return NextResponse.json(getDocs());
}
