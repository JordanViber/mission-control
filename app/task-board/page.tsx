import { SectionPage } from '@/components/section-page';
import { TaskColumns } from '@/components/cards';

export default function TaskBoardPage() {
  return (
    <SectionPage currentPath="/task-board" title="Task Board" subtitle="Kanban view for project work across inbox, assignment, execution, testing, review, and done.">
      <TaskColumns />
    </SectionPage>
  );
}
