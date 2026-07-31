import React from 'react';

export function AccordionSection({ title, sub, open, done, onToggle, children, badge }) {
  return (
    <div style={{ border: '1.5px solid var(--fta-line-2)', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: 'var(--fta-fill-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--fta-text-3)', transform: open ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform .2s' }}>▶</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2 }}>{sub}</div>}
          </div>
        </div>
        {badge || (
          <span style={{ fontSize: 12, fontWeight: 500, color: done ? 'var(--fta-success)' : 'var(--fta-warning)' }}>
            {done ? 'Complete' : 'Incomplete'}
          </span>
        )}
      </div>
      {open && (
        <div style={{ padding: '20px', borderTop: '1px solid var(--fta-line-2)', background: '#fff' }}>
          {children}
        </div>
      )}
    </div>
  );
}
