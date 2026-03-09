import { getDb } from './db';
import { getWorkers } from './data';
import { getRuntimeStatus } from './runtime';

export interface WorkerRegistryEntry {
  worker_id: string;
  worker_name: string;
  desired_session_type: 'persistent_worker';
  desired_model: string;
  desired_session_key: string;
  actual_session_key: string | null;
  runtime_present: boolean;
  health: 'Healthy' | 'Warning' | 'Offline';
  reconciliation_status: 'matched' | 'missing_runtime' | 'untracked_runtime';
  last_checked_at: string;
  notes: string | null;
}

function ensureRegistryTable() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS worker_session_registry (
      worker_id TEXT PRIMARY KEY,
      desired_session_type TEXT NOT NULL,
      desired_model TEXT NOT NULL,
      desired_session_key TEXT NOT NULL,
      actual_session_key TEXT,
      health TEXT NOT NULL,
      reconciliation_status TEXT NOT NULL,
      last_checked_at TEXT NOT NULL,
      notes TEXT
    );
  `);
}

export function reconcileWorkerRegistry() {
  ensureRegistryTable();
  const db = getDb();
  const workers = getWorkers();
  const runtime = getRuntimeStatus();
  const now = new Date().toISOString();

  const upsert = db.prepare(`
    INSERT INTO worker_session_registry (
      worker_id, desired_session_type, desired_model, desired_session_key, actual_session_key, health, reconciliation_status, last_checked_at, notes
    ) VALUES (
      @worker_id, @desired_session_type, @desired_model, @desired_session_key, @actual_session_key, @health, @reconciliation_status, @last_checked_at, @notes
    )
    ON CONFLICT(worker_id) DO UPDATE SET
      desired_session_type=excluded.desired_session_type,
      desired_model=excluded.desired_model,
      desired_session_key=excluded.desired_session_key,
      actual_session_key=excluded.actual_session_key,
      health=excluded.health,
      reconciliation_status=excluded.reconciliation_status,
      last_checked_at=excluded.last_checked_at,
      notes=excluded.notes
  `);

  for (const worker of workers) {
    const desired = `agent:main:${worker.name.toLowerCase()}`;
    const actual = runtime.sessions.find((session) => session.key.toLowerCase().includes(worker.name.toLowerCase()));
    const runtimePresent = Boolean(actual);
    const health = !runtime.connected ? 'Offline' : runtimePresent ? 'Healthy' : 'Warning';
    const reconciliationStatus = runtimePresent ? 'matched' : 'missing_runtime';
    const notes = runtimePresent
      ? `Runtime session detected (${actual?.kind || 'unknown'}).`
      : runtime.error
        ? `Runtime unavailable: ${runtime.error}`
        : 'Desired persistent worker session not currently visible in runtime.';

    upsert.run({
      worker_id: worker.id,
      desired_session_type: 'persistent_worker',
      desired_model: worker.model,
      desired_session_key: desired,
      actual_session_key: actual?.key ?? null,
      health,
      reconciliation_status: reconciliationStatus,
      last_checked_at: now,
      notes,
    });
  }
}

export function getWorkerRegistry(): WorkerRegistryEntry[] {
  reconcileWorkerRegistry();
  const db = getDb();
  const rows = db.prepare(`
    SELECT r.*, w.name as worker_name
    FROM worker_session_registry r
    JOIN workers w ON w.id = r.worker_id
    ORDER BY w.name
  `).all() as WorkerRegistryEntry[];
  return rows;
}
