import React from 'react';

export function FormField({ label, required, style, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-4)', marginBottom: 5 }}>
        {label}{required && <span style={{ color: 'var(--fta-error)', marginLeft: 2 }}>*</span>}
      </div>
      {children}
    </div>
  );
}
