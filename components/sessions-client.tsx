'use client';

import { useState } from 'react';
import type { Worker } from '@/lib/types';
import type { WorkerRegistryEntry } from '@/lib/session-registry';
import type { RuntimeStatus } from '@/lib/runtime';

export function SessionsClient({ workers, registry, runtime }: { workers: Worker[]; registry: WorkerRegistryEntry[]; runtime: RuntimeStatus }) {
  const [notes, setNotes] = useState('Reconciler should compare runtime truth, DB state, and UI projections before healing drift.');

  return (
    <div className="stack">
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Persistent worker registry</h3><span className="muted">Live-backed</span></div>
          <div className="stack">
            {registry.map((entry) => (
              <div key={entry.worker_id} className="subcard">
                <div className="subtleRow"><strong>{entry.worker_name}</strong><span className="pill">{entry.health}</span></div>
                <div className="muted">{entry.desired_session_type} • desired: {entry.desired_session_key}</div>
                <div className="muted" style={{ marginTop: 6 }}>actual: {entry.actual_session_key ?? 'not found'}</div>
                <div style={{ marginTop: 8 }} className="muted">reconciliation: {entry.reconciliation_status}</div>
                <div className="muted" style={{ marginTop: 6 }}>last check: {entry.last_checked_at}</div>
                {entry.notes ? <div className="muted" style={{ marginTop: 6 }}>{entry.notes}</div> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Runtime snapshot</h3><span className="muted">OpenClaw</span></div>
          <ul className="list">
            <li>Connected: {runtime.connected ? 'yes' : 'no'}</li>
            <li>Gateway: {runtime.gatewayUrl ?? 'unknown'}</li>
            <li>Live sessions seen: {runtime.sessions.length}</li>
          </ul>
          <textarea className="input" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ marginTop: 14 }} />
          <div className="muted" style={{ marginTop: 12 }}>Tracked workers: {workers.map((worker) => worker.name).join(', ')}</div>
        </div>
      </div>
    </div>
  );
}
