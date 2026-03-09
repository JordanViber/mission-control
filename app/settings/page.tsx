import { SectionPage } from '@/components/section-page';

export default function SettingsPage() {
  return (
    <SectionPage currentPath="/settings" title="Settings" subtitle="System defaults for models, runtime policies, project seeds, and future integrations.">
      <div className="splitGrid">
        <div className="card">
          <div className="panelTitle"><h3>Default runtime policy</h3><span className="pill">v1</span></div>
          <ul className="list">
            <li>Primary model: openai-codex/gpt-5.4</li>
            <li>Persistent worker sessions preferred over disposable workers</li>
            <li>Jordan remains final approver for destructive or external actions</li>
          </ul>
        </div>
        <div className="card">
          <div className="panelTitle"><h3>Next settings to add</h3><span className="muted">Planned</span></div>
          <ul className="list">
            <li>Gateway connection settings</li>
            <li>Cron ownership + schedule editor</li>
            <li>Memory indexing controls</li>
            <li>Per-project worker defaults</li>
          </ul>
        </div>
      </div>
    </SectionPage>
  );
}
