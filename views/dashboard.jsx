/* global React, Icon, StatusPill, ColorAvatar, AppData */
// views/dashboard.jsx

const { useState: useStateDash, useMemo: useMemoDash } = React;

function DashboardView({ navigate }) {
  const d = AppData;

  return (
    <div className="content-inner fade-in" data-screen-label="Dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button className="btn btn-primary">
          <Icon name="plus" size={14} />
          Create New
        </button>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        {d.kpis.map(k => <Kpi key={k.id} {...k} />)}
      </div>

      {/* Two-column charts */}
      <div className="grid-2">
        <DisputeVsAuthChart data={d.monthly} />
        <SettledAuthBarChart data={d.weekly} />
      </div>

      <div className="grid-2">
        <TopCategoryDonut data={d.categories} />
        <RecentDisputesPanel data={d.recentDisputes} navigate={navigate} />
      </div>
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────
function Kpi({ label, value, unit, delta, dir, icon, tone, help }) {
  const isUp = dir === 'up';
  return (
    <div className="kpi">
      <div className={`kpi-icon --${tone}`}>
        <Icon name={icon} className="ico" />
      </div>
      <div className="kpi-body">
        <div className="kpi-label">
          {label}
          {help && <Icon name="help-circle" className="help" size={12} />}
        </div>
        <div className="kpi-value">
          {value}
          {unit && <span className="unit">{unit}</span>}
        </div>
        <div className={`kpi-trend${isUp ? '' : ' --down'}`}>
          <Icon name={isUp ? 'trending-up' : 'trending-down'} size={11} />
          {delta}
          <span className="sub">vs last week</span>
        </div>
      </div>
    </div>
  );
}

// ── Dispute Count vs Settled Auth Count (double bar chart) ───
function DisputeVsAuthChart({ data }) {
  const max = 240;
  const yTicks = [0, 200, 400, 600, 800, 1000];
  return (
    <div className="card chart-card">
      <div className="chart-card-head">
        <h3>Dispute Count VS Settled Auth Count</h3>
        <FilterSelect />
      </div>
      <div className="chart-area">
        <div className="chart-y-axis">
          {yTicks.map(t => <div key={t}>{t}</div>)}
        </div>
        <div className="chart-grid">
          {yTicks.map((t,i) => <div key={i} />)}
        </div>
        <div className="chart-bars">
          {data.map((m, i) => (
            <div key={i} className="chart-bargroup">
              <div className="chart-bar"
                   style={{ height: `${(m.settled / max) * 100}%`, background: 'var(--fta-primary-6)' }}
                   title={`${m.m}: ${m.settled} settled`}/>
              <div className="chart-bar"
                   style={{ height: `${(m.dispute / max) * 100}%`, background: 'var(--fta-secondary-5)' }}
                   title={`${m.m}: ${m.dispute} disputed`}/>
            </div>
          ))}
        </div>
        <div className="chart-x-axis">
          {data.map((m, i) => <div key={i}>{m.m}</div>)}
        </div>
      </div>
      <div className="chart-legend">
        <span className="item"><span className="dot" style={{ background: 'var(--fta-primary-6)' }}/>Settled Auth Count</span>
        <span className="item"><span className="dot" style={{ background: 'var(--fta-secondary-5)' }}/>Dispute Count</span>
      </div>
    </div>
  );
}

// ── Settled Auth Amount (single bar chart with $ labels above) ──
function SettledAuthBarChart({ data }) {
  const max = 900;
  const yTicks = [0, 200, 400, 600, 800, 1000];
  return (
    <div className="card chart-card">
      <div className="chart-card-head">
        <h3>Settled Auth Amount</h3>
        <FilterSelect />
      </div>
      <div className="chart-area" style={{ height: 280 }}>
        <div className="chart-y-axis">
          {yTicks.map(t => <div key={t}>{t === 0 ? '$0' : `$${t}`}</div>)}
        </div>
        <div className="chart-grid">
          {yTicks.map((t,i) => <div key={i} />)}
        </div>
        <div className="chart-bars">
          {data.map((d, i) => (
            <div key={i} className="chart-bargroup" style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 11, color: 'var(--fta-text-5)', marginBottom: 4, fontWeight: 500 }}>${d.v.toFixed(2)}</div>
                <div className="chart-bar"
                     style={{ width: 32, height: `${(d.v / max) * 100}%`, background: 'var(--fta-primary-6)', borderRadius: '3px 3px 0 0' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="chart-x-axis">
          {data.map((d, i) => <div key={i}>{d.d}</div>)}
        </div>
      </div>
    </div>
  );
}

// ── Top 10 Category — donut + legend ──
function TopCategoryDonut({ data }) {
  // build conic-gradient
  const total = data.reduce((s, c) => s + c.pct, 0);
  let acc = 0;
  const stops = data.map(c => {
    const start = (acc / total) * 360;
    acc += c.pct;
    const end = (acc / total) * 360;
    return `${c.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="card chart-card" style={{ minHeight: 320 }}>
      <div className="chart-card-head">
        <h3>Top 10 Transaction Category</h3>
        <FilterSelect />
      </div>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', padding: '8px 0' }}>
        <div className="donut">
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: `conic-gradient(${stops})`,
            position: 'relative',
            WebkitMask: 'radial-gradient(circle, transparent 50%, black 51%)',
            mask: 'radial-gradient(circle, transparent 50%, black 51%)',
          }} />
        </div>
        <div className="legend">
          {data.slice(0, 7).map(c => (
            <div key={c.name} className="legend-item">
              <span className="swatch" style={{ background: c.color }} />
              <span className="name">{c.name}</span>
              <span className="val">{c.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="pct">{c.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Recent Disputes panel ────
function RecentDisputesPanel({ data, navigate }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Recent Disputes</h3>
          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 2 }}>Last 7 days</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('disputes')}>
          View All <Icon name="chev-right" size={12} />
        </button>
      </div>
      <table className="table" style={{ marginTop: -4 }}>
        <thead>
          <tr>
            <th>Card Holder</th>
            <th>Card No.</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Dispute Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ColorAvatar name={r.holder} size="sm" />
                  <span>{r.holder}</span>
                </div>
              </td>
              <td className="mono">{r.card}</td>
              <td><StatusPill status={r.status} /></td>
              <td style={{ textAlign: 'right' }}>${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// helpers — initials() is provided by shell.jsx on window
function FilterSelect({ value = 'Last 12 months' }) {
  return (
    <div className="select" style={{ width: 160 }}>
      <select defaultValue={value}>
        <option>Last 12 months</option>
        <option>Last 30 days</option>
        <option>Last 7 days</option>
        <option>Year-to-date</option>
      </select>
    </div>
  );
}

Object.assign(window, { DashboardView });
