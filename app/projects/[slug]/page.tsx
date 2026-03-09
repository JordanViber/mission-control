import { SectionPage } from '@/components/section-page';
import { ProjectWorkspaceClient } from '@/components/project-workspace-client';
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
      <ProjectWorkspaceClient project={project} workers={workers} tasks={tasks} docs={docs} memory={memory} cronJobs={cronJobs} />
    </SectionPage>
  );
}
