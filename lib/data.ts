import { getDb, parseJsonArray } from './db';
import type { CronJob, Deliverable, DocItem, MemoryItem, Project, Task, Worker } from './types';

export function getProjects(): Array<Project & { defaultTeam: string[]; milestonesList: string[] }> {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM projects ORDER BY name').all() as Project[];
  return rows.map((project) => ({
    ...project,
    defaultTeam: parseJsonArray(project.default_team),
    milestonesList: parseJsonArray(project.milestones),
  }));
}

export function getWorkers(): Worker[] {
  return getDb().prepare('SELECT * FROM workers ORDER BY CASE role WHEN \'Operator\' THEN 1 WHEN \'Researcher\' THEN 2 WHEN \'Developer\' THEN 3 ELSE 4 END, name').all() as Worker[];
}

export function getTasks(): Task[] {
  return getDb().prepare('SELECT * FROM tasks ORDER BY id').all() as Task[];
}

export function getMemoryItems(): MemoryItem[] {
  return getDb().prepare('SELECT * FROM memory_items ORDER BY id').all() as MemoryItem[];
}

export function getCronJobs(): CronJob[] {
  return getDb().prepare('SELECT * FROM cron_jobs ORDER BY id').all() as CronJob[];
}

export function getDocs(): DocItem[] {
  return getDb().prepare('SELECT * FROM docs ORDER BY updated DESC, title').all() as DocItem[];
}

export function getDeliverables(): Deliverable[] {
  return getDb().prepare('SELECT * FROM deliverables ORDER BY created_at DESC, id DESC').all() as Deliverable[];
}

export function getSessionSummary() {
  const workers = getWorkers();
  return [
    { label: 'Persistent workers', value: `${workers.length} active` },
    { label: 'Task workers', value: '0 running' },
    { label: 'Runtime model', value: 'gpt-5.4' },
  ];
}

export function getDashboardStats() {
  const tasks = getTasks();
  const workers = getWorkers();
  const projects = getProjects();
  const cronJobs = getCronJobs();
  return [
    { label: 'Open tasks', value: String(tasks.filter((t) => t.status !== 'Done').length) },
    { label: 'Healthy workers', value: String(workers.filter((w) => w.status === 'Healthy').length) },
    { label: 'Projects', value: String(projects.length) },
    { label: 'Scheduled jobs', value: String(cronJobs.length) },
  ];
}
