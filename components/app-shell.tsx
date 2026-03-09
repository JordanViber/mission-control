import Link from 'next/link';
import { Brain, CalendarClock, FolderKanban, Home, KanbanSquare, Network, ScrollText, Settings, ActivitySquare, TimerReset, Wrench } from 'lucide-react';
import { ReactNode } from 'react';

const nav = [
  {
    label: 'Workspace',
    items: [
      { href: '/', label: 'Dashboard', icon: Home },
      { href: '/task-board', label: 'Task Board', icon: KanbanSquare },
      { href: '/projects', label: 'Projects', icon: FolderKanban },
      { href: '/docs', label: 'Docs', icon: ScrollText },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/team', label: 'Team', icon: Network },
      { href: '/memory', label: 'Memory', icon: Brain },
      { href: '/cron-calendar', label: 'Cron & Calendar', icon: CalendarClock },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/sessions', label: 'Sessions', icon: TimerReset },
      { href: '/events', label: 'Events', icon: ActivitySquare },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AppShell({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div>
          <div className="pill"><Wrench size={14} /> Custom Build</div>
          <h1 style={{ marginTop: 14 }}>Mission Control</h1>
          <p>A control plane for persistent AI teammates, projects, memory, scheduling, and delivery.</p>
        </div>

        {nav.map((section) => (
          <div className="navSection" key={section.label}>
            <div className="navLabel">{section.label}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <Link className={`navItem ${active ? 'active' : ''}`} key={item.href} href={item.href}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon size={16} /> {item.label}</span>
                  <span className="badge">›</span>
                </Link>
              );
            })}
          </div>
        ))}
      </aside>

      <section className="content">{children}</section>
    </main>
  );
}
