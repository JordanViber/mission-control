import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { cronJobs, deliverables, docs, memoryItems, projects, tasks, workers } from './seed-data';
import type { CronJob, Deliverable, DocItem, MemoryItem, Project, Task, Worker } from './types';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'mission-control.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    priority TEXT NOT NULL,
    stage TEXT NOT NULL,
    owner TEXT NOT NULL,
    default_team TEXT NOT NULL,
    milestones TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    reports_to TEXT NOT NULL,
    model TEXT NOT NULL,
    status TEXT NOT NULL,
    focus TEXT NOT NULL,
    current_project TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    owner TEXT NOT NULL,
    project TEXT NOT NULL,
    priority TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS memory_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    bucket TEXT NOT NULL,
    project TEXT,
    source TEXT NOT NULL,
    summary TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cron_jobs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    schedule TEXT NOT NULL,
    next_run TEXT NOT NULL,
    next_run_at TEXT,
    owner TEXT NOT NULL,
    project TEXT,
    status TEXT NOT NULL,
    notes TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS docs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    updated TEXT NOT NULL,
    project TEXT,
    summary TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS deliverables (
    id TEXT PRIMARY KEY,
    task_id TEXT,
    project TEXT NOT NULL,
    title TEXT NOT NULL,
    deliverable_type TEXT NOT NULL,
    approval_status TEXT NOT NULL DEFAULT 'draft',
    reviewer TEXT,
    approved_by TEXT,
    path TEXT,
    url TEXT,
    screenshot_path TEXT,
    source_url TEXT,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

function ensureColumn(table: string, column: string, ddl: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!columns.some((entry) => entry.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

ensureColumn('deliverables', 'approval_status', "approval_status TEXT NOT NULL DEFAULT 'draft'");
ensureColumn('deliverables', 'reviewer', 'reviewer TEXT');
ensureColumn('deliverables', 'approved_by', 'approved_by TEXT');
ensureColumn('deliverables', 'screenshot_path', 'screenshot_path TEXT');
ensureColumn('deliverables', 'source_url', 'source_url TEXT');
ensureColumn('cron_jobs', 'next_run_at', 'next_run_at TEXT');

function seedTable<T extends object>(table: string, rows: T[]) {
  const keys = Object.keys(rows[0]);
  const placeholders = keys.map((k) => `@${k}`).join(', ');
  const stmt = db.prepare(`INSERT OR IGNORE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
  const insertMany = db.transaction((items: T[]) => {
    for (const item of items) stmt.run(item);
  });
  insertMany(rows);
}

export function ensureSeeded() {
  seedTable<Project>('projects', projects);
  seedTable<Worker>('workers', workers);
  seedTable<Task>('tasks', tasks);
  seedTable<MemoryItem>('memory_items', memoryItems);
  seedTable<CronJob>('cron_jobs', cronJobs);
  seedTable<DocItem>('docs', docs);
  seedTable<Deliverable>('deliverables', deliverables);
}

ensureSeeded();

export function getDb() {
  return db;
}

export function checkpointDatabase() {
  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
  } catch {
    // no-op
  }
}

export function parseJsonArray(value: string): string[] {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}
