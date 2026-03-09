'use client';

import { useState } from 'react';
import type { CronJob, DocItem, MemoryItem, Project, Task, Worker } from '@/lib/types';

export function ProjectWorkspaceClient({
  project,
  workers,
  tasks,
  docs,
  memory,
  cronJobs,
}: {
  project: Project & { defaultTeam: string[]; milestonesList: string[] };
  workers: Worker[];
  tasks: Task[];
  docs: DocItem[];
  memory: MemoryItem[];
  cronJobs: CronJob[];
}) {
  const [projectState, setProjectState] = useState(project);
  const [docsState, setDocsState] = useState(docs);
  const [memoryState, setMemoryState] = useState(memory);
  const [cronState, setCronState] = useState(cronJobs);
  const [saving, setSaving] = useState(false);
  const [projectForm, setProjectForm] = useState({ summary: project.summary, stage: project.stage, priority: project.priority, owner: project.owner });
  const [docForm, setDocForm] = useState({ title: '', type: 'Project', updated: new Date().toISOString().slice(0, 10), summary: '' });
  const [memoryForm, setMemoryForm] = useState({ title: '', bucket: 'Project', source: 'Mission Control UI', summary: '' });
  const [cronForm, setCronForm] = useState({ name: '', schedule: '0 9 * * 1-5', next_run: 'Tomorrow 09:00', owner: workers[0]?.name ?? 'Operator', status: 'Healthy', notes: '' });

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/projects/${projectState.slug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projectForm) });
    if (res.ok) {
      const updated = await res.json() as Project;
      setProjectState({ ...projectState, ...updated, defaultTeam: projectState.defaultTeam, milestonesList: projectState.milestonesList });
    }
    setSaving(false);
  }

  async function createDoc(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/docs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...docForm, project: projectState.name }) });
    if (res.ok) {
      const created = await res.json() as DocItem;
      setDocsState((current) => [created, ...current]);
      setDocForm({ ...docForm, title: '', summary: '' });
    }
  }

  async function createMemory(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/memory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...memoryForm, project: projectState.name }) });
    if (res.ok) {
      const created = await res.json() as MemoryItem;
      setMemoryState((current) => [created, ...current]);
      setMemoryForm({ ...memoryForm, title: '', summary: '' });
    }
  }

  async function createCron(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/cron-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...cronForm, project: projectState.name }) });
    if (res.ok) {
      const created = await res.json() as CronJob;
      setCronState((current) => [created, ...current]);
      setCronForm({ ...cronForm, name: '', notes: '' });
    }
  }

  return (
    <div className="stack">
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Project profile</h3><span className="pill">{projectState.priority}</span></div>
          <div className="muted">Default team: {projectState.defaultTeam.join(', ')}</div>
          <ul className="list">{projectState.milestonesList.map((milestone) => <li key={milestone}>{milestone}</li>)}</ul>
          <form className="formGrid compact" onSubmit={saveProject}>
            <input className="input" value={projectForm.stage} onChange={(e) => setProjectForm({ ...projectForm, stage: e.target.value })} placeholder="Stage" />
            <input className="input" value={projectForm.owner} onChange={(e) => setProjectForm({ ...projectForm, owner: e.target.value })} placeholder="Owner" />
            <select className="input" value={projectForm.priority} onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as Project['priority'] })}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input className="input" value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} placeholder="Summary" />
            <button className="button" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button>
          </form>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Assigned team</h3><span className="muted">{workers.length} workers</span></div>
          <div className="stack">{workers.map((worker) => <div className="subcard" key={worker.id}><div className="subtleRow"><strong>{worker.name}</strong><span className="pill">{worker.status}</span></div><div className="muted">{worker.role} • {worker.focus}</div></div>)}</div>
        </div>
      </div>

      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Tasks</h3><span className="muted">{tasks.length}</span></div>
          <div className="stack">{tasks.map((task) => <div className="subcard" key={task.id}><div className="subtleRow"><strong>{task.id}</strong><span>{task.status}</span></div><div>{task.title}</div><div className="muted" style={{ marginTop: 6 }}>{task.owner} • {task.priority}</div></div>)}</div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Add project doc</h3><span className="muted">Write API live</span></div>
          <form className="stack" onSubmit={createDoc}>
            <input className="input" placeholder="Doc title" value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} required />
            <select className="input" value={docForm.type} onChange={(e) => setDocForm({ ...docForm, type: e.target.value as DocItem['type'] })}><option value="Project">Project</option><option value="Spec">Spec</option><option value="Runbook">Runbook</option><option value="Architecture">Architecture</option></select>
            <textarea className="input" placeholder="Summary" value={docForm.summary} onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })} required rows={4} />
            <button className="button">Create doc</button>
          </form>
          <div className="stack" style={{ marginTop: 16 }}>{docsState.map((doc) => <div className="subcard" key={doc.id}><strong>{doc.title}</strong><div className="muted">{doc.type} • Updated {doc.updated}</div><div style={{ marginTop: 6 }}>{doc.summary}</div></div>)}</div>
        </div>
      </div>

      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Add memory note</h3><span className="muted">Project memory</span></div>
          <form className="stack" onSubmit={createMemory}>
            <input className="input" placeholder="Memory title" value={memoryForm.title} onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })} required />
            <select className="input" value={memoryForm.bucket} onChange={(e) => setMemoryForm({ ...memoryForm, bucket: e.target.value as MemoryItem['bucket'] })}><option value="Project">Project</option><option value="Decision">Decision</option><option value="Daily">Daily</option><option value="Long-term">Long-term</option></select>
            <textarea className="input" placeholder="Summary" value={memoryForm.summary} onChange={(e) => setMemoryForm({ ...memoryForm, summary: e.target.value })} required rows={4} />
            <button className="button">Create memory note</button>
          </form>
          <div className="stack" style={{ marginTop: 16 }}>{memoryState.map((item) => <div className="subcard" key={item.id}><strong>{item.title}</strong><div className="muted">{item.bucket} • {item.source}</div><div style={{ marginTop: 6 }}>{item.summary}</div></div>)}</div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Add cron job</h3><span className="muted">Schedule registry</span></div>
          <form className="stack" onSubmit={createCron}>
            <input className="input" placeholder="Job name" value={cronForm.name} onChange={(e) => setCronForm({ ...cronForm, name: e.target.value })} required />
            <input className="input" placeholder="Cron schedule" value={cronForm.schedule} onChange={(e) => setCronForm({ ...cronForm, schedule: e.target.value })} required />
            <input className="input" placeholder="Next run" value={cronForm.next_run} onChange={(e) => setCronForm({ ...cronForm, next_run: e.target.value })} required />
            <textarea className="input" placeholder="Notes" value={cronForm.notes} onChange={(e) => setCronForm({ ...cronForm, notes: e.target.value })} required rows={4} />
            <button className="button">Create cron job</button>
          </form>
          <div className="stack" style={{ marginTop: 16 }}>{cronState.map((job) => <div className="subcard" key={job.id}><strong>{job.name}</strong><div className="muted">{job.schedule} • Next: {job.next_run}</div><div style={{ marginTop: 6 }}>{job.notes}</div></div>)}</div>
        </div>
      </div>
    </div>
  );
}
