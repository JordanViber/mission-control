'use client';

import { useState } from 'react';
import type { Deliverable, Task } from '@/lib/types';

export function DeliverablesClient({ initialDeliverables, tasks, project }: { initialDeliverables: Deliverable[]; tasks: Task[]; project: string }) {
  const [deliverables, setDeliverables] = useState(initialDeliverables);
  const [form, setForm] = useState({ task_id: tasks[0]?.id ?? '', title: '', deliverable_type: 'file' as Deliverable['deliverable_type'], path: '', url: '', summary: '', created_at: new Date().toISOString().slice(0, 10) });

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/deliverables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, project, task_id: form.task_id || null, path: form.path || null, url: form.url || null }),
    });
    if (res.ok) {
      const created = await res.json() as Deliverable;
      setDeliverables((current) => [created, ...current]);
      setForm({ ...form, title: '', path: '', url: '', summary: '' });
    }
  }

  return (
    <div className="card">
      <div className="panelTitle"><h3>Deliverables</h3><span className="pill">{deliverables.length}</span></div>
      <form className="stack" onSubmit={createItem}>
        <div className="formGrid compact">
          <select className="input" value={form.task_id} onChange={(e) => setForm({ ...form, task_id: e.target.value })}>
            <option value="">No linked task</option>
            {tasks.map((task) => <option key={task.id} value={task.id}>{task.id} — {task.title}</option>)}
          </select>
          <select className="input" value={form.deliverable_type} onChange={(e) => setForm({ ...form, deliverable_type: e.target.value as Deliverable['deliverable_type'] })}>
            <option value="file">file</option>
            <option value="doc">doc</option>
            <option value="link">link</option>
            <option value="note">note</option>
          </select>
        </div>
        <input className="input" placeholder="Deliverable title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <div className="formGrid compact">
          <input className="input" placeholder="Path (optional)" value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} />
          <input className="input" placeholder="URL (optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </div>
        <textarea className="input" placeholder="Summary" rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
        <button className="button">Create deliverable</button>
      </form>
      <div className="stack" style={{ marginTop: 16 }}>
        {deliverables.map((item) => (
          <div className="subcard" key={item.id}>
            <div className="subtleRow"><strong>{item.title}</strong><span className="pill">{item.deliverable_type}</span></div>
            <div className="muted">Task: {item.task_id ?? 'unlinked'} • Created: {item.created_at}</div>
            {item.path ? <div className="muted" style={{ marginTop: 6 }}>Path: {item.path}</div> : null}
            {item.url ? <div className="muted" style={{ marginTop: 6 }}>URL: {item.url}</div> : null}
            <div style={{ marginTop: 6 }}>{item.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
