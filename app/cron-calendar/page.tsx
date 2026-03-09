import { CronClient } from '@/components/cron-client';
import { SectionPage } from '@/components/section-page';
import { getCronJobs, getProjects, getWorkers } from '@/lib/data';

export default function CronCalendarPage() {
  const cronJobs = getCronJobs();
  const workers = getWorkers();
  const projects = getProjects().map((project) => project.name);

  return (
    <SectionPage currentPath="/cron-calendar" title="Cron & Calendar" subtitle="See all scheduled jobs, owners, next runs, linked projects, and execution health.">
      <CronClient initialJobs={cronJobs} workers={workers} projects={projects} />
    </SectionPage>
  );
}
