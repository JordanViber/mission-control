import { NextResponse } from 'next/server';
import { getWorkerRegistry, reconcileWorkerRegistry } from '@/lib/session-registry';

export const dynamic = 'force-dynamic';

export async function POST() {
  reconcileWorkerRegistry();
  return NextResponse.json({ ok: true, registry: getWorkerRegistry() });
}
