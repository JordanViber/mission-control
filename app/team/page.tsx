import { SectionPage } from '@/components/section-page';
import { TeamClient } from '@/components/team-client';
import { getWorkers } from '@/lib/data';

export default function TeamPage() {
  const workers = getWorkers();

  return (
    <SectionPage currentPath="/team" title="Team" subtitle="Persistent teammates, reporting lines, model choices, and current ownership.">
      <TeamClient initialWorkers={workers} />
    </SectionPage>
  );
}
