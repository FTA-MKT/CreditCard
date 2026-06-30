import React, { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './components/Shell';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } from './components/TweaksPanel';
import DashboardView from './views/DashboardView';
import ProgramsView from './views/ProgramsView';
import CustomersView from './views/CustomersView';
import DisputesView from './views/DisputesView';
import { SubProgramsView, NestedProgramView, CardsView, TransactionsView, FraudView } from './views/OtherViews';
import AutopayView from './views/AutopayView';
import SpendView from './views/SpendView';
import StatementsView from './views/StatementsView';
import CreateProgramView from './views/CreateProgramView';
import CreateSubProgramView from './views/CreateSubProgramView';
import CreateCardView from './views/CreateCardView';
import IssueCardView from './views/IssueCardView';

const TWEAK_DEFAULTS = {
  accent: '#1634A4',
  density: 'regular',
  sidebarCollapsed: false,
};

export default function App() {
  const [route, setRoute] = useState('dashboard');
  const [param, setParam] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    setSidebarCollapsed(!!t.sidebarCollapsed);
  }, [t.sidebarCollapsed]);

  useEffect(() => {
    document.documentElement.style.setProperty('--fta-primary-6', t.accent);
    document.documentElement.style.setProperty('--primary', t.accent);
    document.documentElement.style.setProperty('--ring', t.accent);
  }, [t.accent]);

  function navigate(r, p = null) {
    setRoute(r);
    setParam(p);
    setTimeout(() => {
      const el = document.querySelector('.content');
      if (el) el.scrollTop = 0;
    }, 0);
  }

  const view = (() => {
    switch (route) {
      case 'dashboard':                       return <DashboardView navigate={navigate} />;
      case 'programs':
      case 'program-detail':                  return <ProgramsView navigate={navigate} navParam={param} />;
      case 'program-detail-subs':             return <ProgramsView navigate={navigate} navParam={param} initialTab="subs" />;
      case 'create-program':                   return <CreateProgramView navigate={navigate} />;
      case 'create-subprogram':               return <CreateSubProgramView navigate={navigate} programId={param} />;
      case 'subprograms':                     return <SubProgramsView navigate={navigate} />;
      case 'nested':
      case 'subprogram-detail':               return <NestedProgramView navigate={navigate} navParam={param} />;
      case 'create-card':                     return <CreateCardView navigate={navigate} navParam={param} />;
      case 'issue-card':                      return <IssueCardView navigate={navigate} navParam={param} />;
      case 'cards':                           return <CardsView navigate={navigate} />;
      case 'customers':
      case 'customer-detail':                 return <CustomersView navigate={navigate} navParam={param} />;
      case 'autopay-policy':
      case 'autopay-enrollment':
      case 'autopay-monitoring':              return <AutopayView route={route} navigate={navigate} />;
      case 'spend-rules':
      case 'spend-groups':
      case 'spend-sim':                       return <SpendView route={route} navigate={navigate} />;
      case 'billing-summary':
      case 'statements':
      case 'statement-detail':
      case 'payments':                        return <StatementsView route={route} navigate={navigate} navParam={param} />;
      case 'transactions':                    return <TransactionsView navigate={navigate} />;
      case 'fraud':                           return <FraudView navigate={navigate} />;
      case 'disputes':
      case 'dispute-detail':                  return <DisputesView navigate={navigate} navParam={param} />;
      default:                               return <DashboardView navigate={navigate} />;
    }
  })();

  return (
    <div className={`app-root --density-${t.density}${sidebarCollapsed ? ' --sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => { setSidebarCollapsed(c => !c); setTweak('sidebarCollapsed', !sidebarCollapsed); }}
        navigate={navigate}
        route={route}
      />
      <Topbar route={route} navigate={navigate} />
      <main className="content">{view}</main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={['#1634A4', '#0F53BE', '#23A5AA', '#7A5AE0', '#0A1135']}
          onChange={v => setTweak('accent', v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular']}
          onChange={v => setTweak('density', v)}
        />
        <TweakRadio
          label="Sidebar"
          value={t.sidebarCollapsed ? 'collapsed' : 'expanded'}
          options={['expanded', 'collapsed']}
          onChange={v => setTweak('sidebarCollapsed', v === 'collapsed')}
        />
      </TweaksPanel>
    </div>
  );
}
