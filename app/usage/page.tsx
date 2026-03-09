import { SectionPage } from '@/components/section-page';
import { UsageClient } from '@/components/usage-client';
import { getUsageStatus, listUsageSnapshots } from '@/lib/usage';

export const dynamic = 'force-dynamic';

export default function UsagePage() {
  return (
    <SectionPage currentPath="/usage" title="Usage" subtitle="Track provider quota windows, read them in plain English, and record snapshots over time.">
      <UsageClient initialCurrent={getUsageStatus()} initialHistory={listUsageSnapshots()} />
    </SectionPage>
  );
}
