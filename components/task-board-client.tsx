'use client';

import { useMemo, useState } from 'react';
import type { Task, TaskPriority, TaskStatus, Worker } from '@/lib/types';

const columns: TaskStatus[] = ['Inbox', 'Assigned', 'In Progress', 'Testing', 'Review', 'Done'];
const priorities: TaskPriority[] = ['P1', 'P2', 'P3'];

export function TaskBoardClient({ initialTasks, workers, projects }: { initialTasks: Task[]; workers: Worker[]; projects: string[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [projectFilter, setProjectFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', owner: workers[0]?.name ?? 'Operator', project: projects[0] ?? 'optionsTaxHub', priority: 'P2' as TaskPriority, status: 'Inbox' as TaskStatus });

  const filteredTasks = useMemo(() => tasks.filter((task) => (projectFilter === 'All' || task.project === projectFilter) && (ownerFilter === 'All' || task.owner === ownerFilter)), [tasks, projectFilter, ownerFilter]);

  async function moveTask(id: string, status: TaskStatus) {
    setSavingId(id);
    const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) {
      const updated = await res.json() as Task;
      setTasks((current) => current.map((task) => task.id === id ? updated : task));
    }
    setSavingId(null);
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const created = await res.json() as Task;
      setTasks((current) => [...current, created]);
      setForm((current) => ({ ...current, title: '', status: 'Inbox' }));
    }
    setCreating(false);
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="panelTitle"><h3>Create task</h3><span className="muted">Write API live</span></div>
        <form className="formGrid" onSubmit={createTask}>
          <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>{workers.map((worker) => <option key={worker.id} value={worker.name}>{worker.name}</option>)}</select>
          <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>{projects.map((project) => <option key={project} value={project}>{project}</option>)}</select>
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>{priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
          <button className="button" disabled={creating}>{creating ? 'Creating…' : 'Create task'}</button>
        </form>
      </div>

      <div className="card">
        <div className="panelTitle"><h3>Filters</h3><span className="muted">Focus the queue</span></div>
        <div className="formGrid compact">
          <select className="input" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="All">All projects</option>
            {projects.map((project) => <option key={project} value={project}>{project}</option>)}
          </select>
          <select className="input" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value="All">All owners</option>
            {workers.map((worker) => <option key={worker.id} value={worker.name}>{worker.name}</option>)}
          </select>
        </div>
      </div>

      <div className="boardGrid">
        {columns.map((column) => {
          const items = filteredTasks.filter((task) => task.status === column);
          return (
            <div className="card" key={column}>
              <div className="panelTitle"><h3>{column}</h3><span className="pill">{items.length}</span></div>
              <div className="stack">
                {items.map((task) => (
                  <div key={task.id} className="subcard">
                    <div className="subtleRow"><strong>{task.id}</strong><span className="muted">{task.priority}</span></div>
                    <div style={{ marginTop: 6 }}>{task.title}</div>
                    <div className="muted" style={{ marginTop: 6 }}>{task.owner} • {task.project}</div>
                    <select className="input" style={{ marginTop: 10 }} value={task.status} disabled={savingId === task.id} onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}>
                      {columns.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                ))}
                {items.length === 0 ? <div className="muted">No tasks</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
