import React from 'react';
import { Icon } from './Icon';

export function Checkbox({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
      border: '1.5px solid ' + (on ? 'var(--fta-primary-6)' : 'var(--fta-line-4)'),
      background: on ? 'var(--fta-primary-6)' : 'var(--fta-bg-1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0, cursor: 'pointer',
    }}>
      {on && <Icon name="check" size={12} strokeWidth={3} />}
    </button>
  );
}
