import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/data';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const tasks = getTasks();
  if (!status) return NextResponse.json(tasks);
  return NextResponse.json(tasks.filter((task) => task.status.toLowerCase().replace(/\s+/g, '_') === status.toLowerCase()));
}
