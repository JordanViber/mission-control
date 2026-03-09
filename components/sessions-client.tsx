'use client';

import { useState } from 'react';
import type { Worker } from '@/lib/types';

interface SessionEntry {
  id: string;
  worker: string;
  session_type: 'persistent_worker' | 'task_worker' | 'planning_session';
  health: 'Healthy' | 'Warning' | 'Offline';
  target: string;
  last_check: string;
  strategy: string;
}

export function SessionsClient({ workers }: { workers: Worker[] }) {
  const [sessions, setSessions] = useState<SessionEntry[]>([
    { id: 'sess-operator', worker: 'Operator', session_type: 'persistent_worker', health: 'Healthy', target: 'Primary orchestrator session', last_check: 'Just now', strategy: 'Reuse existing persistent worker session' },
    { id: 'sess-researcher', worker: 'Researcher', session_type: 'persistent_worker', health: 'Healthy', target: 'Research continuity', last_check: 'Just now', strategy: 'Respawn if missing, preserve role identity' },
    { id: 'sess-developer', worker: 'Developer', session_type: 'persistent_worker', health: 'Warning', target: 'Implementation continuity', last_check: 'Pending live gateway hookup', strategy: 'Persistent by default, allow task-worker fanout later' },
    { id: 'sess-reviewer', worker: 'Reviewer', session_type: 'persistent_worker', health: 'Healthy', target: 'Verification continuity', last_check: 'Just now', strategy: 'Reuse persistent review context' },
  ]);

  const [notes, setNotes] = useState('Reconciler should compare runtime truth, DB state, and UI projections before healing drift.');

  function cycleHealth(id: string) {
    setSessions((current) => current.map((entry) => {
      if (entry.id !== id) return entry;
      const next = entry.health === 'Healthy' ? 'Warning' : entry.health === 'Warning' ? 'Offline' : 'Healthy';
      return { ...entry, health: next };
    }));
  }

  return (
    <div className="stack">
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Persistent worker registry</h3><span className="muted">Scaffold</span></div>
          <div className="stack">
            {sessions.map((entry) => (
              <div key={entry.id} className="subcard">
                <div className="subtleRow"><strong>{entry.worker}</strong><span className="pill">{entry.health}</span></div>
                <div className="muted">{entry.session_type} • {entry.target}</div>
                <div style={{ marginTop: 8 }} className="muted">Strategy: {entry.strategy}</div>
                <div className="muted" style={{ marginTop: 6 }}>Last check: {entry.last_check}</div>
                <button className="button" style={{ marginTop: 10 }} onClick={() => cycleHealth(entry.id)}>Cycle health</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Reconciliation plan</h3><span className="muted">Design surface</span></div>
          <ul className="list">
            <li>Runtime is source of truth for live session existence.</li>
            <li>DB stores desired persistent worker mappings and history.</li>
            <li>Reconciler repairs drift, updates health, and decides when to respawn.</li>
          </ul>
          <textarea className="input" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ marginTop: 14 }} />
          <div className="muted" style={{ marginTop: 12 }}>Tracked workers: {workers.map((worker) => worker.name).join(', ')}</div>
        </div>
      </div>
    </div>
  );
}
