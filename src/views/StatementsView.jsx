import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { FilterField, Field, Pager, fmtMoney } from '../components/shared';
import AppData from '../data/AppData';

export default function StatementsView({ route, navigate, navParam }) {
  if (route === 'statement-detail') {
    return <StatementDetail navigate={navigate} />;
  }
  if (route === 'payments') {
    return <PaymentsView navigate={navigate} />;
  }
  if (route === 'statements') {
    return <StatementList navigate={navigate} />;
  }
  return <BillingSummary navigate={navigate} />;
}

function BigStat({ label, value, sub, tone }) {
  const tones = { blue: 'var(--fta-primary-6)', green: '#12B76A', red: '#F04438', gray: 'var(--fta-text-4)' };
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--fta-text-4)', fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: tones[tone] || 'var(--fta-text-1)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BillingSummary({ navigate }) {
  const s = AppData.billing.summary;
  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing Summary</h1>
          <div className="page-subtitle">Current billing cycle · May 1 – May 31, 2024</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('statements')}>Statements</button>
          <button className="btn btn-ghost" onClick={() => navigate('payments')}>Payments</button>
          <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <BigStat label="Outstanding Balance" value={fmtMoney(s.outstanding)} tone="blue" sub="Across all accounts" />
        <BigStat label="Billed This Cycle" value={fmtMoney(s.billedThisCycle)} tone="blue" sub="Current cycle total" />
        <BigStat label="Payments Received" value={fmtMoney(s.paymentsReceived)} tone="green" sub="May 2024" />
        <BigStat label="Fee Revenue" value={fmtMoney(s.feeRevenue)} tone="blue" sub="Interest + fees" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Payment Performance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MetricRow label="Failed Payment Rate" value={s.failedRate} warn={parseFloat(s.failedRate) > 3} />
            <MetricRow label="Late Payment Rate" value={s.lateRate} warn={parseFloat(s.lateRate) > 5} />
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Aging Buckets</div>
          {s.aging.map(a => (
            <div key={a.bucket} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                <span>{a.bucket}</span>
                <span style={{ fontWeight: 600 }}>{fmtMoney(a.amount)} <span style={{ color: 'var(--fta-text-4)', fontWeight: 400 }}>({a.pct}%)</span></span>
              </div>
              <div style={{ height: 6, background: 'var(--fta-fill-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.pct}%`, background: 'var(--fta-primary-6)', borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, warn }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--fta-line-3)' }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 700, color: warn ? 'var(--fta-warning)' : '#12B76A' }}>{value}</span>
    </div>
  );
}

function StatementList({ navigate }) {
  const statements = AppData.billing.statements;
  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statements</h1>
          <div className="page-subtitle">Monthly billing statements for all accounts</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('billing-summary')}>Summary</button>
          <button className="btn btn-ghost" onClick={() => navigate('payments')}>Payments</button>
          <button className="btn btn-ghost"><Icon name="download" size={14} />Export All</button>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <FilterField label="Period" style={{ width: 200 }}>
            <select><option>May 2024</option><option>April 2024</option><option>March 2024</option></select>
          </FilterField>
          <FilterField label="Status" style={{ width: 160 }}>
            <select><option>All Status</option><option>Generated</option><option>Sent</option><option>Viewed</option></select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-primary">Filter</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Statement List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({statements.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 280 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by account, period" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Statement ID</th><th>Account</th><th>Period</th>
              <th style={{ textAlign: 'right' }}>Balance</th><th style={{ textAlign: 'right' }}>Min Payment</th>
              <th>Due Date</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {statements.map(s => (
              <tr key={s.id} className="--clickable" onClick={() => navigate('statement-detail', s.id)}>
                <td className="mono muted">{s.id}</td>
                <td style={{ fontWeight: 500 }}>{s.account}</td>
                <td>{s.period}</td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmtMoney(s.balance)}</td>
                <td style={{ textAlign: 'right' }}>{fmtMoney(s.minPayment)}</td>
                <td className="muted">{s.dueDate}</td>
                <td><StatusPill status={s.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); navigate('statement-detail', s.id); }}><Icon name="eye" size={12} />View</button>
                    <button className="btn btn-sm btn-ghost" onClick={e => e.stopPropagation()}><Icon name="download" size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {statements.length} items</span><Pager /></div>
      </div>
    </div>
  );
}

function StatementDetail({ navigate }) {
  const stmt = AppData.billing.sampleStatement;
  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Statements', route: 'statements' }, { label: stmt.id }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Statement Detail</h1>
          <div className="page-subtitle">{stmt.id} · {stmt.period} · {stmt.account}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icon name="download" size={14} />Download PDF</button>
          <button className="btn btn-primary"><Icon name="circle" size={14} />Regenerate</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        <BigStat label="Opening Balance" value={fmtMoney(stmt.openingBalance)} tone="gray" />
        <BigStat label="Closing Balance" value={fmtMoney(stmt.closingBalance)} tone="blue" />
        <BigStat label="Min Payment Due" value={fmtMoney(stmt.minPayment)} tone="blue" />
        <BigStat label="Credit Available" value={fmtMoney(stmt.creditAvailable)} tone="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="card">
          <div className="card-section-title">Account Information</div>
          <div className="grid-2" style={{ marginBottom: 14 }}>
            <Field label="Account" value={stmt.account} />
            <Field label="Credit Limit" value={fmtMoney(stmt.creditLimit)} />
          </div>
          <div className="grid-2">
            <Field label="Statement Date" value={stmt.statementDate} />
            <Field label="Payment Due Date" value={stmt.dueDate} />
          </div>
        </div>
        <div className="card">
          <div className="card-section-title">Summary of Charges</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stmt.chargesSummary.map(c => (
              <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--fta-line-3)' }}>
                <span style={{ color: 'var(--fta-text-4)' }}>{c.label}</span>
                <span style={{ fontWeight: 500 }}>{fmtMoney(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Transactions ({stmt.transactions.length})</h2>
        </div>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th style={{ textAlign: 'right' }}>Amount</th></tr>
          </thead>
          <tbody>
            {stmt.transactions.map((t, i) => (
              <tr key={i}>
                <td className="muted">{t.date}</td>
                <td style={{ fontWeight: 500 }}>{t.description}</td>
                <td><span style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{t.category}</span></td>
                <td><span className={"pill " + (t.type === 'Payment' ? '--success' : t.type === 'Fee' ? '--warning' : '--info')}>{t.type}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 500, color: t.type === 'Payment' ? '#12B76A' : undefined }}>
                  {t.type === 'Payment' ? '-' : ''}{fmtMoney(Math.abs(t.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {stmt.transactions.length} items</span><Pager /></div>
      </div>
    </div>
  );
}

function PaymentsView({ navigate }) {
  const payments = AppData.billing.payments;
  const totalReceived = payments.filter(p => p.status === 'Settled').reduce((s, p) => s + p.amount, 0);
  const totalFailed = payments.filter(p => p.status === 'Failed').length;

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <div className="page-subtitle">Payment transactions and reconciliation · May 2024</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('billing-summary')}>Summary</button>
          <button className="btn btn-ghost" onClick={() => navigate('statements')}>Statements</button>
          <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <BigStat label="Total Received" value={fmtMoney(totalReceived)} tone="green" sub="Settled payments" />
        <BigStat label="Failed Payments" value={totalFailed} tone={totalFailed > 0 ? 'red' : 'green'} sub="Require action" />
        <BigStat label="Total Transactions" value={payments.length} tone="blue" sub="This period" />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Payment List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({payments.length})</span></h2>
          <div className="right">
            <FilterField label="" style={{ width: 160 }}>
              <select><option>All Status</option><option>Settled</option><option>Failed</option><option>Pending</option></select>
            </FilterField>
            <div className="input" style={{ width: 280 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by account, ID" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Payment ID</th><th>Account</th><th>Method</th>
              <th style={{ textAlign: 'right' }}>Amount</th><th>Date</th><th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td className="mono muted">{p.id}</td>
                <td style={{ fontWeight: 500 }}>{p.account}</td>
                <td>{p.method}</td>
                <td style={{ textAlign: 'right', fontWeight: 500, color: p.status === 'Failed' ? 'var(--fta-error)' : undefined }}>{fmtMoney(p.amount)}</td>
                <td className="muted">{p.date}</td>
                <td><StatusPill status={p.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  {p.status === 'Failed'
                    ? <button className="btn btn-sm btn-primary">Retry</button>
                    : <button className="btn btn-sm btn-ghost">Receipt</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {payments.length} items</span><Pager /></div>
      </div>
    </div>
  );
}
