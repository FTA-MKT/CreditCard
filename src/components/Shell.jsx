import React, { useState } from 'react';
export { Icon, initials } from './ui/Icon';
import { Icon } from './ui/Icon';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

// ── Top-level tabs (topbar primary nav) ─────────────────────────
// `routes` is the single source of truth for "which top-level module does this
// route belong to" — every route App.jsx's switch can render MUST be listed in
// exactly one module's `routes` array below. This is what drives the Topbar's
// active-tab highlight (and the Sidebar's active module), so a route that's
// missing here will silently fall back to Dashboard — see ROUTE_TO_TOPTAB.
// Adding a new detail/create/sub-page for a module? Add its route string to
// that module's `routes` array — do NOT add a parallel lookup table elsewhere.
export const TOP_TABS = [
  { id: 'dashboard',   label: 'Dashboard',              route: 'dashboard',       subTabs: null,
    routes: ['dashboard'] },
  { id: 'programs',    label: 'Program',                route: 'programs',        subTabs: null,
    routes: ['programs', 'program-detail', 'program-detail-subs', 'create-program'] },
  { id: 'subprograms', label: 'Subprogram',             route: 'subprograms',     subTabs: null,
    routes: ['subprograms', 'create-subprogram', 'subprogram-detail'] },
  { id: 'nested',      label: 'Nested Program',         route: 'nested',          subTabs: null,
    routes: ['nested'] },
  { id: 'cards',       label: 'Cards',                  route: 'cards',           subTabs: null,
    routes: ['cards', 'card-detail', 'issue-card'] },
  { id: 'customer',    label: 'Customer',               route: 'customers',       subTabs: null,
    routes: ['customers', 'customer-detail'] },
  { id: 'statements',  label: 'Statement & Billing',    route: 'billing-summary', subTabs: null,
    routes: ['billing-summary', 'statement-detail'] },
  { id: 'payments',    label: 'Payments',               route: 'payments',        subTabs: null,
    routes: ['payments'] },
  { id: 'transactions',label: 'Transaction',            route: 'transactions',    subTabs: null,
    routes: ['transactions', 'transaction-detail'] },
  { id: 'dispute',     label: 'Dispute',                route: 'disputes',        subTabs: null,
    routes: ['disputes', 'dispute-detail', 'create-dispute'] },
  // Settings is a landing page of module cards (Autopay Policy, Reports) — each module
  // owns its own in-page Breadcrumb + Tabs once entered, same as Program → Program Detail.
  // No Topbar-level subTabs here; that's what left Autopay Policy without a return path.
  { id: 'settings',    label: 'Settings',               route: 'settings',        subTabs: null,
    routes: ['settings', 'autopay-policy', 'audit-logs', 'audit-log-detail'] },
];

// route → top-tab id. Derived purely from each module's `routes` array above —
// no parallel/manual override table, so there's exactly one place to update
// when a module gains a new route.
export const ROUTE_TO_TOPTAB = {};
TOP_TABS.forEach(t => {
  (t.routes || [t.route]).forEach(r => { ROUTE_TO_TOPTAB[r] = t.id; });
});

if (import.meta.env.DEV) {
  const allSwitchRoutes = [
    'dashboard', 'programs', 'program-detail', 'program-detail-subs', 'create-program',
    'create-subprogram', 'subprograms', 'nested', 'subprogram-detail', 'issue-card',
    'cards', 'card-detail', 'customers', 'customer-detail',
    'autopay-policy',
    'billing-summary', 'statement-detail', 'payments',
    'transactions', 'transaction-detail', 'disputes', 'dispute-detail', 'create-dispute',
    'settings', 'audit-logs', 'audit-log-detail',
  ];
  const unmapped = allSwitchRoutes.filter(r => !ROUTE_TO_TOPTAB[r]);
  if (unmapped.length) {
    // eslint-disable-next-line no-console
    console.warn('[nav] Routes rendered by App.jsx but missing from TOP_TABS routes[] — they will fall back to Dashboard in the top nav:', unmapped);
  }
}

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

  const hasSubTabs = subTabs && subTabs.length > 1;

  return (
    <header className="topbar" data-screen-label="Topbar" style={hasSubTabs ? { borderBottom: 'none' } : undefined}>
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
      {hasSubTabs && (
        <div className="topbar-subtabs" aria-label="Sub-section tabs">
          <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', paddingBottom: 12 }}>
            <Tabs value={route} onValueChange={id => navigate(id)}>
              <TabsList style={{ height: 46 }}>
                {subTabs.map(s => (
                  <TabsTrigger key={s.id} value={s.id} style={{ paddingLeft: 16, paddingRight: 16 }}>
                    {s.icon && <Icon name={s.icon} className="ico" size={14} />}
                    {s.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
// Every TOP_TABS module currently belongs to the single "Card Issuance" app, so
// this always resolves active — but it's derived from the same ROUTE_TO_TOPTAB
// source of truth as the Topbar, not hardcoded, so a second sidebar app added
// later composes correctly instead of needing its own bespoke active check.
const SIDEBAR_APPS = [
  { id: 'card-issuance', label: 'Card Issuance', icon: 'card', route: 'dashboard', moduleIds: TOP_TABS.map(t => t.id) },
];

export function Sidebar({ collapsed, onToggle, navigate, route }) {
  const currentModule = ROUTE_TO_TOPTAB[route] || 'dashboard';

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
        {SIDEBAR_APPS.map(app => (
        <button
          key={app.id}
          className={'sidebar-nav-item' + (app.moduleIds.includes(currentModule) ? ' --active' : '')}
          title={app.label}
          onClick={() => navigate(app.route)}
        >
          <Icon name={app.icon} className="ico" size={15} />
          {!collapsed && <span className="lbl">{app.label}</span>}
        </button>
        ))}
      </nav>
      <div className="sidebar-help" role="button" tabIndex={0}>
        <Icon name="help-circle" size={15} />
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
