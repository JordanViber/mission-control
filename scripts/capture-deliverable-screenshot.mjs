#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [, , url, outputArg, titleArg] = process.argv;
if (!url) {
  console.error('Usage: node scripts/capture-deliverable-screenshot.mjs <url> [output-path] [title]');
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = outputArg || path.join('public', 'artifacts', `deliverable-${stamp}.png`);
const title = titleArg || 'Browser screenshot artifact';
fs.mkdirSync(path.dirname(output), { recursive: true });

const session = `deliverable-${Date.now()}`;
try {
  execFileSync('agent-browser', ['--session', session, 'open', url], { stdio: 'inherit' });
  execFileSync('agent-browser', ['--session', session, 'wait', '--load', 'networkidle'], { stdio: 'inherit' });
  execFileSync('agent-browser', ['--session', session, 'screenshot', output], { stdio: 'inherit' });
  console.log(JSON.stringify({ title, url, output }, null, 2));
} finally {
  try {
    execFileSync('agent-browser', ['--session', session, 'close'], { stdio: 'inherit' });
  } catch {}
}
