import React, { useState } from 'react';
import { Icon, StatusPill } from '../components/Shell';
import { FilterField, SmallStat, Toggle, Checkbox, fmtMoney } from '../components/shared';
import AppData from '../data/AppData';

export default function SpendView({ route, navigate }) {
  if (route === 'spend-groups') return <MccGroups navigate={navigate} />;
  if (route === 'spend-sim') return <Simulation navigate={navigate} />;
  return <SpendRules navigate={navigate} />;
}

function SpendRules({ navigate }) {
  const rules = AppData.spend.rules;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [type, setType] = useState('All Types');

  const filtered = rules.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'All Status' || r.status === status;
    const matchType = type === 'All Types' || r.type === type;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Spend Rules</h1>
          <div className="page-subtitle">Velocity controls, authorization limits, and MCC restrictions</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('spend-groups')}>MCC Groups</button>
          <button className="btn btn-ghost" onClick={() => navigate('spend-sim')}>Simulate</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} />Create Rule</button>
        </div>
      </div>

      <div className="grid-4">
        <SmallStat label="Active Rules" value={rules.filter(r => r.status === 'Active').length} icon="shield" tone="green" />
        <SmallStat label="Paused Rules" value={rules.filter(r => r.status === 'Paused').length} icon="eye" tone="peach" />
        <SmallStat label="Draft Rules" value={rules.filter(r => r.status === 'Draft').length} icon="file" tone="navy" />
        <SmallStat label="Compliance Required" value={rules.filter(r => r.compliance).length} icon="circle" tone="navy" />
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 160 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>All Status</option><option>Active</option><option>Paused</option><option>Draft</option>
            </select>
          </FilterField>
          <FilterField label="Type" style={{ width: 200 }}>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>All Types</option>
              {[...new Set(rules.map(r => r.type))].map(t => <option key={t}>{t}</option>)}
            </select>
          </FilterField>
          <FilterField label="Scope" style={{ width: 160 }}>
            <select><option>All</option><option>Program</option><option>Sub-Program</option><option>Card</option></select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatus('All Status'); setType('All Types'); }}>Reset</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Rules <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 300 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search rules" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Rule Name</th><th>Scope</th><th>Type</th><th>Detail</th><th>Impact</th>
              <th>Effective</th><th>Compliance</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td><span className="pill --info">{r.scope}</span></td>
                <td><span style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{r.type}</span></td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{r.detail}</td>
                <td>
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: r.impact === 'High' ? 'var(--fta-error)' : r.impact === 'Medium' ? 'var(--fta-warning)' : 'var(--fta-text-4)'
                  }}>{r.impact}</span>
                </td>
                <td className="muted">{r.effective}</td>
                <td>{r.compliance ? <span className="pill --warning">Required</span> : <span style={{ color: 'var(--fta-text-3)', fontSize: 12 }}>—</span>}</td>
                <td><StatusPill status={r.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-ghost">Edit</button>
                    <button className="btn btn-sm btn-ghost">{r.status === 'Active' ? 'Pause' : 'Activate'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {filtered.length} items</span></div>
      </div>
    </div>
  );
}

function MccGroups({ navigate }) {
  const groups = AppData.spend.mccGroups;

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">MCC Groups</h1>
          <div className="page-subtitle">Merchant Category Code groupings used in spend rules</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('spend-rules')}>Spend Rules</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} />Create Group</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {groups.map(g => (
          <div key={g.name} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{g.count} codes</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: g.risk === 'High' ? '#FEF3F2' : g.risk === 'Medium' ? '#FFFAEB' : '#F0FDF4',
                color: g.risk === 'High' ? '#B42318' : g.risk === 'Medium' ? '#B54708' : '#067647',
              }}>{g.risk} Risk</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
              {g.codes.slice(0, 6).map(c => (
                <span key={c} className="mono" style={{ fontSize: 11, padding: '2px 6px', background: 'var(--fta-fill-2)', borderRadius: 4 }}>{c}</span>
              ))}
              {g.codes.length > 6 && <span style={{ fontSize: 11, color: 'var(--fta-text-4)', padding: '2px 6px' }}>+{g.codes.length - 6} more</span>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sm btn-ghost">Edit</button>
              <button className="btn btn-sm btn-ghost">Use in Rule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Simulation({ navigate }) {
  const [amount, setAmount] = useState('250');
  const [mcc, setMcc] = useState('5912');
  const [merchant, setMerchant] = useState('CVS Pharmacy');
  const [ran, setRan] = useState(false);
  const [result, setResult] = useState(null);

  function runSim() {
    setRan(true);
    setResult({
      decision: 'Approved',
      rulesChecked: 8,
      rulesTriggerred: 1,
      triggeredRule: 'Daily transaction limit',
      remainingDailyLimit: 750,
    });
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Spend Rule Simulator</h1>
          <div className="page-subtitle">Test authorization decisions against active spend rules</div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('spend-rules')}>Back to Rules</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 16, alignItems: 'flex-start' }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Transaction Input</div>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Transaction Amount</div>
            <div className="input"><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Merchant MCC</div>
            <div className="input"><input value={mcc} onChange={e => setMcc(e.target.value)} placeholder="e.g. 5912" /></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Merchant Name</div>
            <div className="input"><input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="Merchant name" /></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Sub-Program</div>
            <div className="select"><select><option>{AppData.subPrograms[0].name}</option>{AppData.subPrograms.slice(1).map(s => <option key={s.id}>{s.name}</option>)}</select></div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="field-label">Card</div>
            <div className="select"><select><option>·· 4821 (Virtual, Visa)</option><option>·· 9043 (Physical, MC)</option></select></div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={runSim}>
            <Icon name="circle" size={14} />Run Simulation
          </button>
        </div>

        <div>
          {!ran && (
            <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--fta-text-3)' }}>
              <Icon name="shield" size={32} />
              <div style={{ marginTop: 12, fontSize: 14 }}>Enter transaction details and click Run Simulation</div>
            </div>
          )}
          {ran && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: result.decision === 'Approved' ? '#ECFDF3' : '#FEF3F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={result.decision === 'Approved' ? 'check' : 'x'} size={24}
                      style={{ color: result.decision === 'Approved' ? '#12B76A' : '#F04438' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: result.decision === 'Approved' ? '#067647' : '#B42318' }}>{result.decision}</div>
                    <div style={{ fontSize: 13, color: 'var(--fta-text-4)' }}>Transaction for {fmtMoney(parseFloat(amount))} at {merchant}</div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Rule Evaluation ({result.rulesChecked} checked)</div>
                {AppData.spend.rules.filter(r => r.status === 'Active').map((r, i) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--fta-line-3)' }}>
                    <span style={{ fontSize: 13 }}>{r.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: r.name === result.triggeredRule ? 'var(--fta-warning)' : '#12B76A' }}>
                      {r.name === result.triggeredRule ? 'Triggered (within limit)' : 'Pass'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
