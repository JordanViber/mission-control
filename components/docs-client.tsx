'use client';

import Link from 'next/link';
import { useState } from 'react';
import { projectHref } from '@/lib/project-utils';
import type { DocItem } from '@/lib/types';

export function DocsClient({ initialDocs, projects }: { initialDocs: DocItem[]; projects: string[] }) {
  const [docs, setDocs] = useState(initialDocs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', type: 'Project' as DocItem['type'], updated: new Date().toISOString().slice(0, 10), project: projects[0] ?? '', summary: '' });

  async function createDoc(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/docs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, project: form.project || null }) });
    if (res.ok) {
      const created = await res.json() as DocItem;
      setDocs((current) => [created, ...current]);
      setForm({ ...form, title: '', summary: '' });
    }
  }

  async function updateDoc(id: string, updates: Partial<DocItem>) {
    const res = await fetch(`/api/docs/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    if (res.ok) {
      const updated = await res.json() as DocItem;
      setDocs((current) => current.map((doc) => doc.id === id ? updated : doc));
      setEditingId(null);
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="panelTitle"><h3>Create doc</h3><span className="muted">Top-level docs tool</span></div>
        <form className="stack" onSubmit={createDoc}>
          <input className="input" placeholder="Doc title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="formGrid compact">
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocItem['type'] })}><option value="Project">Project</option><option value="Spec">Spec</option><option value="Runbook">Runbook</option><option value="Architecture">Architecture</option></select>
            <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}><option value="">No project</option>{projects.map((project) => <option key={project} value={project}>{project}</option>)}</select>
          </div>
          <textarea className="input" placeholder="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required rows={4} />
          <button className="button">Create doc</button>
        </form>
      </div>
      {docs.map((doc) => (
        <div className="card" key={doc.id}>
          <div className="panelTitle"><h3>{doc.title}</h3><span className="pill">{doc.type}</span></div>
          <div className="muted">Updated {doc.updated}{doc.project ? ` • Project: ${doc.project}` : ''}</div>
          {editingId === doc.id ? (
            <div className="stack">
              <input className="input" defaultValue={doc.title} onBlur={(e) => updateDoc(doc.id, { title: e.target.value })} />
              <textarea className="input" defaultValue={doc.summary} rows={4} onBlur={(e) => updateDoc(doc.id, { summary: e.target.value })} />
            </div>
          ) : (
            <p>{doc.summary}</p>
          )}
          <div className="subtleRow">
            <Link href={projectHref(doc.project)} className="muted">Open related project →</Link>
            <button className="button" onClick={() => setEditingId(editingId === doc.id ? null : doc.id)}>{editingId === doc.id ? 'Done' : 'Edit'}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
