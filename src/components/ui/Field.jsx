import React from 'react';
import { Icon } from './Icon';

export function Field({ label, value, valueNode, prefix, editable }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {prefix}
          <div className="field-value">{valueNode ?? value}</div>
        </div>
        {editable && <Icon name="edit" size={14} style={{ color: 'var(--fta-text-3)', flexShrink: 0 }} />}
      </div>
    </div>
  );
}
