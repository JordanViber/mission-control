import { execSync } from 'node:child_process';

export interface RuntimeSession {
  key: string;
  kind: string;
  model: string;
  age?: string;
}

export interface RuntimeStatus {
  connected: boolean;
  gatewayUrl?: string;
  sessions: RuntimeSession[];
  error?: string;
}

export function getRuntimeStatus(): RuntimeStatus {
  try {
    const raw = execSync('openclaw status --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const parsed = JSON.parse(raw) as any;
    const sessions = Array.isArray(parsed?.sessions) ? parsed.sessions.map((session: any) => ({
      key: session.key || '',
      kind: session.kind || 'unknown',
      model: session.model || 'unknown',
      age: session.age,
    })) : [];

    return {
      connected: Boolean(parsed?.gateway?.reachable ?? true),
      gatewayUrl: parsed?.gateway?.url || parsed?.overview?.gateway || 'ws://127.0.0.1:18789',
      sessions,
    };
  } catch (error) {
    return {
      connected: false,
      sessions: [],
      error: error instanceof Error ? error.message : 'Failed to query OpenClaw runtime',
    };
  }
}
