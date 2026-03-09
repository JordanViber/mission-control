import { SectionPage } from '@/components/section-page';
import { TaskBoardClient } from '@/components/task-board-client';
import { getProjects, getTasks, getWorkers } from '@/lib/data';

export default function TaskBoardPage() {
  const tasks = getTasks();
  const workers = getWorkers();
  const projects = getProjects().map((project) => project.name);

  return (
    <SectionPage currentPath="/task-board" title="Task Board" subtitle="Kanban view for project work across inbox, assignment, execution, testing, review, and done.">
      <TaskBoardClient initialTasks={tasks} workers={workers} projects={projects} />
    </SectionPage>
  );
}
