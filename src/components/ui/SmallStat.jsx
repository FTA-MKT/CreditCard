import React from 'react';
import { Icon } from './Icon';

export function SmallStat({ label, value, icon, tone }) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <div className={`kpi-icon --${tone}`}>
        <Icon name={icon} className="ico" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}
