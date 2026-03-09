import Database from 'better-sqlite3';
import path from 'path';
import type { CronJob, DocItem, MemoryItem } from './types';

function openDb() {
  return new Database(path.join(process.cwd(), 'data', 'mission-control.db'), { readonly: false });
}

function updateRecord<T extends object>(table: string, id: string, updates: Partial<T>) {
  const db = openDb();
  try {
    const existing = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    if (!existing) return null;

    const clauses: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        clauses.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (clauses.length) {
      values.push(id);
      db.prepare(`UPDATE ${table} SET ${clauses.join(', ')} WHERE id = ?`).run(...values);
    }

    return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  } finally {
    db.close();
  }
}

export function updateDoc(id: string, updates: Partial<DocItem>) {
  return updateRecord<DocItem>('docs', id, updates);
}

export function updateMemoryItem(id: string, updates: Partial<MemoryItem>) {
  return updateRecord<MemoryItem>('memory_items', id, updates);
}

export function updateCronJob(id: string, updates: Partial<CronJob>) {
  return updateRecord<CronJob>('cron_jobs', id, updates);
}
