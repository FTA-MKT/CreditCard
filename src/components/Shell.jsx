import React, { useState } from 'react';

// ── Tiny inline icons ──────────────────────────────────────────
export const Icon = ({ name, size = 16, className = '', strokeWidth = 1.75, style, ...rest }) => {
  const s = size;
  const sw = strokeWidth;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', className, style };
  const paths = {
    'layout':           <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    'box':              <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>,
    'card':             <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    'users':            <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    'arrow-leftright':  <><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></>,
    'message':          <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    'grid':             <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    'briefcase':        <><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    'bell':             <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    'calendar':         <><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></>,
    'apps':             <><circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/></>,
    'user':             <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    'help':             <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'chev-down':        <><polyline points="6 9 12 15 18 9"/></>,
    'chev-left':        <><polyline points="15 18 9 12 15 6"/></>,
    'chev-right':       <><polyline points="9 18 15 12 9 6"/></>,
    'chev-double-left': <><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></>,
    'chev-double-right':<><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></>,
    'plus':             <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    'search':           <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    'shield':           <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></>,
    'receipt':          <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/></>,
    'chart':            <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    'phone':            <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    'edit':             <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    'check':            <><polyline points="20 6 9 17 4 12"/></>,
    'circle':           <><circle cx="12" cy="12" r="10"/></>,
    'dot':              <><circle cx="12" cy="12" r="4"/></>,
    'arrow-up':         <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    'arrow-down':       <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></>,
    'trending-up':      <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    'trending-down':    <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>,
    'settings':         <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    'list':             <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    'tree':             <><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M8 6h7a2 2 0 0 1 2 2v2"/><path d="M8 18h7a2 2 0 0 0 2-2v-2"/></>,
    'file':             <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    'mail':             <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></>,
    'help-circle':      <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'upload':           <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    'download':         <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    'x':                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    'lock':             <><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    'filter':           <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    'eye':              <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    'external':         <><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    'info':             <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    'alert-triangle':   <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'check-circle':     <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

// ── Initials helper ────────────────────────────────────────────
export function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// ── Top-level tabs (topbar primary nav) ────────────────────────
export const TOP_TABS = [
  { id: 'dashboard',   label: 'Dashboard',              route: 'dashboard',       subTabs: null },
  { id: 'programs',    label: 'Program',                route: 'programs',        subTabs: null },
  { id: 'subprograms', label: 'Subprogram',             route: 'subprograms',     subTabs: null },
  { id: 'nested',      label: 'Nested Program',         route: 'nested',          subTabs: null },
  { id: 'cards',       label: 'Cards',                  route: 'cards',           subTabs: null },
  { id: 'customer',    label: 'Customer',               route: 'customers',       subTabs: null },
  { id: 'autopay',     label: 'Autopay Policy',         route: 'autopay-policy',  subTabs: [
    { id: 'autopay-policy',     label: 'Policy' },
    { id: 'autopay-enrollment', label: 'Enrollment' },
    { id: 'autopay-monitoring', label: 'Execution Monitoring' },
  ]},
  { id: 'spend',       label: 'Spend Controls',         route: 'spend-rules',     subTabs: [
    { id: 'spend-rules',  label: 'Rules' },
    { id: 'spend-groups', label: 'MCC Groups' },
    { id: 'spend-sim',    label: 'Simulation' },
  ]},
  { id: 'statements',  label: 'Statement & Billing',    route: 'billing-summary', subTabs: [
    { id: 'billing-summary', label: 'Billing Summary' },
    { id: 'statements',      label: 'Statements' },
    { id: 'payments',        label: 'Payments' },
  ]},
  { id: 'transactions',label: 'Transaction Monitoring', route: 'transactions',    subTabs: [
    { id: 'transactions', label: 'Transactions' },
    { id: 'fraud',        label: 'Fraud Alerts' },
  ]},
  { id: 'dispute',     label: 'Dispute',                route: 'disputes',        subTabs: null },
];

// route → top-tab id
export const ROUTE_TO_TOPTAB = {};
TOP_TABS.forEach(t => {
  ROUTE_TO_TOPTAB[t.route] = t.id;
  (t.subTabs || []).forEach(s => { ROUTE_TO_TOPTAB[s.id] = t.id; });
});
Object.assign(ROUTE_TO_TOPTAB, {
  'program-detail':'programs', 'program-detail-subs':'programs', 'create-program':'programs',
  'create-subprogram':'subprograms', 'subprogram-detail':'subprograms',
  'nested':'subprograms', 'create-card':'subprograms',
  'customer-detail':'customer',
  'statement-detail':'statements',
  'dispute-detail':'dispute',
});

// Backward-compat aliases used elsewhere in the app
export const ROUTE_TO_TAB    = ROUTE_TO_TOPTAB;
export const ROUTE_TO_MODULE = ROUTE_TO_TOPTAB;
export const DEFAULT_ROUTE   = Object.fromEntries(TOP_TABS.map(t => [t.id, t.route]));
export const MODULES = TOP_TABS.map(t => ({
  id: t.id, label: t.label, icon: 'card',
  tabs: t.subTabs || [{ id: t.route, label: t.label }],
}));

// ── Topbar ─────────────────────────────────────────────────────
export function Topbar({ route, navigate }) {
  const topTabId  = ROUTE_TO_TOPTAB[route] || 'dashboard';
  const activeTab = TOP_TABS.find(t => t.id === topTabId) || TOP_TABS[0];
  const subTabs   = activeTab.subTabs;

  return (
    <header className="topbar" data-screen-label="Topbar">
      <div className="topbar-main">
        <div className="topbar-section-label">Card Issuance</div>
        <nav className="topbar-tabs" aria-label="Section tabs">
          {TOP_TABS.map(t => (
            <button
              key={t.id}
              className={'topbar-tab' + (topTabId === t.id ? ' --active' : '')}
              onClick={() => navigate(t.route)}
              aria-current={topTabId === t.id ? 'page' : undefined}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="topbar-action" aria-label="App launcher"><Icon name="apps" size={15} /></button>
          <button className="topbar-action" aria-label="Calendar">
            <Icon name="calendar" size={15} />
            <span className="dot" />
          </button>
          <button className="topbar-action" aria-label="Notifications">
            <Icon name="bell" size={15} />
            <span className="dot" />
          </button>
          <div className="topbar-divider" aria-hidden="true" />
          <div className="topbar-avatar" title="Admin User">AD</div>
        </div>
      </div>
      {subTabs && subTabs.length > 1 && (
        <nav className="topbar-subtabs" aria-label="Sub-section tabs">
          {subTabs.map(s => (
            <button
              key={s.id}
              className={'topbar-subtab' + (route === s.id ? ' --active' : '')}
              onClick={() => navigate(s.id)}
              aria-current={route === s.id ? 'page' : undefined}
            >
              {s.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
export function Sidebar({ collapsed, onToggle, navigate }) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-logo">
        {collapsed ? <FtaMark /> : <FtaLogo />}
      </div>
      <button
        className="sidebar-collapse"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Icon name={collapsed ? 'chev-double-right' : 'chev-double-left'} size={11} />
      </button>
      {!collapsed && (
        <div className="sidebar-section">
          <button className="sidebar-workspace">
            <span>Workspace</span>
            <Icon name="chev-down" size={13} className="chev" />
          </button>
        </div>
      )}
      {!collapsed && (
        <div className="sidebar-group-label">
          <span>Functions</span>
          <Icon name="settings" size={11} />
        </div>
      )}
      <nav className="sidebar-nav">
        <button
          className="sidebar-nav-item --active"
          title="Card Issuance"
          onClick={() => navigate('dashboard')}
        >
          <Icon name="card" className="ico" size={15} />
          {!collapsed && <span className="lbl">Card Issuance</span>}
        </button>
        <div className="sidebar-divider" role="separator" />
        {[
          { id: 'reports',  label: 'Reports',  icon: 'list' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ].map(n => (
          <button key={n.id} className="sidebar-nav-item" title={n.label}>
            <Icon name={n.icon} className="ico" size={15} />
            {!collapsed && <span className="lbl">{n.label}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-help" role="button" tabIndex={0}>
        <Icon name="help-circle" size={14} />
        {!collapsed && <span>Help & Support</span>}
      </div>
    </aside>
  );
}

// ── FTA Logo ───────────────────────────────────────────────────
export function FtaLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd"
          d="M11.5 37.9c2.99 1.51 6.31 2.23 9.65 2.09 3.34-0.14 6.6-1.13 9.45-2.88 2.85-1.75 5.21-4.21 6.84-7.13 1.64-2.92 2.5-6.21 2.5-9.55 0-0.24 0-0.49 0-0.73v-3.85H20.94c-0.64-0.05-1.29 0.02-1.9 0.23-0.61 0.2-1.18 0.53-1.66 0.96-0.87 0.97-1.32 2.25-1.27 3.55l0.07 5.21c0 0 9.55-2.09 10.01-2.03L11.5 37.9z"
          fill="#22A6DA"/>
        <path fillRule="evenodd" clipRule="evenodd"
          d="M40 0.89H20.4c-4.09-0.01-8.08 1.27-11.41 3.66-3.33 2.38-5.83 5.74-7.15 9.61-1.32 3.88-1.39 8.07-0.21 11.99 1.18 3.92 3.56 7.37 6.81 9.86V22.02c0-6.9 4.63-12.92 11.68-12.92H40V0.89z"
          fill="#303040"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, userSelect: 'none' }}>
        <span style={{ fontWeight: 700, color: '#1A2033', fontSize: 13.5, letterSpacing: '0.05em' }}>FINTECH</span>
        <span style={{ fontWeight: 500, color: '#6B7280', fontSize: 8, letterSpacing: '0.35em' }}>AUTOMATION</span>
      </div>
    </div>
  );
}

export function FtaMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-label="FTA" role="img">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M11.5 37.9c2.99 1.51 6.31 2.23 9.65 2.09 3.34-0.14 6.6-1.13 9.45-2.88 2.85-1.75 5.21-4.21 6.84-7.13 1.64-2.92 2.5-6.21 2.5-9.55 0-0.24 0-0.49 0-0.73v-3.85H20.94c-0.64-0.05-1.29 0.02-1.9 0.23-0.61 0.2-1.18 0.53-1.66 0.96-0.87 0.97-1.32 2.25-1.27 3.55l0.07 5.21c0 0 9.55-2.09 10.01-2.03L11.5 37.9z"
        fill="#22A6DA"/>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M40 0.89H20.4c-4.09-0.01-8.08 1.27-11.41 3.66-3.33 2.38-5.83 5.74-7.15 9.61-1.32 3.88-1.39 8.07-0.21 11.99 1.18 3.92 3.56 7.37 6.81 9.86V22.02c0-6.9 4.63-12.92 11.68-12.92H40V0.89z"
        fill="#303040"/>
    </svg>
  );
}

// ── Breadcrumb ─────────────────────────────────────────────────
export function Breadcrumb({ items, navigate }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        if (isLast) {
          return <span key={i} className="crumb-current" aria-current="page">{it.label}</span>;
        }
        return (
          <React.Fragment key={i}>
            <span
              className="crumb-link"
              role="button"
              tabIndex={0}
              onClick={() => it.route && navigate(it.route, it.param || null)}
              onKeyDown={e => e.key === 'Enter' && it.route && navigate(it.route, it.param || null)}
            >
              {i === 0 && <Icon name="chev-left" size={13} />}
              {it.label}
            </span>
            <span className="crumb-sep" aria-hidden="true">/</span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ── StatusPill ─────────────────────────────────────────────────
export function StatusPill({ status }) {
  const toneMap = {
    'Active':'success', 'Case Won':'success', 'Posted':'success', 'Verified':'success', 'Published':'success',
    'Inactive':'inactive', 'Case Closed':'inactive', 'Closed':'inactive',
    'Under Review':'warning', 'Arbitration':'warning', 'Prearbitration':'warning', 'Frozen':'warning', 'Processing':'warning', 'Held':'warning', 'Unverified':'warning',
    'Pending Customer':'info', 'Submitted':'info', 'Representment':'info', 'Pending':'info', 'Scheduled':'info', 'Regenerated':'info',
    'Declined':'danger', 'Disputed':'danger', 'Failed':'danger', 'At-Risk':'danger',
  };
  const tone = toneMap[status] || 'inactive';
  return (
    <span className={`pill-status --${tone}`}>
      <span className="dot" />
      {status}
    </span>
  );
}
