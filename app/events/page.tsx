import { SectionPage } from '@/components/section-page';

const events = [
  'Repo scaffold created and pushed to GitHub',
  'Initial architecture docs generated',
  'Left sidebar tool system established',
  'optionsTaxHub seeded as first project',
];

export default function EventsPage() {
  return (
    <SectionPage currentPath="/events" title="Events" subtitle="Human-readable system feed for key project and orchestration events.">
      <div className="stack">
        {events.map((event) => (
          <div className="card" key={event}>{event}</div>
        ))}
      </div>
    </SectionPage>
  );
}
