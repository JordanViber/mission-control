'use client';

import { useMemo, useState } from 'react';
import type { MemoryItem } from '@/lib/types';

export function MemoryClient({ initialItems, projects }: { initialItems: MemoryItem[]; projects: string[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ title: '', bucket: 'Project' as MemoryItem['bucket'], project: projects[0] ?? '', source: 'Mission Control UI', summary: '' });

  const filtered = useMemo(() => items.filter((item) => [item.title, item.summary, item.source, item.project ?? ''].join(' ').toLowerCase().includes(query.toLowerCase())), [items, query]);

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/memory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, project: form.project || null }) });
    if (res.ok) {
      const created = await res.json() as MemoryItem;
      setItems((current) => [created, ...current]);
      setForm({ ...form, title: '', summary: '' });
    }
  }

  async function updateItem(id: string, updates: Partial<MemoryItem>) {
    const res = await fetch(`/api/memory/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    if (res.ok) {
      const updated = await res.json() as MemoryItem;
      setItems((current) => current.map((item) => item.id === id ? updated : item));
      setEditingId(null);
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="panelTitle"><h3>Create memory note</h3><span className="muted">Searchable memory</span></div>
        <form className="stack" onSubmit={createItem}>
          <input className="input" placeholder="Memory title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="formGrid compact">
            <select className="input" value={form.bucket} onChange={(e) => setForm({ ...form, bucket: e.target.value as MemoryItem['bucket'] })}><option value="Project">Project</option><option value="Decision">Decision</option><option value="Daily">Daily</option><option value="Long-term">Long-term</option></select>
            <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}><option value="">No project</option>{projects.map((project) => <option key={project} value={project}>{project}</option>)}</select>
          </div>
          <textarea className="input" placeholder="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required rows={4} />
          <button className="button">Create memory note</button>
        </form>
      </div>
      <div className="card">
        <div className="panelTitle"><h3>Search memory</h3><span className="muted">Filter entries</span></div>
        <input className="input" placeholder="Search title, summary, source, or project" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {filtered.map((item) => (
        <div className="card" key={item.id}>
          <div className="panelTitle"><h3>{item.title}</h3><span className="pill">{item.bucket}</span></div>
          <div className="muted">Source: {item.source}{item.project ? ` • Project: ${item.project}` : ''}</div>
          {editingId === item.id ? (
            <div className="stack">
              <input className="input" defaultValue={item.title} onBlur={(e) => updateItem(item.id, { title: e.target.value })} />
              <textarea className="input" defaultValue={item.summary} rows={4} onBlur={(e) => updateItem(item.id, { summary: e.target.value })} />
            </div>
          ) : (
            <p style={{ marginBottom: 0 }}>{item.summary}</p>
          )}
          <div className="subtleRow" style={{ marginTop: 12 }}>
            <span className="muted">{item.project ?? 'No project'}</span>
            <button className="button" onClick={() => setEditingId(editingId === item.id ? null : item.id)}>{editingId === item.id ? 'Done' : 'Edit'}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
