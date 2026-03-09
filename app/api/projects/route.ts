import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';

export function GET() {
  return NextResponse.json(getProjects());
}
