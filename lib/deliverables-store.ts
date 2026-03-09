import Database from 'better-sqlite3';
import path from 'path';
import type { Deliverable } from './types';

function openDb() {
  return new Database(path.join(process.cwd(), 'data', 'mission-control.db'), { readonly: false });
}

export function listDeliverables(): Deliverable[] {
  const db = openDb();
  try {
    return db.prepare('SELECT * FROM deliverables ORDER BY created_at DESC, id DESC').all() as Deliverable[];
  } finally {
    db.close();
  }
}

export function createDeliverable(input: Deliverable) {
  const db = openDb();
  try {
    db.prepare('INSERT INTO deliverables (id, task_id, project, title, deliverable_type, path, url, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(input.id, input.task_id, input.project, input.title, input.deliverable_type, input.path, input.url, input.summary, input.created_at);
    return db.prepare('SELECT * FROM deliverables WHERE id = ?').get(input.id);
  } finally {
    db.close();
  }
}
