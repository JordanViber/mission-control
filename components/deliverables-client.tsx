'use client';

import { useState } from 'react';
import type { Deliverable, Task } from '@/lib/types';

const approvalOptions: Array<Deliverable['approval_status']> = ['draft', 'in_review', 'approved', 'changes_requested'];

export function DeliverablesClient({ initialDeliverables, tasks, project }: { initialDeliverables: Deliverable[]; tasks: Task[]; project: string }) {
  const [deliverables, setDeliverables] = useState(initialDeliverables);
  const [form, setForm] = useState({ task_id: tasks[0]?.id ?? '', title: '', deliverable_type: 'file' as Deliverable['deliverable_type'], approval_status: 'draft' as Deliverable['approval_status'], reviewer: 'Reviewer', approved_by: '', path: '', url: '', summary: '', created_at: new Date().toISOString().slice(0, 10) });

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/deliverables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, project, task_id: form.task_id || null, reviewer: form.reviewer || null, approved_by: form.approved_by || null, path: form.path || null, url: form.url || null }),
    });
    if (res.ok) {
      const created = await res.json() as Deliverable;
      setDeliverables((current) => [created, ...current]);
      setForm({ ...form, title: '', approved_by: '', path: '', url: '', summary: '' });
    }
  }

  async function updateItem(id: string, updates: Partial<Deliverable>) {
    const res = await fetch(`/api/deliverables/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json() as Deliverable;
      setDeliverables((current) => current.map((item) => item.id === id ? updated : item));
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
          <select className="input" value={form.approval_status} onChange={(e) => setForm({ ...form, approval_status: e.target.value as Deliverable['approval_status'] })}>
            {approvalOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input className="input" placeholder="Reviewer" value={form.reviewer} onChange={(e) => setForm({ ...form, reviewer: e.target.value })} />
        </div>
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
            <div className="formGrid compact" style={{ marginTop: 10 }}>
              <select className="input" value={item.approval_status} onChange={(e) => updateItem(item.id, { approval_status: e.target.value as Deliverable['approval_status'] })}>
                {approvalOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <input className="input" defaultValue={item.reviewer ?? ''} placeholder="Reviewer" onBlur={(e) => updateItem(item.id, { reviewer: e.target.value || null })} />
            </div>
            <div className="muted" style={{ marginTop: 6 }}>Approved by: {item.approved_by ?? '—'}</div>
            {item.path ? <div className="muted" style={{ marginTop: 6 }}>Path: {item.path}</div> : null}
            {item.url ? <div className="muted" style={{ marginTop: 6 }}>URL: {item.url}</div> : null}
            <div style={{ marginTop: 6 }}>{item.summary}</div>
            <div className="subtleRow" style={{ marginTop: 10 }}>
              <button className="button" onClick={() => updateItem(item.id, { approval_status: 'in_review', approved_by: null })}>Send to review</button>
              <button className="button" onClick={() => updateItem(item.id, { approval_status: 'approved', approved_by: 'Jordan' })}>Approve</button>
              <button className="button" onClick={() => updateItem(item.id, { approval_status: 'changes_requested', approved_by: null })}>Request changes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
