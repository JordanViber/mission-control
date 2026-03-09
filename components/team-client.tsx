'use client';

import { useState } from 'react';
import type { Worker, WorkerStatus } from '@/lib/types';

const statuses: WorkerStatus[] = ['Healthy', 'Busy', 'Needs attention'];

export function TeamClient({ initialWorkers }: { initialWorkers: Worker[] }) {
  const [workers, setWorkers] = useState(initialWorkers);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateWorker(id: string, status: WorkerStatus) {
    setSavingId(id);
    const res = await fetch(`/api/workers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) {
      const updated = await res.json() as Worker;
      setWorkers((current) => current.map((worker) => worker.id === id ? updated : worker));
    }
    setSavingId(null);
  }

  return (
    <div className="splitGrid">
      <div className="card">
        <div className="panelTitle"><h3>Org structure</h3><span className="muted">Reports-to map</span></div>
        <div className="orgLine"><span>Jordan</span><span className="muted">Owner / Approver</span></div>
        {workers.map((worker) => (
          <div className="orgLine" key={worker.id}><span>{worker.name}</span><span className="muted">Reports to {worker.reports_to}</span></div>
        ))}
      </div>
      <div className="card">
        <div className="panelTitle"><h3>Worker roster</h3><span className="muted">Editable status</span></div>
        <div className="stack">
          {workers.map((worker) => (
            <div className="subcard" key={worker.id}>
              <div className="subtleRow"><strong>{worker.name}</strong><span className="muted">{worker.role}</span></div>
              <div className="muted" style={{ marginTop: 6 }}>{worker.model}</div>
              <div style={{ marginTop: 8 }}>{worker.focus}</div>
              <div className="muted" style={{ marginTop: 8 }}>Current project: {worker.current_project}</div>
              <select className="input" style={{ marginTop: 10 }} value={worker.status} disabled={savingId === worker.id} onChange={(e) => updateWorker(worker.id, e.target.value as WorkerStatus)}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
