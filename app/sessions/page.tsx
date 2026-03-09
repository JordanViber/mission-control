import { SectionPage } from '@/components/section-page';
import { SessionsClient } from '@/components/sessions-client';
import { getWorkers } from '@/lib/data';

export default function SessionsPage() {
  const workers = getWorkers();

  return (
    <SectionPage currentPath="/sessions" title="Sessions" subtitle="Runtime view for persistent workers, task workers, and future reconciliation health.">
      <SessionsClient workers={workers} />
    </SectionPage>
  );
}
