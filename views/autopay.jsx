/* global React, Icon, StatusPill, ColorAvatar, AppData, initials, FilterField, Pager, Field */
// views/autopay.jsx — Flow 4: Autopay Policy & Management
// Tabs: Policy · Enrollment · Execution Monitoring

const { useState: useStateAuto } = React;

function fmtMoney(n) {
  return '$ ' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AutopayView({ route, navigate }) {
  switch (route) {
    case 'autopay-enrollment': return <AutopayEnrollment navigate={navigate} />;
    case 'autopay-monitoring': return <AutopayMonitoring navigate={navigate} />;
    default:                   return <AutopayPolicy navigate={navigate} />;
  }
}

// ── 4.1 Program-Level Autopay Policy ──────────────────────────
function AutopayPolicy() {
  const p = AppData.autopay.policy;
  const [modes, setModes] = useStateAuto(p.modes);
  const [timing, setTiming] = useStateAuto(p.timing);
  const [reminder, setReminder] = useStateAuto(p.reminder);
  const [channels, setChannels] = useStateAuto(p.channels);

  function toggleMode(id) {
    setModes(ms => ms.map(m => m.id === id && !m.locked ? { ...m, enabled: !m.enabled } : m));
  }

  return (
    <div className="content-inner fade-in" data-screen-label="Autopay Policy">
      <div className="page-header">
        <div>
          <h1 className="page-title">Autopay Policy</h1>
          <div className="page-subtitle">Program-level autopay rules · Neo Banking Rewards · Inherited by all cardholders</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">Discard</button>
          <button className="btn btn-primary"><Icon name="check" size={14} />Save Policy</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Allowed modes */}
          <div className="card">
            <div className="card-section-title">Allowed Autopay Modes</div>
            <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginTop: -8, marginBottom: 14 }}>
              At least one mode must be enabled. Cardholders choose from the enabled modes during enrollment.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {modes.map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  border: '1px solid var(--fta-line-3)', borderRadius: 6, padding: '14px 16px',
                  background: m.enabled ? 'var(--fta-primary-1)' : 'var(--fta-bg-1)',
                  borderColor: m.enabled ? 'var(--fta-primary-3)' : 'var(--fta-line-3)',
                }}>
                  <Toggle on={m.enabled} disabled={m.locked} onClick={() => toggleMode(m.id)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.label}
                      {m.locked && <span className="pill --info"><Icon name="lock" size={10} />Required</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 2 }}>{m.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution timing */}
          <div className="card">
            <div className="card-section-title">Execution Timing</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="field">
                <span className="field-label">Execute</span>
                <div className="select" style={{ marginTop: 4 }}>
                  <select value={timing} onChange={e => setTiming(e.target.value)}>
                    <option value="due">On due date</option>
                    <option value="before">N days before due date</option>
                  </select>
                </div>
              </div>
              <Field label="Days before due date" value={timing === 'before' ? String(p.offsetDays) : '—'} editable={timing === 'before'} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Cutoff Time for Same-Day Initiation" value={p.cutoff} editable />
              <Field label="Time Zone" value={p.timezone} editable />
            </div>
            <Field label="Non-Business-Day Handling" value={p.nonBusinessDay} />
          </div>

          {/* Retry policy (locked) */}
          <div className="card" style={{ background: 'var(--fta-fill-2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--fta-bg-1)', border: '1px solid var(--fta-line-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fta-text-4)', flexShrink: 0 }}>
                <Icon name="lock" size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Retry Policy — No Automatic Retries</div>
                <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginTop: 4, maxWidth: 640 }}>
                  Autopay never auto-retries a failed payment. Re-enabling requires explicit cardholder action.
                  This is a hard product principle that protects consumers from cascading NSF fees — it is not admin-configurable.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders sidebar */}
        <div className="card">
          <div className="card-section-title">Reminder Notifications</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14 }}>Send pre-execution reminder</span>
            <Toggle on={reminder} onClick={() => setReminder(r => !r)} />
          </div>
          <Field label="Days in Advance" value={reminder ? String(p.reminderDays) : '—'} editable={reminder} />
          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', margin: '16px 0 8px' }}>Notification Channels</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['email', 'Email'], ['sms', 'SMS'], ['push', 'Push']].map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                <Checkbox on={channels[k]} onClick={() => setChannels(c => ({ ...c, [k]: !c[k] }))} />
                {label}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--fta-line-3)', fontSize: 12, color: 'var(--fta-text-3)' }}>
            Channels inherit the program notification preferences. CFPB enrollment consent occurs on the cardholder side.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4.2 Enrollment Visibility ─────────────────────────────────
function AutopayEnrollment({ navigate }) {
  const e = AppData.autopay.enrollment;
  const enrollPct = Math.round((e.totalEnrolled / e.totalAccounts) * 100);

  return (
    <div className="content-inner fade-in" data-screen-label="Autopay Enrollment">
      <div className="page-header">
        <div>
          <h1 className="page-title">Autopay Enrollment</h1>
          <div className="page-subtitle">Enrollment distribution and per-account drill-down · As of 06/01/2026</div>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
      </div>

      <div className="grid-3">
        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>Accounts Enrolled</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>{e.totalEnrolled.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 2 }}>{enrollPct}% of {e.totalAccounts.toLocaleString()} accounts</div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--fta-fill-3)', marginTop: 12, overflow: 'hidden' }}>
            <div style={{ width: enrollPct + '%', height: '100%', background: 'var(--fta-primary-6)' }} />
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 12 }}>Distribution by Mode</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {e.modeDist.map(m => (
              <div key={m.mode}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>{m.mode}</span>
                  <span className="muted">{m.count.toLocaleString()} · {m.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--fta-fill-3)', overflow: 'hidden' }}>
                  <div style={{ width: m.pct + '%', height: '100%', background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 12 }}>Funding Source Health</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {e.fundingHealth.map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusPill status={f.label === 'Verified' ? 'Active' : f.label === 'Unverified' ? 'Under Review' : 'Declined'} />
                <span style={{ fontSize: 13 }}>{f.count.toLocaleString()} <span className="muted">· {f.pct}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Enrolled Accounts <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({e.accounts.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 280 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search account, name" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Mode</th>
              <th>Fixed Amount</th>
              <th>Funding Source</th>
              <th>Next Run</th>
              <th style={{ textAlign: 'right' }}>Projected</th>
              <th>Last Outcome</th>
              <th style={{ textAlign: 'right' }}>Days Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {e.accounts.map(a => (
              <tr key={a.acct} className="--clickable" onClick={() => navigate('customer-detail', a.acct)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColorAvatar name={a.name} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{a.name}</div>
                      <div className="mono muted" style={{ fontSize: 11 }}>{a.acct}</div>
                    </div>
                  </div>
                </td>
                <td>{a.mode}</td>
                <td>{a.fixed}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className="mono" style={{ fontSize: 12 }}>{a.funding}</span>
                    <FundingDot verify={a.verify} />
                  </span>
                </td>
                <td className="muted">{a.next}</td>
                <td style={{ textAlign: 'right' }}>{fmtMoney(a.projected)}</td>
                <td><StatusPill status={a.last} /></td>
                <td style={{ textAlign: 'right' }}>{a.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>Total {e.totalEnrolled.toLocaleString()} enrolled accounts</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

// ── 4.5 Execution Monitoring Dashboard ────────────────────────
function AutopayMonitoring({ navigate }) {
  const m = AppData.autopay.monitoring;
  const t = m.today;

  return (
    <div className="content-inner fade-in" data-screen-label="Autopay Execution Monitoring">
      <div className="page-header">
        <div>
          <h1 className="page-title">Execution Monitoring</h1>
          <div className="page-subtitle">Today's autopay runs · As of 06/01/2026 09:42 ET</div>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={14} />Export Log</button>
      </div>

      <div className="grid-4">
        <RunStat label="Scheduled" value={t.scheduled} icon="calendar" tone="navy" />
        <RunStat label="Processing" value={t.processing} icon="arrow-leftright" tone="blue" />
        <RunStat label="Posted" value={t.posted} icon="check" tone="green" />
        <RunStat label="Failed" value={t.failed} icon="x" tone="pink" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'flex-start' }}>
        {/* Runs table */}
        <div className="card" style={{ padding: 0 }}>
          <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
            <h2>Run Detail</h2>
            <div className="right">
              <div className="select" style={{ width: 150 }}>
                <select defaultValue="All"><option>All</option><option>Posted</option><option>Failed</option><option>Processing</option><option>Scheduled</option></select>
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Account</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Funding</th>
                <th>Sched.</th>
                <th>Done</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {m.runs.map(r => (
                <tr key={r.acct + r.sched}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ColorAvatar name={r.name} size="sm" />
                      <span>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmtMoney(r.amount)}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.funding}</td>
                  <td className="muted">{r.sched}</td>
                  <td className="muted">{r.done}</td>
                  <td>
                    <StatusPill status={r.status} />
                    {r.reason && <div style={{ fontSize: 11, color: 'var(--fta-destructive)', marginTop: 2 }}>{r.reason}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Failure breakdown + alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-section-title">Failures by Reason</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {m.failBreakdown.map(f => (
                <div key={f.reason} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <span>{f.reason} <span className="mono muted" style={{ fontSize: 11 }}>{f.code}</span></span>
                  <span style={{ fontWeight: 600 }}>{f.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Alerts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {m.alerts.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 6,
                  background: a.kind === 'danger' ? '#FFF1F0' : a.kind === 'warning' ? '#FFF8E8' : 'var(--fta-primary-1)',
                }}>
                  <div style={{ color: a.kind === 'danger' ? 'var(--fta-destructive)' : a.kind === 'warning' ? 'var(--fta-warning)' : 'var(--fta-primary-6)', flexShrink: 0, marginTop: 1 }}>
                    <Icon name={a.kind === 'info' ? 'bell' : 'shield'} size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2 }}>{a.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── small shared controls ─────────────────────────────────────
function Toggle({ on, onClick, disabled }) {
  return (
    <label className="toggle" title={disabled ? 'Required — cannot be changed' : (on ? 'Enabled' : 'Disabled')}>
      <input type="checkbox" checked={!!on} disabled={!!disabled} onChange={disabled ? undefined : onClick} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}

function Checkbox({ on, onClick }) {
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

function FundingDot({ verify }) {
  const tone = verify === 'Verified' ? '#00B42A' : verify === 'Unverified' ? '#FF7D00' : '#F53F3F';
  return <span title={verify} style={{ width: 7, height: 7, borderRadius: 999, background: tone, display: 'inline-block' }} />;
}

function RunStat({ label, value, icon, tone }) {
  return (
    <div className="kpi">
      <div className={`kpi-icon --${tone}`}><Icon name={icon} className="ico" /></div>
      <div className="kpi-body">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value" style={{ marginTop: 2 }}>{value.toLocaleString()}</div>
      </div>
    </div>
  );
}

Object.assign(window, { AutopayView, Toggle, Checkbox, fmtMoney });
