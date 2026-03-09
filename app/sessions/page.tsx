import { SectionPage } from '@/components/section-page';
import { getSessionSummary, getWorkers } from '@/lib/data';

export default function SessionsPage() {
  const sessionSummary = getSessionSummary();
  const workers = getWorkers();

  return (
    <SectionPage currentPath="/sessions" title="Sessions" subtitle="Runtime view for persistent workers, task workers, and future reconciliation health.">
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Session summary</h3><span className="muted">Runtime goals</span></div>
          <div className="stack">
            {sessionSummary.map((item) => (
              <div key={item.label} className="subcard"><div className="subtleRow"><strong>{item.label}</strong><span>{item.value}</span></div></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Persistent worker targets</h3><span className="muted">Planned linkage</span></div>
          <div className="stack">
            {workers.map((worker) => (
              <div key={worker.id} className="subcard"><div className="subtleRow"><strong>{worker.name}</strong><span className="muted">{worker.model}</span></div></div>
            ))}
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
