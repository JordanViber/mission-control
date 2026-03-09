import { execSync } from 'node:child_process';
import { getDb } from './db';
import type { UsageSnapshot, UsageWindow } from './types';

interface ProviderPayload {
  provider: string;
  displayName?: string;
  plan?: string;
  windows?: Array<{ label: string; usedPercent: number; resetAt?: number }>;
}

function toIso(ts?: number) {
  return ts ? new Date(ts).toISOString() : null;
}

function windowBand(label: string, remaining: number) {
  const isWeek = label.toLowerCase().includes('week');
  if (isWeek) {
    if (remaining >= 70) return 'healthy';
    if (remaining >= 40) return 'moderate';
    if (remaining >= 20) return 'high';
    return 'critical';
  }
  if (remaining >= 80) return 'healthy';
  if (remaining >= 50) return 'normal';
  if (remaining >= 25) return 'caution';
  return 'critical';
}

function summarize(shortTerm: string, weekly: string) {
  const all = [shortTerm, weekly];
  if (all.includes('critical')) return { overall: 'critical', recommendation: 'Pause heavy multi-agent work and avoid long coding runs until the budget windows recover.' };
  if (all.includes('high') || all.includes('caution')) return { overall: 'constrained', recommendation: 'Use lighter models for routine work and avoid unnecessary subagents or retries.' };
  if (weekly === 'moderate') return { overall: 'watching', recommendation: 'You are fine for normal use, but weekly budget is meaningfully in play. Save Codex for coding/debugging.' };
  return { overall: 'healthy', recommendation: 'Usage is in a healthy range. Normal work is fine.' };
}

export function getUsageStatus() {
  const raw = execSync('openclaw status --usage --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const parsed = JSON.parse(raw) as { usage?: { updatedAt?: number; providers?: ProviderPayload[] }; sessions?: { defaults?: { model?: string } } };
  const providers = parsed.usage?.providers ?? [];
  const codex = providers.find((provider) => provider.provider === 'openai-codex') ?? providers[0] ?? null;
  const windows: UsageWindow[] = (codex?.windows ?? []).map((window) => ({
    provider: codex?.displayName ?? codex?.provider ?? 'Unknown',
    label: window.label,
    used_percent: Math.round(window.usedPercent),
    remaining_percent: Math.max(0, Math.round(100 - window.usedPercent)),
    reset_at: toIso(window.resetAt),
  }));

  const shortWindow = windows.find((window) => !window.label.toLowerCase().includes('week'));
  const weeklyWindow = windows.find((window) => window.label.toLowerCase().includes('week'));
  const shortTermStatus = shortWindow ? windowBand(shortWindow.label, shortWindow.remaining_percent) : 'unknown';
  const weeklyStatus = weeklyWindow ? windowBand(weeklyWindow.label, weeklyWindow.remaining_percent) : 'unknown';
  const summary = summarize(shortTermStatus, weeklyStatus);

  return {
    updatedAt: toIso(parsed.usage?.updatedAt),
    provider: codex?.displayName ?? codex?.provider ?? 'Unknown',
    providerId: codex?.provider ?? 'unknown',
    plan: codex?.plan ?? null,
    model: parsed.sessions?.defaults?.model ?? null,
    windows,
    shortTermStatus,
    weeklyStatus,
    overallStatus: summary.overall,
    recommendation: summary.recommendation,
    raw: parsed,
  };
}

export function recordUsageSnapshot() {
  const usage = getUsageStatus();
  const db = getDb();
  const id = `usage-${Date.now()}`;
  db.prepare('INSERT INTO usage_snapshots (id, captured_at, provider, plan, model, short_term_status, weekly_status, overall_status, recommendation, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, usage.updatedAt ?? new Date().toISOString(), usage.providerId, usage.plan, usage.model, usage.shortTermStatus, usage.weeklyStatus, usage.overallStatus, usage.recommendation, JSON.stringify(usage.raw));
  return listUsageSnapshots()[0];
}

export function listUsageSnapshots(): UsageSnapshot[] {
  return getDb().prepare('SELECT * FROM usage_snapshots ORDER BY captured_at DESC LIMIT 20').all() as UsageSnapshot[];
}
