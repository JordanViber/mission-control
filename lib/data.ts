export type WorkerRole = 'Operator' | 'Researcher' | 'Developer' | 'Reviewer';

export interface Project {
  id: string;
  name: string;
  slug: string;
  summary: string;
  priority: 'High' | 'Medium' | 'Low';
  stage: string;
  owner: string;
  defaultTeam: string[];
  milestones: string[];
}

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  reportsTo: string;
  model: string;
  status: 'Healthy' | 'Busy' | 'Needs attention';
  focus: string;
  currentProject: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'Inbox' | 'Assigned' | 'In Progress' | 'Testing' | 'Review' | 'Done';
  owner: string;
  project: string;
  priority: 'P1' | 'P2' | 'P3';
}

export interface MemoryItem {
  id: string;
  title: string;
  bucket: 'Long-term' | 'Daily' | 'Decision' | 'Project';
  project?: string;
  source: string;
  summary: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  owner: string;
  project?: string;
  status: 'Healthy' | 'Warning';
  notes: string;
}

export interface DocItem {
  id: string;
  title: string;
  type: 'Architecture' | 'Runbook' | 'Spec' | 'Project';
  updated: string;
  project?: string;
  summary: string;
}

export const projects: Project[] = [
  {
    id: 'options-tax-hub',
    name: 'optionsTaxHub',
    slug: 'optionstaxhub',
    summary: 'Revenue-focused SaaS for options tax workflows, reporting, and automation.',
    priority: 'High',
    stage: 'Foundation build',
    owner: 'Jordan',
    defaultTeam: ['Developer', 'Reviewer'],
    milestones: ['Core dashboard shell', 'Persistent team runtime', 'Tax workflow MVP'],
  },
];

export const workers: Worker[] = [
  { id: 'operator', name: 'Operator', role: 'Operator', reportsTo: 'Jordan', model: 'openai-codex/gpt-5.4', status: 'Healthy', focus: 'System orchestration, routing, and recovery', currentProject: 'Global' },
  { id: 'researcher', name: 'Researcher', role: 'Researcher', reportsTo: 'Operator', model: 'openai-codex/gpt-5.4', status: 'Healthy', focus: 'Research, summaries, competitive analysis', currentProject: 'optionsTaxHub' },
  { id: 'developer', name: 'Developer', role: 'Developer', reportsTo: 'Operator', model: 'openai-codex/gpt-5.4', status: 'Busy', focus: 'App implementation, integrations, refactors', currentProject: 'optionsTaxHub' },
  { id: 'reviewer', name: 'Reviewer', role: 'Reviewer', reportsTo: 'Operator', model: 'openai-codex/gpt-5.4', status: 'Healthy', focus: 'QA, acceptance, verification', currentProject: 'optionsTaxHub' },
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
  { id: 'mem-1', title: 'Mission direction', bucket: 'Long-term', source: 'SOUL.md', summary: 'Prioritize revenue, automation, and time savings for faith and family.' },
  { id: 'mem-2', title: 'Custom Mission Control decision', bucket: 'Decision', source: 'conversation · 2026-03-08', summary: 'Build a fresh Mission Control aligned to persistent teammates instead of forking the reference product.' },
  { id: 'mem-3', title: 'optionsTaxHub seed context', bucket: 'Project', project: 'optionsTaxHub', source: 'README + architecture docs', summary: 'optionsTaxHub is the first project and should be the default lens for team, tasks, docs, and cron.' },
  { id: 'mem-4', title: 'Today’s implementation notes', bucket: 'Daily', source: '2026-03-08 daily log', summary: 'Initial repo scaffold, left-nav shell, and v1 information architecture are in place.' },
];

export const cronJobs: CronJob[] = [
  { id: 'cron-1', name: 'Morning Brief', schedule: '0 6 * * *', nextRun: 'Tomorrow 06:00', owner: 'Operator', status: 'Healthy', notes: 'Send concise brief with weather, headlines, and top 3 priorities.' },
  { id: 'cron-2', name: 'Memory Maintenance', schedule: '0 */12 * * *', nextRun: 'Tomorrow 08:00', owner: 'Operator', status: 'Healthy', notes: 'Review recent daily notes and promote durable insights into long-term memory.' },
  { id: 'cron-3', name: 'optionsTaxHub Revenue Check', schedule: '30 8 * * 1-5', nextRun: 'Tomorrow 08:30', owner: 'Researcher', project: 'optionsTaxHub', status: 'Warning', notes: 'Needs implementation once project metrics source is defined.' },
];

export const docs: DocItem[] = [
  { id: 'doc-1', title: 'Architecture', type: 'Architecture', updated: '2026-03-08', summary: 'Core architecture for custom Mission Control, persistent workers, and source-of-truth boundaries.' },
  { id: 'doc-2', title: 'Information Architecture', type: 'Spec', updated: '2026-03-08', summary: 'Defines the left-nav tool system and the major views under each tool.' },
  { id: 'doc-3', title: 'Roadmap', type: 'Project', updated: '2026-03-08', project: 'optionsTaxHub', summary: 'Phased build plan for shell, runtime, tools, and operational workflows.' },
];

export const sessionSummary = [
  { label: 'Persistent workers', value: '4 active' },
  { label: 'Task workers', value: '0 running' },
  { label: 'Runtime model', value: 'gpt-5.4' },
];

export const dashboardStats = [
  { label: 'Open tasks', value: String(tasks.filter((t) => t.status !== 'Done').length) },
  { label: 'Healthy workers', value: String(workers.filter((w) => w.status === 'Healthy').length) },
  { label: 'Projects', value: String(projects.length) },
  { label: 'Scheduled jobs', value: String(cronJobs.length) },
];
