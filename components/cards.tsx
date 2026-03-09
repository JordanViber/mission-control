import { dashboardStats, tasks } from '@/lib/data';

export function StatGrid() {
  return (
    <div className="kpiGrid">
      {dashboardStats.map((stat) => (
        <div className="card" key={stat.label}>
          <div className="muted">{stat.label}</div>
          <div className="kpiValue">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

export function TaskColumns() {
  const columns = ['Inbox', 'Assigned', 'In Progress', 'Testing', 'Review', 'Done'] as const;
  return (
    <div className="boardGrid">
      {columns.map((column) => {
        const items = tasks.filter((task) => task.status === column);
        return (
          <div className="card" key={column}>
            <div className="panelTitle"><h3>{column}</h3><span className="pill">{items.length}</span></div>
            <div className="stack">
              {items.map((task) => (
                <div key={task.id} className="subcard">
                  <div className="subtleRow"><strong>{task.id}</strong><span className="muted">{task.priority}</span></div>
                  <div>{task.title}</div>
                  <div className="muted" style={{ marginTop: 6 }}>{task.owner} • {task.project}</div>
                </div>
              ))}
              {items.length === 0 ? <div className="muted">No tasks</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
