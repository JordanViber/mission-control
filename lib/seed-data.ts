import type { CronJob, Deliverable, DocItem, MemoryItem, Project, Task, Worker } from './types';

export const projects: Project[] = [
  {
    id: 'options-tax-hub',
    name: 'optionsTaxHub',
    slug: 'optionstaxhub',
    summary: 'Revenue-focused SaaS for options tax workflows, reporting, and automation.',
    priority: 'High',
    stage: 'Foundation build',
    owner: 'Jordan',
    default_team: JSON.stringify(['Developer', 'Reviewer']),
    milestones: JSON.stringify(['Core dashboard shell', 'Persistent team runtime', 'Tax workflow MVP']),
  },
];

export const workers: Worker[] = [
  { id: 'operator', name: 'Operator', role: 'Operator', reports_to: 'Jordan', model: 'openai-codex/gpt-5.4', status: 'Healthy', focus: 'System orchestration, routing, and recovery', current_project: 'Global' },
  { id: 'researcher', name: 'Researcher', role: 'Researcher', reports_to: 'Operator', model: 'openai-codex/gpt-5.4', status: 'Healthy', focus: 'Research, summaries, competitive analysis', current_project: 'optionsTaxHub' },
  { id: 'developer', name: 'Developer', role: 'Developer', reports_to: 'Operator', model: 'openai-codex/gpt-5.4', status: 'Busy', focus: 'App implementation, integrations, refactors', current_project: 'optionsTaxHub' },
  { id: 'reviewer', name: 'Reviewer', role: 'Reviewer', reports_to: 'Operator', model: 'openai-codex/gpt-5.4', status: 'Healthy', focus: 'QA, acceptance, verification', current_project: 'optionsTaxHub' },
];

export const tasks: Task[] = [
  { id: 'MC-101', title: 'Build routed app shell for all sidebar tools', status: 'Done', owner: 'Developer', project: 'optionsTaxHub', priority: 'P1' },
  { id: 'MC-102', title: 'Seed team board with org structure + reporting lines', status: 'Done', owner: 'Developer', project: 'optionsTaxHub', priority: 'P1' },
  { id: 'MC-103', title: 'Implement memory explorer using indexed sources', status: 'In Progress', owner: 'Researcher', project: 'optionsTaxHub', priority: 'P1' },
  { id: 'MC-104', title: 'Add cron registry + next run visibility', status: 'Assigned', owner: 'Operator', project: 'optionsTaxHub', priority: 'P2' },
  { id: 'MC-105', title: 'Design project workspace layout for optionsTaxHub', status: 'Review', owner: 'Reviewer', project: 'optionsTaxHub', priority: 'P2' },
  { id: 'MC-106', title: 'Persistent worker session reconciler', status: 'Inbox', owner: 'Operator', project: 'optionsTaxHub', priority: 'P1' },
];

export const memoryItems: MemoryItem[] = [
  { id: 'mem-1', title: 'Mission direction', bucket: 'Long-term', project: null, source: 'SOUL.md', summary: 'Prioritize revenue, automation, and time savings for faith and family.' },
  { id: 'mem-2', title: 'Custom Mission Control decision', bucket: 'Decision', project: null, source: 'conversation · 2026-03-08', summary: 'Build a fresh Mission Control aligned to persistent teammates instead of forking the reference product.' },
  { id: 'mem-3', title: 'optionsTaxHub seed context', bucket: 'Project', project: 'optionsTaxHub', source: 'README + architecture docs', summary: 'optionsTaxHub is the first project and should be the default lens for team, tasks, docs, and cron.' },
  { id: 'mem-4', title: 'Today’s implementation notes', bucket: 'Daily', project: null, source: '2026-03-08 daily log', summary: 'Initial repo scaffold, left-nav shell, and v1 information architecture are in place.' },
];

export const cronJobs: CronJob[] = [
  { id: 'cron-1', name: 'Morning Brief', schedule: '0 6 * * *', next_run: 'Tomorrow 06:00', next_run_at: '2026-03-09T11:00:00.000Z', owner: 'Operator', project: null, status: 'Healthy', notes: 'Send concise brief with weather, headlines, and top 3 priorities.' },
  { id: 'cron-2', name: 'Memory Maintenance', schedule: '0 */12 * * *', next_run: 'Today 12:00 PM', next_run_at: '2026-03-09T17:00:00.000Z', owner: 'Operator', project: null, status: 'Healthy', notes: 'Review recent daily notes and promote durable insights into long-term memory.' },
  { id: 'cron-3', name: 'optionsTaxHub Revenue Check', schedule: '30 8 * * 1-5', next_run: 'Today 8:30 AM', next_run_at: '2026-03-09T13:30:00.000Z', owner: 'Researcher', project: 'optionsTaxHub', status: 'Warning', notes: 'Needs implementation once project metrics source is defined.' },
];

export const docs: DocItem[] = [
  { id: 'doc-1', title: 'Architecture', type: 'Architecture', updated: '2026-03-08', project: null, summary: 'Core architecture for custom Mission Control, persistent workers, and source-of-truth boundaries.' },
  { id: 'doc-2', title: 'Information Architecture', type: 'Spec', updated: '2026-03-08', project: null, summary: 'Defines the left-nav tool system and the major views under each tool.' },
  { id: 'doc-3', title: 'Roadmap', type: 'Project', updated: '2026-03-08', project: 'optionsTaxHub', summary: 'Phased build plan for shell, runtime, tools, and operational workflows.' },
];

export const deliverables: Deliverable[] = [
  { id: 'deliv-1', task_id: 'MC-101', project: 'optionsTaxHub', title: 'App shell implementation', deliverable_type: 'file', approval_status: 'approved', reviewer: 'Reviewer', approved_by: 'Jordan', path: 'app/page.tsx', url: null, screenshot_path: null, source_url: null, summary: 'Initial dashboard shell and navigation implementation.', created_at: '2026-03-08' },
  { id: 'deliv-2', task_id: 'MC-102', project: 'optionsTaxHub', title: 'Team board implementation', deliverable_type: 'file', approval_status: 'in_review', reviewer: 'Reviewer', approved_by: null, path: 'app/team/page.tsx', url: null, screenshot_path: null, source_url: null, summary: 'Seeded org structure and editable team status surface.', created_at: '2026-03-08' },
  { id: 'deliv-3', task_id: 'MC-105', project: 'optionsTaxHub', title: 'Project workspace', deliverable_type: 'file', approval_status: 'changes_requested', reviewer: 'Jordan', approved_by: null, path: 'app/projects/[slug]/page.tsx', url: null, screenshot_path: null, source_url: null, summary: 'Interactive project hub for optionsTaxHub with linked docs, memory, cron, and tasks.', created_at: '2026-03-08' },
];
