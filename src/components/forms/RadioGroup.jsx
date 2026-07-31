import React from 'react';

export function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 22, alignItems: 'center', padding: '6px 0', flexWrap: 'wrap' }}>
      {options.map(o => (
        <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
          {o.label}
        </label>
      ))}
    </div>
  );
}
