import { SectionPage } from '@/components/section-page';
import { getCronJobs } from '@/lib/data';

export default function CronCalendarPage() {
  const cronJobs = getCronJobs();

  return (
    <SectionPage currentPath="/cron-calendar" title="Cron & Calendar" subtitle="See all scheduled jobs, owners, next runs, linked projects, and execution health.">
      <div className="stack">
        {cronJobs.map((job) => (
          <div className="card" key={job.id}>
            <div className="panelTitle"><h3>{job.name}</h3><span className="pill">{job.status}</span></div>
            <div className="muted">{job.schedule} • Next run: {job.next_run} • Owner: {job.owner}{job.project ? ` • Project: ${job.project}` : ''}</div>
            <p style={{ marginBottom: 0 }}>{job.notes}</p>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
