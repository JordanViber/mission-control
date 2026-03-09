'use client';

import { useState } from 'react';
import type { UsageSnapshot, UsageWindow } from '@/lib/types';

type UsageCurrent = {
  updatedAt: string | null;
  provider: string;
  providerId: string;
  plan: string | null;
  model: string | null;
  windows: UsageWindow[];
  shortTermStatus: string;
  weeklyStatus: string;
  overallStatus: string;
  recommendation: string;
};

export function UsageClient({ initialCurrent, initialHistory }: { initialCurrent: UsageCurrent; initialHistory: UsageSnapshot[] }) {
  const [current, setCurrent] = useState(initialCurrent);
  const [history, setHistory] = useState(initialHistory);
  const [saving, setSaving] = useState(false);

  async function refreshAndRecord() {
    setSaving(true);
    try {
      const res = await fetch('/api/usage', { method: 'POST' });
      if (res.ok) {
        const snapshot = await res.json() as UsageSnapshot;
        setHistory((items) => [snapshot, ...items.filter((item) => item.id !== snapshot.id)].slice(0, 20));
      }
      const currentRes = await fetch('/api/usage');
      if (currentRes.ok) {
        const payload = await currentRes.json() as { current: UsageCurrent; history: UsageSnapshot[] };
        setCurrent(payload.current);
        setHistory(payload.history);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack">
      <div className="kpiGrid">
        <div className="card"><div className="muted">Provider</div><div className="kpiValue" style={{ fontSize: 28 }}>{current.provider}</div><div className="muted">{current.plan ?? 'unknown plan'}</div></div>
        <div className="card"><div className="muted">Short-term</div><div className="kpiValue" style={{ fontSize: 28 }}>{current.shortTermStatus}</div><div className="muted">5-hour pressure</div></div>
        <div className="card"><div className="muted">Weekly</div><div className="kpiValue" style={{ fontSize: 28 }}>{current.weeklyStatus}</div><div className="muted">rolling weekly window</div></div>
        <div className="card"><div className="muted">Overall</div><div className="kpiValue" style={{ fontSize: 28 }}>{current.overallStatus}</div><div className="muted">default model {current.model ?? 'unknown'}</div></div>
      </div>

      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Plain-English summary</h3><button className="button" onClick={refreshAndRecord} disabled={saving}>{saving ? 'Refreshing…' : 'Refresh + record snapshot'}</button></div>
          <p><strong>Short-term:</strong> {current.shortTermStatus}</p>
          <p><strong>Weekly:</strong> {current.weeklyStatus}</p>
          <p><strong>Overall:</strong> {current.overallStatus}</p>
          <p className="muted" style={{ marginTop: 12 }}>{current.recommendation}</p>
          <div className="muted">Last updated: {current.updatedAt ?? 'unknown'}</div>
        </div>

        <div className="card">
          <div className="panelTitle"><h3>Provider windows</h3><span className="pill">{current.windows.length}</span></div>
          <div className="stack">
            {current.windows.map((window) => (
              <div key={window.label} className="subcard">
                <div className="subtleRow"><strong>{window.label}</strong><span className="pill">{window.remaining_percent}% left</span></div>
                <div className="muted">Used: {window.used_percent}%</div>
                <div className="muted">Reset: {window.reset_at ?? 'unknown'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="panelTitle"><h3>Snapshot history</h3><span className="pill">{history.length}</span></div>
        <div className="stack">
          {history.length === 0 ? <div className="muted">No snapshots recorded yet.</div> : history.map((item) => (
            <div key={item.id} className="subcard">
              <div className="subtleRow"><strong>{item.captured_at}</strong><span className="pill">{item.overall_status}</span></div>
              <div className="muted">Provider: {item.provider} • Plan: {item.plan ?? 'unknown'} • Model: {item.model ?? 'unknown'}</div>
              <div className="muted">Short-term: {item.short_term_status} • Weekly: {item.weekly_status}</div>
              <div style={{ marginTop: 6 }}>{item.recommendation}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
