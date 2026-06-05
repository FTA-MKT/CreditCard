/* global React, Icon, StatusPill, AppData, FilterField, Pager, Field, Toggle, Checkbox, fmtMoney */
// views/spend.jsx — Flow 7: Spend Controls
// Tabs: Rules (+ create) · MCC Groups · Simulation

const { useState: useStateSpend } = React;

function SpendView({ route, navigate }) {
  switch (route) {
    case 'spend-groups': return <MccGroups navigate={navigate} />;
    case 'spend-sim':    return <Simulation navigate={navigate} />;
    default:             return <SpendRules navigate={navigate} />;
  }
}

const TYPE_ICON = { MCC: 'list', Geo: 'box', Limit: 'shield', Velocity: 'chart', 'Cash Advance': 'card' };
const SCOPE_TONE = { Program: 'navy', Account: 'blue', Card: 'peach' };

// ── 4.1 / 4.7 Rule list + hierarchy ───────────────────────────
function SpendRules({ navigate }) {
  const [scope, setScope] = useStateSpend('All Scopes');
  const [type, setType] = useStateSpend('All Types');
  const [createOpen, setCreateOpen] = useStateSpend(false);
  const all = AppData.spend.rules;
  const filtered = all.filter(r => (scope === 'All Scopes' || r.scope === scope) && (type === 'All Types' || r.type === type));

  return (
    <div className="content-inner fade-in" data-screen-label="Spend Rules">
      <div className="page-header">
        <div>
          <h1 className="page-title">Spend Controls</h1>
          <div className="page-subtitle">Deterministic rules evaluated at authorization time · Neo Banking Rewards</div>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}><Icon name="plus" size={14} />Create Rule</button>
      </div>

      {/* Layering hierarchy explainer */}
      <div className="card">
        <div className="card-section-title">Rule Layering Hierarchy</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
          {[
            { lvl: 'Card', tone: 'peach', note: 'Most specific — overrides all below' },
            { lvl: 'Account', tone: 'blue', note: 'Overrides program' },
            { lvl: 'Program', tone: 'navy', note: 'Broadest — applies to all accounts' },
          ].map((h, i, arr) => (
            <React.Fragment key={h.lvl}>
              <div style={{ flex: 1, minWidth: 180, border: '1px solid var(--fta-line-3)', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`kpi-icon --${h.tone}`} style={{ width: 28, height: 28, borderRadius: 6 }}><Icon name="shield" size={14} className="ico" /></span>
                  <span style={{ fontWeight: 600 }}>{h.lvl} Level</span>
                  <span className="muted-2" style={{ fontSize: 12 }}>· evaluated {i + 1}{['st', 'nd', 'rd'][i]}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{h.note}</div>
              </div>
              {i < arr.length - 1 && <div style={{ padding: '0 14px', color: 'var(--fta-text-3)' }}><Icon name="chev-right" size={16} /></div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="lock" size={12} />
          Compliance-mandated denies (e.g., OFAC) at a higher level cannot be unblocked at a lower level.
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Scope" style={{ width: 160 }}>
            <select value={scope} onChange={e => setScope(e.target.value)}>
              <option>All Scopes</option><option>Program</option><option>Account</option><option>Card</option>
            </select>
          </FilterField>
          <FilterField label="Rule Type" style={{ width: 160 }}>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>All Types</option><option>MCC</option><option>Geo</option><option>Limit</option><option>Velocity</option><option>Cash Advance</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <div className="input" style={{ width: 280 }}>
            <Icon name="search" className="ico" />
            <input placeholder="Search rule name" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Active Rules <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Scope</th>
              <th>Type</th>
              <th>Configuration</th>
              <th style={{ textAlign: 'right' }}>Impact</th>
              <th>Effective</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500 }}>{r.name}</span>
                    {r.compliance && <span className="pill --info"><Icon name="lock" size={10} />Compliance</span>}
                  </div>
                  <div className="mono muted" style={{ fontSize: 11 }}>{r.id}</div>
                </td>
                <td><span className={"pill --" + (r.scope === 'Program' ? 'info' : r.scope === 'Account' ? 'success' : 'warning')}>{r.scope}</span></td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name={TYPE_ICON[r.type]} size={14} style={{ color: 'var(--fta-text-4)' }} />
                    {r.type}
                  </span>
                </td>
                <td className="muted" style={{ fontSize: 12 }}>{r.detail}</td>
                <td style={{ textAlign: 'right' }}>{r.impact.toLocaleString()} <span className="muted" style={{ fontSize: 11 }}>{r.impact > 1 ? 'cards' : 'card'}</span></td>
                <td className="muted">{r.effective}</td>
                <td><StatusPill status={r.status === 'Draft' ? 'Pending' : 'Active'} /></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>Total {filtered.length} rules · changes take effect on next authorization, not retroactively</span>
          <Pager />
        </div>
      </div>

      {createOpen && <CreateRuleDrawer onClose={() => setCreateOpen(false)} />}
    </div>
  );
}

// ── 4.7 Rule authoring drawer ─────────────────────────────────
function CreateRuleDrawer({ onClose }) {
  const [step, setStep] = useStateSpend(1);
  const [ruleScope, setRuleScope] = useStateSpend('Program');
  const [ruleType, setRuleType] = useStateSpend('Limit');
  const impactByScope = { Program: '8,421 cards', Account: '1 account · 6 cards', Card: '1 card' };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Create Spend Rule</div>
            <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>Step {step} of 3</div>
          </div>
          <button className="topbar-action" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="drawer-body">
          {step === 1 && (
            <>
              <div className="card-section-title">Select Scope</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {['Program', 'Account', 'Card'].map(s => (
                  <RadioCard key={s} selected={ruleScope === s} onClick={() => setRuleScope(s)}
                    title={s + ' Level'}
                    sub={s === 'Program' ? 'Applies to all accounts in the program' : s === 'Account' ? 'Applies to one account and its cards' : 'Applies to a single card'} />
                ))}
              </div>
              <div className="card-section-title">Rule Type</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['MCC', 'Geo', 'Limit', 'Velocity', 'Cash Advance'].map(t => (
                  <button key={t} onClick={() => setRuleType(t)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 6, cursor: 'pointer',
                    border: '1px solid ' + (ruleType === t ? 'var(--fta-primary-6)' : 'var(--fta-line-3)'),
                    background: ruleType === t ? 'var(--fta-primary-1)' : 'var(--fta-bg-1)',
                    color: ruleType === t ? 'var(--fta-primary-6)' : 'var(--fta-text-5)', fontWeight: 500, fontSize: 13,
                  }}>
                    <Icon name={TYPE_ICON[t]} size={16} />{t}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="card-section-title">Configure {ruleType} Rule</div>
              {ruleType === 'Limit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field"><span className="field-label">Limit Type</span><div className="select" style={{ marginTop: 4 }}><select><option>Monthly spend ceiling</option><option>Per-transaction maximum</option><option>Daily spend ceiling</option><option>Weekly spend ceiling</option><option>Per-MCC-group ceiling</option></select></div></div>
                  <div className="field"><span className="field-label">Amount (USD)</span><input placeholder="25,000.00" /></div>
                  <div className="field"><span className="field-label">Effective Date</span><input placeholder="Immediate" /></div>
                </div>
              )}
              {ruleType !== 'Limit' && (
                <div style={{ fontSize: 13, color: 'var(--fta-text-4)', padding: '20px', textAlign: 'center', border: '1px dashed var(--fta-line-3)', borderRadius: 8 }}>
                  Parameter form for <strong>{ruleType}</strong> rules (allow/deny lists, regions, thresholds, or cash-advance toggles) renders here.
                </div>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <div className="card-section-title">Preview Impact</div>
              <div className="card" style={{ background: 'var(--fta-primary-1)', borderColor: 'var(--fta-primary-3)', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--fta-text-4)' }}>This rule will apply to</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--fta-primary-6)', marginTop: 4 }}>{impactByScope[ruleScope]}</div>
              </div>
              <div className="grid-2">
                <Field label="Scope" value={ruleScope + ' Level'} />
                <Field label="Type" value={ruleType} />
              </div>
            </>
          )}
        </div>
        <div className="drawer-foot">
          {step > 1 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < 3 && <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue</button>}
          {step === 3 && (
            <>
              <button className="btn btn-ghost" onClick={onClose}>Save as Draft</button>
              <button className="btn btn-primary" onClick={onClose}>Activate Rule</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function RadioCard({ selected, onClick, title, sub }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 6, textAlign: 'left', width: '100%',
      border: '1px solid ' + (selected ? 'var(--fta-primary-6)' : 'var(--fta-line-3)'),
      background: selected ? 'var(--fta-primary-1)' : 'var(--fta-bg-1)', cursor: 'pointer',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 999, flexShrink: 0,
        border: '1.5px solid ' + (selected ? 'var(--fta-primary-6)' : 'var(--fta-line-4)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--fta-primary-6)' }} />}
      </span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{sub}</div>
      </div>
    </button>
  );
}

// ── 4.2 MCC Groups ────────────────────────────────────────────
function MccGroups() {
  const groups = AppData.spend.mccGroups;
  return (
    <div className="content-inner fade-in" data-screen-label="MCC Groups">
      <div className="page-header">
        <div>
          <h1 className="page-title">MCC Groups</h1>
          <div className="page-subtitle">Named merchant-category groups for easier rule authoring · Membership is versioned</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14} />New Group</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {groups.map(g => (
          <div key={g.name} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`kpi-icon --${g.risk === 'high' ? 'pink' : 'green'}`} style={{ width: 36, height: 36 }}>
                  <Icon name={g.risk === 'high' ? 'shield' : 'list'} size={18} className="ico" />
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{g.count} MCC codes</div>
                </div>
              </div>
              {g.risk === 'high' && <span className="pill --danger"><span className="dot" />High risk</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fta-text-4)', fontFamily: 'ui-monospace, monospace', background: 'var(--fta-fill-2)', borderRadius: 6, padding: '8px 10px', marginBottom: 12 }}>{g.codes}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-ghost" style={{ flex: 1 }}>Edit Members</button>
              <button className="btn btn-sm btn-ghost">History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4.8 Rule Preview & Simulation ─────────────────────────────
function Simulation() {
  const [amount, setAmount] = useStateSpend('700.00');
  const [mcc, setMcc] = useStateSpend('Dining');
  const [country, setCountry] = useStateSpend('United States');
  const [ran, setRan] = useStateSpend(true);

  // deterministic mock result based on inputs
  const result = (() => {
    if (['Cuba', 'Iran', 'North Korea', 'Russia'].includes(country)) return { ok: false, code: 'GEO_RESTRICTED', label: 'Transaction outside permitted region', rule: 'OFAC sanctioned countries (Program · Geo)' };
    if (mcc === 'Gambling' || mcc === 'Crypto') return { ok: false, code: 'MCC_BLOCKED', label: 'Merchant category not permitted', rule: 'High-risk MCC deny list (Program · MCC)' };
    if (mcc === 'Dining' && parseFloat(amount) > 500) return { ok: false, code: 'LIMIT_EXCEEDED_MONTHLY', label: 'Monthly spend limit exceeded', rule: 'Dining category cap — $500/mo (Card · Limit)' };
    return { ok: true };
  })();

  return (
    <div className="content-inner fade-in" data-screen-label="Spend Simulation">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rule Simulation</h1>
          <div className="page-subtitle">Test a sample transaction against current rules before activating changes</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-section-title">Sample Transaction</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="field"><span className="field-label">Amount (USD)</span><input value={amount} onChange={e => { setAmount(e.target.value); setRan(false); }} /></div>
            <div className="field"><span className="field-label">Merchant Category</span>
              <div className="select" style={{ marginTop: 4 }}>
                <select value={mcc} onChange={e => { setMcc(e.target.value); setRan(false); }}>
                  <option>Dining</option><option>Travel</option><option>Groceries</option><option>Fuel</option><option>Gambling</option><option>Crypto</option>
                </select>
              </div>
            </div>
            <div className="field"><span className="field-label">Country</span>
              <div className="select" style={{ marginTop: 4 }}>
                <select value={country} onChange={e => { setCountry(e.target.value); setRan(false); }}>
                  <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Russia</option><option>Iran</option><option>Cuba</option>
                </select>
              </div>
            </div>
            <div className="field"><span className="field-label">Account</span><div className="field-value">C-100005 · Cameron Williamson</div></div>
            <button className="btn btn-primary" onClick={() => setRan(true)} style={{ marginTop: 4 }}><Icon name="shield" size={14} />Run Simulation</button>
          </div>
        </div>

        <div className="card">
          <div className="card-section-title">Result</div>
          {!ran ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fta-text-3)' }}>
              <Icon name="shield" size={28} />
              <div style={{ marginTop: 8 }}>Adjust inputs and run the simulation</div>
            </div>
          ) : result.ok ? (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: '#EFFFE8', color: '#00B42A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon name="check" size={28} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#00B42A' }}>Approved</div>
              <div style={{ fontSize: 13, color: 'var(--fta-text-4)', marginTop: 4 }}>No spend rule blocks this transaction under the current configuration.</div>
            </div>
          ) : (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: '#FFF1F0', color: 'var(--fta-destructive)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon name="x" size={28} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--fta-destructive)' }}>Declined</div>
              <div style={{ marginTop: 14, display: 'inline-flex', flexDirection: 'column', gap: 10, textAlign: 'left', background: 'var(--fta-fill-2)', borderRadius: 8, padding: '14px 18px' }}>
                <div><span className="field-label">Reason Code</span><div className="mono" style={{ fontWeight: 600 }}>{result.code}</div></div>
                <div><span className="field-label">Cardholder Message</span><div>{result.label}</div></div>
                <div><span className="field-label">Triggering Rule</span><div>{result.rule}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SpendView });
