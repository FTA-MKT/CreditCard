/* global React, Icon, StatusPill, Breadcrumb, ColorAvatar, AppData, initials, NetworkMark, Field, FilterField, Pager */
// views/disputes.jsx — Dispute list + Dispute detail with progress tracking timeline

const { useState: useStateDisp } = React;

function DisputesView({ navigate, navParam }) {
  if (navParam) {
    const disp = AppData.disputes.find(d => d.id === navParam);
    if (disp) return <DisputeDetail dispute={disp} navigate={navigate} />;
  }
  return <DisputeList navigate={navigate} />;
}

// ── List ──────────────────────────────────────────────────────
function DisputeList({ navigate }) {
  const [search, setSearch] = useStateDisp('');
  const [status, setStatus] = useStateDisp('All Status');
  const [reason, setReason] = useStateDisp('All Reasons');

  const filtered = AppData.disputes.filter(d => {
    const matchSearch = !search ||
      d.holder.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.case.toLowerCase().includes(search.toLowerCase()) ||
      d.merchant.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'All Status' || d.status === status;
    const matchReason = reason === 'All Reasons' || d.reason === reason;
    return matchSearch && matchStatus && matchReason;
  });

  // Quick stats above the table
  const totalAmount = filtered.reduce((s, d) => s + d.amount, 0);
  const openCount = filtered.filter(d => !['Case Won', 'Case Closed'].includes(d.status)).length;
  const wonCount = filtered.filter(d => d.status === 'Case Won').length;

  return (
    <div className="content-inner fade-in" data-screen-label="Disputes List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Disputes</h1>
          <div className="page-subtitle">Cardholder disputes and chargebacks · As of 04/29/2024</div>
        </div>
        <button className="btn btn-primary">
          <Icon name="plus" size={14} />
          File Dispute
        </button>
      </div>

      <div className="grid-3">
        <SmallStat label="Total Disputed" value={`$ ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="message" tone="navy" />
        <SmallStat label="Open Cases" value={openCount} icon="circle" tone="peach" />
        <SmallStat label="Cases Won (last 30d)" value={wonCount} icon="shield" tone="green" />
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 200 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>All Status</option>
              <option>Pending Customer</option>
              <option>Submitted</option>
              <option>Representment</option>
              <option>Prearbitration</option>
              <option>Arbitration</option>
              <option>Case Won</option>
              <option>Case Closed</option>
            </select>
          </FilterField>
          <FilterField label="Reason" style={{ width: 220 }}>
            <select value={reason} onChange={e => setReason(e.target.value)}>
              <option>All Reasons</option>
              {[...new Set(AppData.disputes.map(d => d.reason))].map(r => <option key={r}>{r}</option>)}
            </select>
          </FilterField>
          <FilterField label="Network" style={{ width: 160 }}>
            <select defaultValue="All">
              <option>All</option><option>Visa</option><option>Mastercard</option>
            </select>
          </FilterField>
          <FilterField label="Date" style={{ width: 200 }}>
            <select defaultValue="Last 30 days">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Year-to-date</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatus('All Status'); setReason('All Reasons'); }}>Reset</button>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Dispute List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 360 }}>
              <Icon name="search" className="ico" />
              <input
                placeholder="Search case, card holder, merchant"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-sm btn-ghost"><Icon name="download" size={12} />Export</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Card Holder</th>
              <th>Card</th>
              <th>Merchant</th>
              <th>Reason</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th>Filed</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="--clickable" onClick={() => navigate('dispute-detail', d.id)}>
                <td className="mono" style={{ fontWeight: 500, color: 'var(--fta-primary-6)' }}>{d.case}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColorAvatar name={d.holder} size="sm" />
                    <span>{d.holder}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <NetworkMark network={d.network} />
                    <span className="mono">{d.card}</span>
                  </div>
                </td>
                <td>{d.merchant}</td>
                <td><span style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{d.reason}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="muted">{d.filed}</td>
                <td><StatusPill status={d.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); navigate('dispute-detail', d.id); }}>
                    <Icon name="eye" size={12} />
                    View
                  </button>
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

function SmallStat({ label, value, icon, tone }) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <div className={`kpi-icon --${tone}`}>
        <Icon name={icon} className="ico" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

// ── Detail ──────────────────────────────────────────────────────
function DisputeDetail({ dispute, navigate }) {
  const steps = AppData.disputeSteps;
  const stepIdx = dispute.step;

  return (
    <div className="content-inner fade-in" data-screen-label={"Dispute " + dispute.id}>
      <Breadcrumb
        navigate={navigate}
        items={[
          { label: 'Disputes', route: 'disputes' },
          { label: 'Dispute Details' },
        ]}
      />

      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            Dispute Details
            <StatusPill status={dispute.status} />
          </h1>
          <div className="page-subtitle">Case {dispute.case} · Filed {dispute.filed}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
          <button className="btn btn-primary"><Icon name="edit" size={14} />Update Case</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'flex-start' }}>
        {/* Progress timeline */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Progress Tracking</h3>
            <span className="pill --warning">{dispute.status === 'Case Won' || dispute.status === 'Case Closed' ? 'Closed' : 'In Progress'}</span>
          </div>
          <div className="stepper">
            {steps.map((s, i) => {
              const completed = i < stepIdx;
              const current = i === stepIdx;
              const upcoming = i > stepIdx;
              return (
                <div key={s} className={"step" + (upcoming ? " --upcoming" : "")}>
                  {completed && (
                    <div className="step-dot"><Icon name="check" size={12} strokeWidth={3} /></div>
                  )}
                  {current && (
                    <div className="step-dot --current"><div style={{ width: 8, height: 8, background: 'var(--fta-primary-6)', borderRadius: 999 }} /></div>
                  )}
                  {upcoming && (
                    <div className="step-dot --upcoming"><div className="inner" /></div>
                  )}
                  <div className="step-title">{s}</div>
                  <div className="step-meta">
                    {completed && `${labelForStep(i)}: ${dispute.filed} 16:22:24`}
                    {current && `Currently in ${s}`}
                    {upcoming && '—'}
                  </div>
                </div>
              );
            })}
            <div className="step --upcoming">
              <div className="step-dot --upcoming"><div className="inner" /></div>
              <div className="step-title">Result</div>
              <div className="step-meta">Pending decision</div>
            </div>
          </div>
        </div>

        {/* Details cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-section-title">General Details</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Card Holder" value={dispute.holder} prefix={<ColorAvatar name={dispute.holder} size="sm" />} />
              <Field label="Transaction ID" value="12345624-aa69-4cbc-a946-30d90181b621" />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Reason" value={dispute.reason.toUpperCase().replace(/ /g, '_')} />
              <Field label="Amount" value={`$ ${dispute.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
            </div>
            <div>
              <Field
                label="Customer Comments"
                value="The merchant charged me twice for the same item on 04/22. Returned the duplicate to my account but the dispute charge has not yet posted. Requesting a chargeback for the duplicate transaction."
              />
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Network Details</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Network Claim ID" value="11000000" />
              <Field label="Primary Claim ID" value="2000000" />
            </div>
            <div className="grid-2">
              <Field label="Network Reason Code" value="4859" />
              <Field label="Network" valueNode={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <NetworkMark network={dispute.network} />
                  {dispute.network}
                </span>
              } />
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Resolution Details</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Resolution Reason" value={dispute.status === 'Case Won' ? 'Chargeback in favor of cardholder' : '—'} />
              <Field label="Resolution Date" value={dispute.status === 'Case Won' ? dispute.filed : '—'} />
            </div>
            <Field
              label="Resolution Note"
              value={dispute.status === 'Case Won'
                ? 'Merchant did not respond within 30 days. Permanent credit issued to cardholder.'
                : '—'}
            />
          </div>

          <div className="card">
            <div className="card-section-title">Upload Evidences</div>
            <div style={{
              border: '1.5px dashed var(--fta-line-3)',
              borderRadius: 8,
              padding: 32,
              textAlign: 'center',
              color: 'var(--fta-text-3)',
            }}>
              <Icon name="upload" size={28} />
              <div style={{ marginTop: 8, fontSize: 14, color: 'var(--fta-text-5)' }}>Drag & drop evidence files here</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Receipts, screenshots, statements (PDF, JPG, PNG · 10 MB max)</div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Browse Files</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function labelForStep(i) {
  return ['Created Date', 'Customer Filed Date', 'Network Filed Date', 'Representment Date', 'Prearbitration Date', 'Arbitration Date'][i] || 'Date';
}

Object.assign(window, { DisputesView });
