import { MemoryClient } from '@/components/memory-client';
import { SectionPage } from '@/components/section-page';
import { getMemoryItems, getProjects } from '@/lib/data';

export default function MemoryPage() {
  const memoryItems = getMemoryItems();
  const projects = getProjects().map((project) => project.name);

  return (
    <SectionPage currentPath="/memory" title="Memory" subtitle="Browse long-term memory, daily logs, notable decisions, and project context.">
      <MemoryClient initialItems={memoryItems} projects={projects} />
    </SectionPage>
  );
}
