import React from 'react';
import { initials } from './Icon';

const AVATAR_COLORS = ['#5598F5','#55D4D0','#F1A943','#77CF64','#C14FC4','#F9615B','#B972E8','#0F53BE'];

export function ColorAvatar({ name, size = 'md' }) {
  const idx = name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0;
  const sz = size === 'sm' ? 24 : size === 'lg' ? 48 : 32;
  const fs = size === 'sm' ? 10 : size === 'lg' ? 18 : 13;
  return (
    <div style={{
      width: sz, height: sz, borderRadius: '50%',
      background: AVATAR_COLORS[idx], color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: fs, fontWeight: 600, flexShrink: 0, userSelect: 'none',
    }}>
      {initials(name)}
    </div>
  );
}
