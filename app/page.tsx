import { Brain, CalendarClock, FolderKanban, KanbanSquare, Network, ScrollText } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { StatGrid } from '@/components/cards';
import { cronJobs, docs, memoryItems, projects, workers } from '@/lib/data';

const tools = [
  { name: 'Task Board', icon: KanbanSquare, description: 'Kanban queue for inbox, assigned, in progress, testing, review, and done.', status: 'Core v1' },
  { name: 'Team', icon: Network, description: 'Persistent teammates, reporting lines, session health, and role ownership.', status: 'Core v1' },
  { name: 'Memory', icon: Brain, description: 'Search, browse, and inspect long-term memory, daily memory, and notable decisions.', status: 'Core v1' },
  { name: 'Cron & Calendar', icon: CalendarClock, description: 'View scheduled jobs, next runs, outcomes, drift, and linked reminders.', status: 'Core v1' },
  { name: 'Docs', icon: ScrollText, description: 'Living documentation, architecture notes, runbooks, and generated specs.', status: 'Core v1' },
  { name: 'Projects', icon: FolderKanban, description: 'Project dashboards, deliverables, milestones, and workstreams. Seed with optionsTaxHub.', status: 'Core v1' },
];

export default function HomePage() {
  return (
    <AppShell currentPath="/">
      <div className="hero">
        <div className="card">
          <div className="panelTitle">
            <h2>Mission Control dashboard</h2>
            <span className="pill">Persistent teammate OS</span>
          </div>
          <p className="muted">
            This build is centered on a tool-based left sidebar, a persistent team model, and project-aware memory, docs, cron, and delivery workflows.
          </p>
          <ul className="list">
            <li>Researcher, Developer, Reviewer, and Operator as first-class teammates</li>
            <li>Projects as the top-level business container</li>
            <li>Memory and cron surfaced as inspectable tools, not hidden internals</li>
          </ul>
          <StatGrid />
        </div>

        <div className="card">
          <div className="panelTitle">
            <h3>Initial org chart</h3>
            <span className="muted">Reporting view</span>
          </div>
          <div className="orgLine"><span>Jordan</span><span className="muted">Owner / Approver</span></div>
          {workers.map((worker) => (
            <div className="orgLine" key={worker.id}><span>{worker.name}</span><span className="muted">Reports to {worker.reportsTo}</span></div>
          ))}
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
          <div className="panelTitle"><h3>Project seed</h3><span className="muted">{projects[0].name}</span></div>
          <ul className="list">
            <li>{projects[0].summary}</li>
            <li>Default team: {projects[0].defaultTeam.join(' + ')}</li>
            <li>Stage: {projects[0].stage}</li>
          </ul>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Operational snapshot</h3><span className="muted">Today</span></div>
          <ul className="list">
            <li>{memoryItems.length} memory entries indexed</li>
            <li>{docs.length} docs visible in Docs tool</li>
            <li>{cronJobs.length} scheduled jobs registered</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
