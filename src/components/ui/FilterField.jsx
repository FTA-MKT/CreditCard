import React from 'react';

export function FilterField({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>{label}</div>
      <div className="select">{children}</div>
    </div>
  );
}
