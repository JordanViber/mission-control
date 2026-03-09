import Database from 'better-sqlite3';
import path from 'path';
import type { Task } from './types';

function openTasksDb() {
  return new Database(path.join(process.cwd(), 'data', 'mission-control.db'), { readonly: false });
}

export function listTasks(): Task[] {
  const db = openTasksDb();
  try {
    return db.prepare('SELECT * FROM tasks ORDER BY id').all() as Task[];
  } finally {
    db.close();
  }
}

export function getTask(id: string) {
  const db = openTasksDb();
  try {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  } finally {
    db.close();
  }
}

export function createTask(task: Task) {
  const db = openTasksDb();
  try {
    db.prepare('INSERT INTO tasks (id, title, status, owner, project, priority) VALUES (?, ?, ?, ?, ?, ?)')
      .run(task.id, task.title, task.status, task.owner, task.project, task.priority);
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id);
  } finally {
    db.close();
  }
}

export function updateTask(id: string, updates: Partial<Task>) {
  const db = openTasksDb();
  try {
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) return null;

    const clauses: string[] = [];
    const values: unknown[] = [];
    for (const field of ['title', 'status', 'owner', 'project', 'priority'] as const) {
      if (updates[field] !== undefined) {
        clauses.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (clauses.length) {
      values.push(id);
      db.prepare(`UPDATE tasks SET ${clauses.join(', ')} WHERE id = ?`).run(...values);
    }

    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  } finally {
    db.close();
  }
}
