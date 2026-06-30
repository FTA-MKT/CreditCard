import React, { useState } from 'react';
export { Icon, initials } from './ui/Icon';
import { Icon } from './ui/Icon';

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
  'nested':'subprograms', 'create-card':'subprograms', 'issue-card':'cards',
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

export { Breadcrumb } from './ui/Breadcrumb';
export { StatusPill } from './ui/StatusPill';
