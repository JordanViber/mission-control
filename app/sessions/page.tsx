import { SectionPage } from '@/components/section-page';
import { SessionsClient } from '@/components/sessions-client';
import { getWorkers } from '@/lib/data';
import { getWorkerRegistry } from '@/lib/session-registry';
import { getRuntimeStatus } from '@/lib/runtime';

export default function SessionsPage() {
  const workers = getWorkers();
  const registry = getWorkerRegistry();
  const runtime = getRuntimeStatus();

  return (
    <SectionPage currentPath="/sessions" title="Sessions" subtitle="Runtime view for persistent workers, task workers, and future reconciliation health.">
      <SessionsClient workers={workers} registry={registry} runtime={runtime} />
    </SectionPage>
  );
}
