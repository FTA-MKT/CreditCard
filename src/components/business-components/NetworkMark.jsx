import React from 'react';

export function NetworkMark({ network }) {
  if (network === 'Visa') {
    return <span style={{ fontStyle: 'italic', fontWeight: 800, color: '#1A1F71', fontSize: 12, fontFamily: 'Georgia, serif' }}>VISA</span>;
  }
  return (
    <span style={{ display: 'inline-flex' }}>
      <span style={{ width: 14, height: 14, background: '#EB001B', borderRadius: 999 }} />
      <span style={{ width: 14, height: 14, background: '#F79E1B', borderRadius: 999, marginLeft: -6, opacity: 0.85 }} />
    </span>
  );
}
