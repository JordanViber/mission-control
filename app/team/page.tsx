import { SectionPage } from '@/components/section-page';
import { getWorkers } from '@/lib/data';

export default function TeamPage() {
  const workers = getWorkers();

  return (
    <SectionPage currentPath="/team" title="Team" subtitle="Persistent teammates, reporting lines, model choices, and current ownership.">
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Org structure</h3><span className="muted">Reports-to map</span></div>
          <div className="orgLine"><span>Jordan</span><span className="muted">Owner / Approver</span></div>
          {workers.map((worker) => (
            <div className="orgLine" key={worker.id}><span>{worker.name}</span><span className="muted">Reports to {worker.reports_to}</span></div>
          ))}
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Worker roster</h3><span className="muted">Core team</span></div>
          <div className="stack">
            {workers.map((worker) => (
              <div className="subcard" key={worker.id}>
                <div className="subtleRow"><strong>{worker.name}</strong><span className="pill">{worker.status}</span></div>
                <div className="muted">{worker.role} • {worker.model}</div>
                <div style={{ marginTop: 8 }}>{worker.focus}</div>
                <div className="muted" style={{ marginTop: 8 }}>Current project: {worker.current_project}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
