/* global React, ReactDOM, Sidebar, Topbar, DashboardView, ProgramsView, CustomersView, DisputesView, SubProgramsView, NestedProgramView, CardsView, TransactionsView, FraudView, AutopayView, StatementsView, SpendView, TweaksPanel, TweakSection, TweakRadio, TweakColor, useTweaks */
// app.jsx — Router shell

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute] = useStateApp('dashboard');
  const [param, setParam] = useStateApp(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useStateApp(false);

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "#1634A4",
    "density": "regular",
    "sidebarCollapsed": false,
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // sync sidebar with tweak
  useEffectApp(() => {
    setSidebarCollapsed(!!t.sidebarCollapsed);
  }, [t.sidebarCollapsed]);

  // apply accent color
  useEffectApp(() => {
    document.documentElement.style.setProperty('--fta-primary-6', t.accent);
    // derive darker shade for hover
    document.documentElement.style.setProperty('--primary', t.accent);
    document.documentElement.style.setProperty('--ring', t.accent);
  }, [t.accent]);

  function navigate(r, p = null) {
    setRoute(r);
    setParam(p);
    // scroll content top
    setTimeout(() => {
      const el = document.querySelector('.content');
      if (el) el.scrollTop = 0;
    }, 0);
  }

  const view = (() => {
    switch (route) {
      case 'dashboard':       return <DashboardView navigate={navigate} />;
      case 'programs':
      case 'program-detail':  return <ProgramsView navigate={navigate} navParam={param} />;
      case 'subprograms':     return <SubProgramsView navigate={navigate} />;
      case 'nested':          return <NestedProgramView navigate={navigate} />;
      case 'cards':           return <CardsView navigate={navigate} />;
      case 'customers':
      case 'customer-detail': return <CustomersView navigate={navigate} navParam={param} />;
      case 'autopay-policy':
      case 'autopay-enrollment':
      case 'autopay-monitoring': return <AutopayView route={route} navigate={navigate} />;
      case 'spend-rules':
      case 'spend-groups':
      case 'spend-sim':       return <SpendView route={route} navigate={navigate} />;
      case 'billing-summary':
      case 'statements':
      case 'statement-detail':
      case 'payments':        return <StatementsView route={route} navigate={navigate} navParam={param} />;
      case 'transactions':    return <TransactionsView navigate={navigate} />;
      case 'fraud':           return <FraudView navigate={navigate} />;
      case 'disputes':
      case 'dispute-detail':  return <DisputesView navigate={navigate} navParam={param} />;
      default:                return <DashboardView navigate={navigate} />;
    }
  })();

  return (
    <div className={"app-root --density-" + t.density + (sidebarCollapsed ? " --sidebar-collapsed" : "")}>
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
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakRadio
          label="Sidebar"
          value={t.sidebarCollapsed ? 'collapsed' : 'expanded'}
          options={['expanded', 'collapsed']}
          onChange={(v) => setTweak('sidebarCollapsed', v === 'collapsed')}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
