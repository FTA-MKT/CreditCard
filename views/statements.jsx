/* global React, Icon, StatusPill, ColorAvatar, AppData, initials, FilterField, Pager, Field, fmtMoney */
// views/statements.jsx — Flow 6: Statement & Billing Management
// Tabs: Billing Summary · Statements (+ detail) · Payments

const { useState: useStateStmt } = React;

function StatementsView({ route, navigate, navParam }) {
  if (route === 'statement-detail' && navParam) {
    return <StatementDetail navigate={navigate} />;
  }
  switch (route) {
    case 'payments':        return <PaymentsView navigate={navigate} />;
    case 'statements':      return <StatementList navigate={navigate} />;
    default:                return <BillingSummary navigate={navigate} />;
  }
}

// ── 4.7 Billing Summary Metrics ───────────────────────────────
function BillingSummary() {
  const s = AppData.billing.summary;
  const maxFee = Math.max(...s.feeRevenue.map(f => f.cycle));

  return (
    <div className="content-inner fade-in" data-screen-label="Billing Summary">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing Summary</h1>
          <div className="page-subtitle">Program-wide billing metrics · Cycle May 2026 · As of 06/01/2026</div>
        </div>
        <div className="select" style={{ width: 160 }}>
          <select defaultValue="May 2026"><option>May 2026</option><option>Apr 2026</option><option>Mar 2026</option></select>
        </div>
      </div>

      <div className="grid-4">
        <BigStat label="Total Outstanding" value={s.outstanding} />
        <BigStat label="Billed This Cycle" value={s.billedThisCycle} />
        <BigStat label="Payments Received" value={s.paymentsReceived} />
        <BigStat label="Failed Payment Rate" value={s.failedRate} sub={'Late rate ' + s.lateRate} />
      </div>

      <div className="grid-2">
        {/* Fee revenue */}
        <div className="card">
          <div className="card-section-title">Fee Revenue by Type</div>
          <table className="table" style={{ fontSize: 13 }}>
            <thead>
              <tr><th>Fee Type</th><th style={{ textAlign: 'right' }}>This Cycle</th><th style={{ textAlign: 'right' }}>YTD</th><th style={{ width: 120 }}></th></tr>
            </thead>
            <tbody>
              {s.feeRevenue.map(f => (
                <tr key={f.type}>
                  <td>{f.type}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMoney(f.cycle)}</td>
                  <td style={{ textAlign: 'right' }} className="muted">{fmtMoney(f.ytd)}</td>
                  <td>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--fta-fill-3)', overflow: 'hidden' }}>
                      <div style={{ width: (f.cycle / maxFee * 100) + '%', height: '100%', background: 'var(--fta-primary-6)' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--fta-line-3)', fontSize: 13 }}>
            <span className="muted">Interest Revenue (Cycle / YTD)</span>
            <span style={{ fontWeight: 600 }}>{s.interestRevCycle} <span className="muted" style={{ fontWeight: 400 }}>/ {s.interestRevYtd}</span></span>
          </div>
        </div>

        {/* Delinquency aging */}
        <div className="card">
          <div className="card-section-title">Delinquent Accounts by Aging Bucket</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {s.aging.map(a => (
              <div key={a.bucket}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pill-status" style={{ gap: 6 }}>
                      <span className="dot" style={{ background: a.tone === 'danger' ? 'var(--fta-destructive)' : a.tone === 'warning' ? 'var(--fta-warning)' : 'var(--fta-primary-6)' }} />
                    </span>
                    {a.bucket}
                  </span>
                  <span><strong>{a.count}</strong> accounts <span className="muted">· {fmtMoney(a.amount)}</span></span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--fta-fill-3)', overflow: 'hidden' }}>
                  <div style={{ width: Math.min(100, a.count / 412 * 100) + '%', height: '100%', background: a.tone === 'danger' ? 'var(--fta-destructive)' : a.tone === 'warning' ? 'var(--fta-warning)' : 'var(--fta-primary-6)' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--fta-line-3)' }}>
            616 delinquent accounts · $ 576,500.00 past due across all buckets
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4.3 Statement List ────────────────────────────────────────
function StatementList({ navigate }) {
  const [status, setStatus] = useStateStmt('All Status');
  const [search, setSearch] = useStateStmt('');
  const all = AppData.billing.statements;
  const filtered = all.filter(st => {
    const ms = status === 'All Status' || st.status === status;
    const sr = !search || st.name.toLowerCase().includes(search.toLowerCase()) || st.id.toLowerCase().includes(search.toLowerCase()) || st.acct.toLowerCase().includes(search.toLowerCase());
    return ms && sr;
  });
  const held = all.filter(s => s.status === 'Held').length;

  return (
    <div className="content-inner fade-in" data-screen-label="Statements">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statements</h1>
          <div className="page-subtitle">Generated, held, and published statements · Cycle May 2026</div>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={14} />Bulk Export</button>
      </div>

      {held > 0 && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#FFF8E8', borderColor: '#FFE0A3' }}>
          <Icon name="shield" size={18} style={{ color: 'var(--fta-warning)' }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600 }}>{held} statement{held > 1 ? 's' : ''} held for review.</span>
            <span style={{ color: 'var(--fta-text-4)', marginLeft: 6, fontSize: 13 }}>Pre-publish validation flagged issues. These are not visible to cardholders until released.</span>
          </div>
          <button className="btn btn-sm btn-outline" onClick={() => setStatus('Held')}>Review Held</button>
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Cycle" style={{ width: 160 }}>
            <select defaultValue="May 2026"><option>May 2026</option><option>Apr 2026</option><option>Mar 2026</option></select>
          </FilterField>
          <FilterField label="Status" style={{ width: 180 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>All Status</option>
              <option>Generated</option><option>Held</option><option>Published</option><option>Regenerated</option><option>Voided</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <div className="input" style={{ width: 300 }}>
            <Icon name="search" className="ico" />
            <input placeholder="Search account, name, statement ID" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Statement List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Cycle</th>
              <th>Close</th>
              <th>Due</th>
              <th style={{ textAlign: 'right' }}>Statement Balance</th>
              <th style={{ textAlign: 'right' }}>Min Due</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(st => (
              <tr key={st.id} className="--clickable" onClick={() => navigate('statement-detail', st.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColorAvatar name={st.name} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{st.name}</div>
                      <div className="mono muted" style={{ fontSize: 11 }}>{st.acct}</div>
                    </div>
                  </div>
                </td>
                <td>{st.cycle}</td>
                <td className="muted">{st.close}</td>
                <td className="muted">{st.due}</td>
                <td style={{ textAlign: 'right', fontWeight: 500, color: st.flag && st.balance > 100000 ? 'var(--fta-destructive)' : 'var(--fta-text-5)' }}>{fmtMoney(st.balance)}</td>
                <td style={{ textAlign: 'right' }}>{st.minDue ? fmtMoney(st.minDue) : '—'}</td>
                <td>
                  <StatusPill status={st.status} />
                  {st.flag && <div style={{ fontSize: 11, color: 'var(--fta-warning)', marginTop: 2, maxWidth: 200 }}>{st.flag}</div>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); navigate('statement-detail', st.id); }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>Total {filtered.length} items</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

// ── 4.3 Structured Statement Detail ───────────────────────────
function StatementDetail({ navigate }) {
  const st = AppData.billing.sampleStatement;
  const [regenOpen, setRegenOpen] = useStateStmt(false);
  const w = st.minWarning;

  return (
    <div className="content-inner fade-in" data-screen-label="Statement Detail">
      <Breadcrumb navigate={navigate} items={[{ label: 'Statements', route: 'statements' }, { label: st.name + ' · ' + st.cycle }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {st.cycle} Statement
            <StatusPill status="Published" />
          </h1>
          <div className="page-subtitle">{st.name} · {st.acct} · Closed {st.close} · Due {st.due}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icon name="file" size={14} />PDF</button>
          <button className="btn btn-ghost"><Icon name="list" size={14} />Raw JSON</button>
          <button className="btn btn-outline" onClick={() => setRegenOpen(true)}><Icon name="edit" size={14} />Regenerate</button>
        </div>
      </div>

      {/* Summary block */}
      <div className="card">
        <div className="card-section-title">Summary</div>
        <div className="grid-4" style={{ marginBottom: 16 }}>
          <Field label="Previous Balance" value={fmtMoney(st.openingBalance)} />
          <Field label="Payments / Credits" value={'\u2212 ' + fmtMoney(st.payments)} />
          <Field label="Purchases" value={'+ ' + fmtMoney(st.purchases)} />
          <Field label="Interest Charged" value={'+ ' + fmtMoney(st.interest)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="field" style={{ background: 'var(--fta-primary-1)', borderColor: 'var(--fta-primary-3)' }}>
            <span className="field-label">New Statement Balance</span>
            <div className="field-value" style={{ fontSize: 20, color: 'var(--fta-primary-6)' }}>{fmtMoney(st.statementBalance)}</div>
          </div>
          <div className="field">
            <span className="field-label">Minimum Payment Due</span>
            <div className="field-value" style={{ fontSize: 20 }}>{fmtMoney(st.minDue)}</div>
          </div>
          <div className="field">
            <span className="field-label">Payment Due Date</span>
            <div className="field-value" style={{ fontSize: 20 }}>{st.due}</div>
            <span style={{ fontSize: 11, color: 'var(--fta-success)' }}>{st.daysInCycle}-day cycle · 21+ day grace</span>
          </div>
        </div>
      </div>

      {/* CARD Act minimum payment warning — Finding #14 */}
      <div className="card" style={{ background: '#FFF8E8', borderColor: '#FFE0A3' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Icon name="shield" size={18} style={{ color: 'var(--fta-warning)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Minimum Payment Warning <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fta-text-3)' }}>· Required — CARD Act</span></div>
            <div style={{ fontSize: 13, color: 'var(--fta-text-4)', maxWidth: 760, lineHeight: 1.5 }}>
              If you make only the minimum payment each period, you will pay more in interest and it will take you{' '}
              <strong style={{ color: 'var(--fta-text-5)' }}>{w.years} years and {w.months} months</strong> to pay off this balance.
              Estimated total cost: <strong style={{ color: 'var(--fta-text-5)' }}>{fmtMoney(st.statementBalance + w.totalInterest)}</strong> (including {fmtMoney(w.totalInterest)} interest).
              To pay off in 3 years, pay <strong style={{ color: 'var(--fta-text-5)' }}>{fmtMoney(w.threeYearPmt)}</strong> per month.
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px 0' }}><div className="card-section-title" style={{ marginBottom: 0 }}>Transactions</div></div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
          <tbody>
            {st.transactions.map((t, i) => (
              <tr key={i}>
                <td className="muted">{t.date}</td>
                <td style={{ fontWeight: 500 }}>{t.merchant}</td>
                <td>{t.cat}</td>
                <td style={{ textAlign: 'right' }}>{fmtMoney(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-2">
        {/* Interest */}
        <div className="card">
          <div className="card-section-title">Interest Charge Calculation</div>
          <table className="table" style={{ fontSize: 13 }}>
            <thead><tr><th>Sub-balance</th><th style={{ textAlign: 'right' }}>Avg Daily Bal.</th><th style={{ textAlign: 'right' }}>APR</th><th style={{ textAlign: 'right' }}>Charge</th></tr></thead>
            <tbody>
              {st.interestLines.map((l, i) => (
                <tr key={i}>
                  <td>{l.sub}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMoney(l.adb)}</td>
                  <td style={{ textAlign: 'right' }}>{l.apr}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMoney(l.charge)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclosures + rewards */}
        <div className="card">
          <div className="card-section-title">Disclosures & Rewards</div>
          <div className="grid-2" style={{ marginBottom: 14 }}>
            <Field label="Purchase APR" value={st.apr.purchase} />
            <Field label="Cash Advance APR" value={st.apr.cashAdvance} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Field label="Rate Type" value={st.apr.type} />
          </div>
          <div className="grid-2">
            <Field label="Rewards Earned" value={st.rewards.earned.toLocaleString() + ' pts'} />
            <Field label="Rewards Balance" value={st.rewards.balance.toLocaleString() + ' pts'} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--fta-line-3)' }}>
            Includes Reg Z §1026.7 periodic disclosures, FCBA "Your Billing Rights," and late-payment warning. Customer service: 1-800-555-0190.
          </div>
        </div>
      </div>

      {regenOpen && <RegenerateModal onClose={() => setRegenOpen(false)} />}
    </div>
  );
}

function RegenerateModal({ onClose }) {
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, background: 'var(--fta-bg-1)', borderRadius: 10, zIndex: 60, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeIn 150ms ease' }}>
        <div className="drawer-head">
          <div style={{ fontWeight: 600, fontSize: 16 }}>Regenerate Statement</div>
          <button className="topbar-action" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="drawer-body" style={{ flex: 'none' }}>
          <div style={{ fontSize: 13, color: 'var(--fta-text-4)', marginBottom: 18 }}>
            Re-runs generation against current source-of-truth data. The old version is marked <strong>Superseded</strong> (retained for audit) and the cardholder is notified.
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label" style={{ marginBottom: 6 }}>Reason Code</div>
            <div className="select"><select defaultValue=""><option value="" disabled>Select a reason</option><option>Late-arriving dispute adjustment</option><option>Erroneous fee correction</option><option>Interest recalculation</option><option>Compliance-mandated correction</option></select></div>
          </div>
          <div>
            <div className="field-label" style={{ marginBottom: 6 }}>Justification</div>
            <textarea placeholder="Describe the correction…" style={{ width: '100%', minHeight: 80, border: '1px solid var(--fta-line-3)', borderRadius: 4, padding: 10, fontFamily: 'inherit', fontSize: 14, resize: 'vertical' }} />
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>Regenerate & Publish</button>
        </div>
      </div>
    </>
  );
}

// ── 4.5 Payment Ingestion & Posting Visibility ────────────────
function PaymentsView() {
  const [status, setStatus] = useStateStmt('All Status');
  const [source, setSource] = useStateStmt('All Sources');
  const all = AppData.billing.payments;
  const filtered = all.filter(p => (status === 'All Status' || p.status === status) && (source === 'All Sources' || p.source === source));

  return (
    <div className="content-inner fade-in" data-screen-label="Payments">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <div className="page-subtitle">Payment ingestion and posting visibility · This surface displays events; it does not initiate them</div>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 160 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>All Status</option><option>Scheduled</option><option>Pending</option><option>Posted</option><option>Failed</option><option>Reversed</option>
            </select>
          </FilterField>
          <FilterField label="Source" style={{ width: 160 }}>
            <select value={source} onChange={e => setSource(e.target.value)}>
              <option>All Sources</option><option>Manual</option><option>Autopay</option>
            </select>
          </FilterField>
          <FilterField label="Date Range" style={{ width: 180 }}>
            <select defaultValue="This cycle"><option>This cycle</option><option>Last 30 days</option><option>Last 90 days</option></select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <div className="input" style={{ width: 280 }}>
            <Icon name="search" className="ico" />
            <input placeholder="Search account, payment ID" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Payment Records <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Account</th>
              <th>Source</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th>Funding Source</th>
              <th>Applied To</th>
              <th>Posted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="mono" style={{ color: 'var(--fta-primary-6)', fontWeight: 500 }}>{p.id}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  <div className="mono muted" style={{ fontSize: 11 }}>{p.acct}</div>
                </td>
                <td><span className={"pill --" + (p.source === 'Autopay' ? 'info' : 'inactive')}>{p.source}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmtMoney(p.amount)}</td>
                <td className="mono" style={{ fontSize: 12 }}>{p.funding}</td>
                <td className="muted" style={{ fontSize: 12 }}>{p.applied}</td>
                <td className="muted">{p.date}</td>
                <td>
                  <StatusPill status={p.status} />
                  {p.fail && <div style={{ fontSize: 11, color: 'var(--fta-destructive)', marginTop: 2 }}>{p.fail}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>No auto-retries · failed payments do not reduce balance</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { StatementsView });
