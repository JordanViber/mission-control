import { NextResponse } from 'next/server';
import { getCronJobs } from '@/lib/data';

export function GET() {
  return NextResponse.json(getCronJobs());
}
