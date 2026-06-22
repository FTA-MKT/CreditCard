import React, { useState } from 'react';
import { Icon, StatusPill } from '../components/Shell';
import { FilterField, SmallStat, Toggle, Checkbox, fmtMoney } from '../components/shared';
import AppData from '../data/AppData';

export default function AutopayView({ route, navigate }) {
  if (route === 'autopay-enrollment') return <AutopayEnrollment navigate={navigate} />;
  if (route === 'autopay-monitoring') return <AutopayMonitoring navigate={navigate} />;
  return <AutopayPolicy navigate={navigate} />;
}

function AutopayPolicy({ navigate }) {
  const p = AppData.autopay.policy;
  const [mode, setMode] = useState(p.modes.find(m => m.checked)?.id || 'minimum');
  const [reminder, setReminder] = useState(p.reminder);
  const [nonBiz, setNonBiz] = useState(p.nonBusinessDay);

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Autopay Policy</h1>
          <div className="page-subtitle">Global defaults applied to all enrollments unless overridden per account</div>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-section-title">Payment Mode Default</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {p.modes.map(m => (
              <label key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-section-title">Timing & Cut-off</div>
          <div style={{ marginBottom: 16 }}>
            <div className="field-label">Default Payment Timing</div>
            <div className="select">
              <select defaultValue={p.timing}>
                <option>On Due Date</option>
                <option>3 Days Before Due</option>
                <option>7 Days Before Due</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div className="field-label">Offset Days</div>
            <div className="input"><input type="number" defaultValue={p.offsetDays} min={0} max={30} /></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div className="field-label">Daily Cut-off Time</div>
            <div className="input"><input type="time" defaultValue={p.cutoff} /></div>
          </div>
          <div>
            <div className="field-label">Timezone</div>
            <div className="select">
              <select defaultValue={p.timezone}>
                <option>America/New_York (EST)</option>
                <option>America/Chicago (CST)</option>
                <option>America/Los_Angeles (PST)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-section-title">Non-Business Day Handling</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['process_before', 'process_after', 'process_same'].map(v => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="radio" name="nonbiz" value={v} checked={nonBiz === v} onChange={() => setNonBiz(v)} />
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {v === 'process_before' ? 'Process Business Day Before' : v === 'process_after' ? 'Process Business Day After' : 'Process Same Day Regardless'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>
                    {v === 'process_before' ? 'Debit the day before if due date falls on weekend/holiday' :
                     v === 'process_after' ? 'Debit the next business day' :
                     'Process regardless of weekends and holidays'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-section-title">Reminders & Notifications</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 500 }}>Enable Autopay Reminders</div>
              <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>Notify cardholders before autopay processes</div>
            </div>
            <Toggle checked={reminder} onChange={setReminder} />
          </div>
          {reminder && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div className="field-label">Days Before Due Date</div>
                <div className="input"><input type="number" defaultValue={p.reminderDays} min={1} max={14} /></div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Channels</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.channels.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <Checkbox checked={c.checked} onChange={() => {}} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AutopayEnrollment({ navigate }) {
  const e = AppData.autopay.enrollment;

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Autopay Enrollment</h1>
          <div className="page-subtitle">Cardholder enrollment status and funding source health</div>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
      </div>

      <div className="grid-4">
        <SmallStat label="Total Enrolled" value={e.totalEnrolled.toLocaleString()} icon="circle" tone="green" />
        <SmallStat label="Total Accounts" value={e.totalAccounts.toLocaleString()} icon="card" tone="navy" />
        <SmallStat label="Enrollment Rate" value={((e.totalEnrolled / e.totalAccounts) * 100).toFixed(1) + '%'} icon="trending-up" tone="navy" />
        <SmallStat label="Funding Issues" value={e.fundingHealth.filter(f => f.status !== 'Healthy').length} icon="shield" tone="peach" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Enrollment by Mode</div>
          {e.modeDist.map(m => (
            <div key={m.mode} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>{m.mode}</span>
                <span style={{ fontWeight: 600 }}>{m.count.toLocaleString()} <span style={{ color: 'var(--fta-text-4)', fontWeight: 400 }}>({m.pct}%)</span></span>
              </div>
              <div style={{ height: 8, background: 'var(--fta-fill-2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${m.pct}%`, background: 'var(--fta-primary-6)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Funding Source Health</div>
          {e.fundingHealth.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < e.fundingHealth.length - 1 ? '1px solid var(--fta-line-3)' : 'none' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{f.source}</div>
                <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{f.count.toLocaleString()} accounts</div>
              </div>
              <StatusPill status={f.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Enrolled Accounts</h2>
          <div className="right">
            <FilterField label="" style={{ width: 160 }}>
              <select><option>All Modes</option><option>Minimum Due</option><option>Statement Balance</option><option>Fixed Amount</option></select>
            </FilterField>
            <div className="input" style={{ width: 280 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by name, account ID" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>Account</th><th>Mode</th><th>Next Payment</th><th>Amount</th><th>Funding Source</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr>
          </thead>
          <tbody>
            {e.accounts.map(a => (
              <tr key={a.id}>
                <td><div style={{ fontWeight: 500 }}>{a.name}</div><div className="mono muted" style={{ fontSize: 11 }}>{a.id}</div></td>
                <td>{a.mode}</td>
                <td className="muted">{a.nextPayment}</td>
                <td style={{ fontWeight: 500 }}>{fmtMoney(a.amount)}</td>
                <td><Icon name="bank" size={13} style={{ marginRight: 6, color: 'var(--fta-text-4)' }} />{a.fundingSource}</td>
                <td><StatusPill status={a.status} /></td>
                <td style={{ textAlign: 'right' }}><button className="btn btn-sm btn-ghost">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {e.accounts.length} items</span><Pager /></div>
      </div>
    </div>
  );
}

function Pager() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button className="btn btn-sm btn-ghost" style={{ padding: '4px 8px' }}><Icon name="chev-left" size={14} /></button>
      {[1,2,3].map(n => <button key={n} className={"btn btn-sm" + (n === 1 ? ' btn-primary' : ' btn-ghost')} style={{ padding: '4px 10px', minWidth: 32 }}>{n}</button>)}
      <button className="btn btn-sm btn-ghost" style={{ padding: '4px 8px' }}><Icon name="chev-right" size={14} /></button>
    </div>
  );
}

function RunStatBadge({ label, value, tone }) {
  const colors = { green: '#12B76A', red: '#F04438', yellow: '#F79009', gray: '#98A2B3' };
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: colors[tone] || colors.gray }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{label}</div>
    </div>
  );
}

function AutopayMonitoring({ navigate }) {
  const m = AppData.autopay.monitoring;

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Autopay Monitoring</h1>
          <div className="page-subtitle">Run history and failure diagnostics</div>
        </div>
        <button className="btn btn-primary"><Icon name="circle" size={14} />Trigger Manual Run</button>
      </div>

      <div className="grid-4">
        <SmallStat label="Today Processed" value={m.today.processed.toLocaleString()} icon="circle" tone="green" />
        <SmallStat label="Today Failed" value={m.today.failed} icon="shield" tone="peach" />
        <SmallStat label="Today Skipped" value={m.today.skipped} icon="eye" tone="navy" />
        <SmallStat label="Total Amount" value={fmtMoney(m.today.amount)} icon="card" tone="navy" />
      </div>

      {m.alerts.length > 0 && (
        <div className="card" style={{ borderLeft: '3px solid var(--fta-error)', padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icon name="shield" size={18} style={{ color: 'var(--fta-error)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Active Alerts ({m.alerts.length})</div>
              {m.alerts.map((a, i) => <div key={i} style={{ fontSize: 13, color: 'var(--fta-text-5)', marginBottom: 2 }}>• {a}</div>)}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 14 }}>Failure Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {m.failBreakdown.map(f => (
            <div key={f.reason} style={{ background: 'var(--fta-fill-2)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fta-error)' }}>{f.count}</div>
              <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2 }}>{f.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Run History</h2>
          <div className="right">
            <FilterField label="" style={{ width: 140 }}>
              <select><option>All Status</option><option>Completed</option><option>Partial</option><option>Failed</option></select>
            </FilterField>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>Run ID</th><th>Date</th><th>Time</th><th style={{ textAlign: 'right' }}>Processed</th><th style={{ textAlign: 'right' }}>Failed</th><th style={{ textAlign: 'right' }}>Amount</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr>
          </thead>
          <tbody>
            {m.runs.map(r => (
              <tr key={r.id}>
                <td className="mono muted">{r.id}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td style={{ textAlign: 'right' }}>{r.processed.toLocaleString()}</td>
                <td style={{ textAlign: 'right', color: r.failed > 0 ? 'var(--fta-error)' : undefined }}>{r.failed}</td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmtMoney(r.amount)}</td>
                <td><StatusPill status={r.status} /></td>
                <td style={{ textAlign: 'right' }}><button className="btn btn-sm btn-ghost">Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {m.runs.length} runs</span><Pager /></div>
      </div>
    </div>
  );
}
