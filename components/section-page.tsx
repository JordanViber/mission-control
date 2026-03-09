import { ReactNode } from 'react';
import { AppShell } from './app-shell';

export function SectionPage({
  currentPath,
  title,
  subtitle,
  children,
}: {
  currentPath: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <AppShell currentPath={currentPath}>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 8 }}>{title}</h2>
        <p className="muted" style={{ margin: 0 }}>{subtitle}</p>
      </div>
      {children}
    </AppShell>
  );
}
