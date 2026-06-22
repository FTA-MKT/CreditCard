import React from 'react';
import { Icon, initials } from './Shell';

// ── ColorAvatar ─────────────────────────────────────────────────
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

// ── FilterField ────────────────────────────────────────────────
export function FilterField({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>{label}</div>
      <div className="select">{children}</div>
    </div>
  );
}

// ── Field (read-only display row) ──────────────────────────────
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

// ── Pager ──────────────────────────────────────────────────────
export function Pager() {
  return (
    <div className="pager">
      <button disabled>‹</button>
      <button className="--active">1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
      <button>›</button>
    </div>
  );
}

// ── ProgramLogo ────────────────────────────────────────────────
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

// ── NetworkMark ────────────────────────────────────────────────
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

// ── SmallStat ──────────────────────────────────────────────────
export function SmallStat({ label, value, icon, tone }) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <div className={`kpi-icon --${tone}`}>
        <Icon name={icon} className="ico" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────
export function Toggle({ on, onClick, disabled }) {
  return (
    <label className="toggle" title={disabled ? 'Required — cannot be changed' : (on ? 'Enabled' : 'Disabled')}>
      <input type="checkbox" checked={!!on} disabled={!!disabled} onChange={disabled ? undefined : onClick} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}

// ── Checkbox ──────────────────────────────────────────────────
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

// ── fmtMoney ───────────────────────────────────────────────────
export function fmtMoney(n) {
  return '$ ' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Credit card art ────────────────────────────────────────────
const CARD_THEMES = {
  'Neo Bank':       'linear-gradient(138deg, #0c1640 0%, #1a2d6e 50%, #0f4d6b 100%)',
  'Allegra Travel': 'linear-gradient(138deg, #0a2540 0%, #1a4a6e 50%, #0e3d5c 100%)',
  'SMB Cashback':   'linear-gradient(138deg, #1a0c40 0%, #2d1a6e 50%, #4d0f6b 100%)',
};

export function CreditCardArt({ card }) {
  const bg = CARD_THEMES[card.brand] || CARD_THEMES['Neo Bank'];
  return (
    <div className="credit-card" style={{ background: bg }}>
      <div className="cc-decor" />
      <div className="cc-decor-2" />
      <div className="credit-card-top">
        <span className={"credit-card-pill" + (card.type === 'Virtual' ? ' --virtual' : '')}>{card.type}</span>
        <span className="credit-card-brand">{card.brand}</span>
      </div>
      <div className="credit-card-middle">
        <div className="cc-chip" />
        <div className="credit-card-number">
          ****  ****  ****  <span style={{ opacity: 1 }}>{card.last4}</span>
        </div>
      </div>
      <div className="credit-card-bot">
        <div>
          <div className="val">{card.holder}</div>
          <div className="lbl">Card Holder</div>
        </div>
        <div>
          <div className="val">{card.exp}</div>
          <div className="lbl">Expires</div>
        </div>
        <div className="credit-card-network">
          {card.network === 'Visa' ? 'VISA' : 'MC'}
          <span className="vstate">{card.status === 'Active' ? 'Active' : card.status}</span>
        </div>
      </div>
    </div>
  );
}

export function buildCardsForCustomer(c) {
  const baseSeed = parseInt(c.id.replace(/\D/g, '')) || 1;
  const types = ['Physical', 'Virtual', 'Virtual', 'Virtual'];
  const nets  = ['Visa', 'Visa', 'Mastercard'];
  const last4s = ['4142', '8211', '6190', '3022', '7711', '0048', '1955', '6624'];
  const count = Math.max(1, c.cards || 1);
  return Array.from({ length: count }).map((_, i) => ({
    id: c.id + '-' + i,
    brand: i === 0 ? 'Neo Bank' : ['Neo Bank', 'Allegra Travel', 'SMB Cashback'][(i + baseSeed) % 3],
    last4: last4s[(i + baseSeed) % last4s.length],
    exp: '06/25',
    type: types[(i + baseSeed) % types.length],
    network: nets[(i + baseSeed) % nets.length],
    holder: c.name,
    status: c.status === 'Active' ? 'Active' : c.status,
  }));
}
