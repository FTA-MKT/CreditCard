import React from 'react';

export function Toggle({ on, onClick, disabled }) {
  return (
    <label className="toggle" title={disabled ? 'Required — cannot be changed' : (on ? 'Enabled' : 'Disabled')}>
      <input type="checkbox" checked={!!on} disabled={!!disabled} onChange={disabled ? undefined : onClick} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}
