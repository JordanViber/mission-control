import Database from 'better-sqlite3';
import path from 'path';
import type { UpdateDeliverableInput } from './api-types';
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
    db.prepare('INSERT INTO deliverables (id, task_id, project, title, deliverable_type, approval_status, reviewer, approved_by, path, url, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(input.id, input.task_id, input.project, input.title, input.deliverable_type, input.approval_status, input.reviewer, input.approved_by, input.path, input.url, input.summary, input.created_at);
    return db.prepare('SELECT * FROM deliverables WHERE id = ?').get(input.id);
  } finally {
    db.close();
  }
}

export function updateDeliverable(id: string, updates: UpdateDeliverableInput) {
  const db = openDb();
  try {
    const existing = db.prepare('SELECT * FROM deliverables WHERE id = ?').get(id);
    if (!existing) return null;

    const clauses: string[] = [];
    const values: unknown[] = [];
    for (const field of ['task_id', 'title', 'deliverable_type', 'approval_status', 'reviewer', 'approved_by', 'path', 'url', 'summary', 'created_at'] as const) {
      if (updates[field] !== undefined) {
        clauses.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (clauses.length) {
      values.push(id);
      db.prepare(`UPDATE deliverables SET ${clauses.join(', ')} WHERE id = ?`).run(...values);
    }

    return db.prepare('SELECT * FROM deliverables WHERE id = ?').get(id);
  } finally {
    db.close();
  }
}
