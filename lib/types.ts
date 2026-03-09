export type WorkerRole = 'Operator' | 'Researcher' | 'Developer' | 'Reviewer';
export type WorkerStatus = 'Healthy' | 'Busy' | 'Needs attention';
export type ProjectPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Inbox' | 'Assigned' | 'In Progress' | 'Testing' | 'Review' | 'Done';
export type TaskPriority = 'P1' | 'P2' | 'P3';
export type MemoryBucket = 'Long-term' | 'Daily' | 'Decision' | 'Project';
export type CronStatus = 'Healthy' | 'Warning';
export type DocType = 'Architecture' | 'Runbook' | 'Spec' | 'Project';

export interface Project {
  id: string;
  name: string;
  slug: string;
  summary: string;
  priority: ProjectPriority;
  stage: string;
  owner: string;
  default_team: string;
  milestones: string;
}

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  reports_to: string;
  model: string;
  status: WorkerStatus;
  focus: string;
  current_project: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  owner: string;
  project: string;
  priority: TaskPriority;
}

export interface MemoryItem {
  id: string;
  title: string;
  bucket: MemoryBucket;
  project: string | null;
  source: string;
  summary: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  next_run: string;
  owner: string;
  project: string | null;
  status: CronStatus;
  notes: string;
}

export interface DocItem {
  id: string;
  title: string;
  type: DocType;
  updated: string;
  project: string | null;
  summary: string;
}
