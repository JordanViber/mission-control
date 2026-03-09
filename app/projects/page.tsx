import { SectionPage } from '@/components/section-page';
import { projects } from '@/lib/data';

export default function ProjectsPage() {
  return (
    <SectionPage currentPath="/projects" title="Projects" subtitle="View project health, team defaults, milestones, and workstream context.">
      <div className="stack">
        {projects.map((project) => (
          <div className="card" key={project.id}>
            <div className="panelTitle"><h3>{project.name}</h3><span className="pill">{project.priority}</span></div>
            <p>{project.summary}</p>
            <div className="muted">Owner: {project.owner} • Stage: {project.stage}</div>
            <div style={{ marginTop: 10 }}><strong>Default team:</strong> {project.defaultTeam.join(', ')}</div>
            <div style={{ marginTop: 10 }}><strong>Milestones:</strong></div>
            <ul className="list">
              {project.milestones.map((milestone) => <li key={milestone}>{milestone}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
