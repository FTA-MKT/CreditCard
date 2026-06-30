import React from 'react';

export function ProgramLogo({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size === 72 ? 12 : 6,
      background: '#0A1135',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path d="M4 20 L14 6 L20 20 Z" fill="#F1A943"/>
        <path d="M4 19 Q12 17 20 19 L20 21 Q12 19 4 21 Z" fill="#55D4D0"/>
      </svg>
    </div>
  );
}
