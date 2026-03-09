'use client';

import { useState } from 'react';
import type { CronJob, Worker } from '@/lib/types';

export function CronClient({ initialJobs, workers, projects }: { initialJobs: CronJob[]; workers: Worker[]; projects: string[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [form, setForm] = useState({ name: '', schedule: '0 9 * * 1-5', next_run: 'Tomorrow 09:00', owner: workers[0]?.name ?? 'Operator', project: projects[0] ?? '', status: 'Healthy' as CronJob['status'], notes: '' });

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/cron-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, project: form.project || null }) });
    if (res.ok) {
      const created = await res.json() as CronJob;
      setJobs((current) => [created, ...current]);
      setForm({ ...form, name: '', notes: '' });
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="panelTitle"><h3>Create cron job</h3><span className="muted">Schedule registry</span></div>
        <form className="stack" onSubmit={createJob}>
          <input className="input" placeholder="Job name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="formGrid compact">
            <input className="input" placeholder="Cron schedule" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} required />
            <input className="input" placeholder="Next run" value={form.next_run} onChange={(e) => setForm({ ...form, next_run: e.target.value })} required />
          </div>
          <div className="formGrid compact">
            <select className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>{workers.map((worker) => <option key={worker.id} value={worker.name}>{worker.name}</option>)}</select>
            <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}><option value="">No project</option>{projects.map((project) => <option key={project} value={project}>{project}</option>)}</select>
          </div>
          <textarea className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} required rows={4} />
          <button className="button">Create cron job</button>
        </form>
      </div>
      {jobs.map((job) => (
        <div className="card" key={job.id}>
          <div className="panelTitle"><h3>{job.name}</h3><span className="pill">{job.status}</span></div>
          <div className="muted">{job.schedule} • Next run: {job.next_run} • Owner: {job.owner}{job.project ? ` • Project: ${job.project}` : ''}</div>
          <p style={{ marginBottom: 0 }}>{job.notes}</p>
        </div>
      ))}
    </div>
  );
}
