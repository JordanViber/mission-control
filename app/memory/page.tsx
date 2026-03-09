import { SectionPage } from '@/components/section-page';
import { memoryItems } from '@/lib/data';

export default function MemoryPage() {
  return (
    <SectionPage currentPath="/memory" title="Memory" subtitle="Browse long-term memory, daily logs, notable decisions, and project context.">
      <div className="stack">
        {memoryItems.map((item) => (
          <div className="card" key={item.id}>
            <div className="panelTitle"><h3>{item.title}</h3><span className="pill">{item.bucket}</span></div>
            <div className="muted">Source: {item.source}{item.project ? ` • Project: ${item.project}` : ''}</div>
            <p style={{ marginBottom: 0 }}>{item.summary}</p>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
