import React from 'react';
import { Icon } from '../components/Shell';

function ModuleCard({ icon, title, description, onClick }) {
  return (
    <div
      className="card --hoverable"
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: 'var(--fta-fill-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fta-primary-6)', flexShrink: 0,
      }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          <Icon name="chev-right" size={16} style={{ color: 'var(--fta-text-3)', flexShrink: 0 }} />
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginTop: 4 }}>{description}</div>
      </div>
    </div>
  );
}

export default function SettingsView({ navigate }) {
  return (
    <div className="content-inner fade-in" data-screen-label="Settings">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-subtitle">Configuration and administration for this program</div>
        </div>
      </div>

      <div className="card-section-title">Configuration</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <ModuleCard
          icon="circle"
          title="Autopay Policy"
          description="Manage payment automation rules, execution timing, reminders and notification settings."
          onClick={() => navigate('autopay-policy')}
        />
        <ModuleCard
          icon="file"
          title="Audit Logs"
          description="Track user activities, configuration changes, and system events."
          onClick={() => navigate('audit-logs')}
        />
      </div>
    </div>
  );
}
