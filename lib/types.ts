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
  next_run_at: string | null;
  next_run_relative?: string;
  next_run_exact?: string;
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

export interface Deliverable {
  id: string;
  task_id: string | null;
  project: string;
  title: string;
  deliverable_type: 'file' | 'doc' | 'link' | 'note';
  approval_status: 'draft' | 'in_review' | 'approved' | 'changes_requested';
  reviewer: string | null;
  approved_by: string | null;
  path: string | null;
  url: string | null;
  screenshot_path: string | null;
  source_url: string | null;
  summary: string;
  created_at: string;
}

export interface UsageWindow {
  provider: string;
  label: string;
  used_percent: number;
  remaining_percent: number;
  reset_at: string | null;
}

export interface UsageSnapshot {
  id: string;
  captured_at: string;
  provider: string;
  plan: string | null;
  model: string | null;
  short_term_status: string;
  weekly_status: string;
  overall_status: string;
  recommendation: string;
  raw_json: string;
}
