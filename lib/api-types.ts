import type { CronJob, Deliverable, DocItem, MemoryItem, Project, Task, Worker } from './types';

export interface CreateTaskInput extends Omit<Task, 'id'> {
  id?: string;
}

export interface UpdateTaskInput extends Partial<Omit<Task, 'id'>> {}

export interface CreateMemoryInput extends Omit<MemoryItem, 'id'> {
  id?: string;
}

export interface CreateCronJobInput extends Omit<CronJob, 'id'> {
  id?: string;
}

export interface CreateDocInput extends Omit<DocItem, 'id'> {
  id?: string;
}

export interface UpdateWorkerInput extends Partial<Pick<Worker, 'status' | 'focus' | 'current_project'>> {}

export interface UpdateProjectInput extends Partial<Pick<Project, 'summary' | 'priority' | 'stage' | 'owner' | 'default_team' | 'milestones'>> {}

export interface CreateDeliverableInput extends Omit<Deliverable, 'id'> {
  id?: string;
}

export interface UpdateDeliverableInput extends Partial<Omit<Deliverable, 'id'>> {}
