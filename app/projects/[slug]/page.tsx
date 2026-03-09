import { SectionPage } from '@/components/section-page';
import { getCronJobs, getDocs, getMemoryItems, getProjects, getTasks, getWorkers } from '@/lib/data';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const projects = getProjects();
  const project = projects.find((item) => item.slug === params.slug || item.id === params.slug);

  if (!project) {
    return (
      <SectionPage currentPath="/projects" title="Project not found" subtitle="The requested project does not exist in the current seed data.">
        <div className="card">Try returning to the Projects page.</div>
      </SectionPage>
    );
  }

  const tasks = getTasks().filter((task) => task.project === project.name);
  const docs = getDocs().filter((doc) => doc.project === project.name || !doc.project);
  const memory = getMemoryItems().filter((item) => item.project === project.name || item.project === null);
  const cronJobs = getCronJobs().filter((job) => job.project === project.name || job.project === null);
  const workers = getWorkers().filter((worker) => project.defaultTeam.includes(worker.name));

  return (
    <SectionPage currentPath="/projects" title={project.name} subtitle={project.summary}>
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Project profile</h3><span className="pill">{project.priority}</span></div>
          <div className="muted">Owner: {project.owner} • Stage: {project.stage}</div>
          <div style={{ marginTop: 10 }}><strong>Default team:</strong> {project.defaultTeam.join(', ')}</div>
          <div style={{ marginTop: 10 }}><strong>Milestones:</strong></div>
          <ul className="list">{project.milestonesList.map((milestone) => <li key={milestone}>{milestone}</li>)}</ul>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Assigned team</h3><span className="muted">{workers.length} workers</span></div>
          <div className="stack">{workers.map((worker) => <div className="subcard" key={worker.id}><div className="subtleRow"><strong>{worker.name}</strong><span className="pill">{worker.status}</span></div><div className="muted">{worker.role} • {worker.focus}</div></div>)}</div>
        </div>
      </div>

      <div className="splitGrid" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="panelTitle"><h3>Tasks</h3><span className="muted">{tasks.length}</span></div>
          <div className="stack">{tasks.map((task) => <div className="subcard" key={task.id}><div className="subtleRow"><strong>{task.id}</strong><span>{task.status}</span></div><div>{task.title}</div><div className="muted" style={{ marginTop: 6 }}>{task.owner} • {task.priority}</div></div>)}</div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Project docs</h3><span className="muted">{docs.length}</span></div>
          <div className="stack">{docs.map((doc) => <div className="subcard" key={doc.id}><strong>{doc.title}</strong><div className="muted">{doc.type} • Updated {doc.updated}</div><div style={{ marginTop: 6 }}>{doc.summary}</div></div>)}</div>
        </div>
      </div>

      <div className="splitGrid" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="panelTitle"><h3>Memory context</h3><span className="muted">{memory.length}</span></div>
          <div className="stack">{memory.map((item) => <div className="subcard" key={item.id}><strong>{item.title}</strong><div className="muted">{item.bucket} • {item.source}</div><div style={{ marginTop: 6 }}>{item.summary}</div></div>)}</div>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Cron coverage</h3><span className="muted">{cronJobs.length}</span></div>
          <div className="stack">{cronJobs.map((job) => <div className="subcard" key={job.id}><strong>{job.name}</strong><div className="muted">{job.schedule} • Next: {job.next_run}</div><div style={{ marginTop: 6 }}>{job.notes}</div></div>)}</div>
        </div>
      </div>
    </SectionPage>
  );
}
