import { Brain, CalendarClock, FolderKanban, KanbanSquare, Network, ScrollText, Wrench } from 'lucide-react';

const tools = [
  { name: 'Task Board', icon: KanbanSquare, description: 'Kanban queue for inbox, assigned, in progress, testing, review, and done.', status: 'Core v1' },
  { name: 'Team', icon: Network, description: 'Persistent teammates, reporting lines, session health, and role ownership.', status: 'Core v1' },
  { name: 'Memory', icon: Brain, description: 'Search, browse, and inspect long-term memory, daily memory, and notable decisions.', status: 'Core v1' },
  { name: 'Cron & Calendar', icon: CalendarClock, description: 'View scheduled jobs, next runs, outcomes, drift, and linked reminders.', status: 'Core v1' },
  { name: 'Docs', icon: ScrollText, description: 'Living documentation, architecture notes, runbooks, and generated specs.', status: 'Core v1' },
  { name: 'Projects', icon: FolderKanban, description: 'Project dashboards, deliverables, milestones, and workstreams. Seed with optionsTaxHub.', status: 'Core v1' },
];

const nav: Array<{ label: string; items: string[] }> = [
  { label: 'Workspace', items: ['Dashboard', 'Task Board', 'Projects', 'Docs'] },
  { label: 'Operations', items: ['Team', 'Memory', 'Cron & Calendar'] },
  { label: 'System', items: ['Sessions', 'Events', 'Settings'] },
];

export default function HomePage() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div>
          <div className="pill"><Wrench size={14} /> Custom Build</div>
          <h1 style={{ marginTop: 14 }}>Mission Control</h1>
          <p>
            A custom control plane for persistent AI teammates, projects, memory, scheduling, and delivery.
          </p>
        </div>

        {nav.map((section, sectionIndex) => (
          <div className="navSection" key={section.label}>
            <div className="navLabel">{section.label}</div>
            {section.items.map((item, idx) => (
              <div className={`navItem ${sectionIndex === 0 && idx === 0 ? 'active' : ''}`} key={item}>
                <span>{item}</span>
                <span className="badge">›</span>
              </div>
            ))}
          </div>
        ))}
      </aside>

      <section className="content">
        <div className="hero">
          <div className="card">
            <div className="panelTitle">
              <h2>Custom Mission Control v1</h2>
              <span className="pill">Inspired by your reference UI</span>
            </div>
            <p className="muted">
              This build is centered on a tool-based left sidebar and a persistent team model instead of disposable-only agents.
            </p>
            <ul className="list">
              <li>Researcher, Developer, Reviewer, and Operator as first-class teammates</li>
              <li>Persistent worker sessions separated from one-off task workers</li>
              <li>Projects as the top-level container for work, docs, memory, and cron visibility</li>
              <li>optionsTaxHub seeded as the first project</li>
            </ul>
            <div className="kpiGrid">
              <div className="card"><div className="muted">Tools in v1</div><div className="kpiValue">6</div></div>
              <div className="card"><div className="muted">Core teammates</div><div className="kpiValue">4</div></div>
              <div className="card"><div className="muted">Projects seeded</div><div className="kpiValue">1</div></div>
              <div className="card"><div className="muted">Primary model</div><div className="kpiValue" style={{ fontSize: 18 }}>gpt-5.4</div></div>
            </div>
          </div>

          <div className="card">
            <div className="panelTitle">
              <h3>Initial org chart</h3>
              <span className="muted">Reporting view</span>
            </div>
            <div className="orgLine"><span>Jordan</span><span className="muted">Owner / Approver</span></div>
            <div className="orgLine"><span>Operator</span><span className="muted">Runs the system</span></div>
            <div className="orgLine"><span>Researcher</span><span className="muted">Reports to Operator</span></div>
            <div className="orgLine"><span>Developer</span><span className="muted">Reports to Operator</span></div>
            <div className="orgLine"><span>Reviewer</span><span className="muted">Reports to Operator</span></div>
          </div>
        </div>

        <div className="toolGrid">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div className="card" key={tool.name}>
                <div className="panelTitle">
                  <h3 style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon size={18} /> {tool.name}</h3>
                  <span className="pill">{tool.status}</span>
                </div>
                <p className="muted">{tool.description}</p>
              </div>
            );
          })}
        </div>

        <div className="projectGrid">
          <div className="card">
            <div className="panelTitle"><h3>Project seed: optionsTaxHub</h3><span className="muted">Project #1</span></div>
            <ul className="list">
              <li>Revenue-focused product workspace</li>
              <li>Roadmap, docs, cron jobs, memory, and work queue under one project shell</li>
              <li>Developer + Reviewer paired by default</li>
            </ul>
          </div>
          <div className="card">
            <div className="panelTitle"><h3>Why this structure</h3><span className="muted">Design intent</span></div>
            <ul className="list">
              <li>Side-nav becomes the stable operating surface as tools grow</li>
              <li>Team view clarifies ownership and reporting lines</li>
              <li>Memory and cron become inspectable, not hidden implementation details</li>
              <li>Projects keep business context separate from system plumbing</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
