import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { Field, Pager, SmallStat, fmtMoney } from '../components/shared';
import { TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';
import { DataTableFilters, DataTableFilterField, DataTableFilterLabel } from '../components/business/data-display/DataTableWorkbench';
import { DataTableFilterActions } from '../components/business/data-display/DataTableFilterActions';
import AppData from '../data/AppData';

export default function StatementsView({ route, navigate, navParam }) {
  if (route === 'statement-detail') {
    return <StatementDetail navigate={navigate} navParam={navParam} />;
  }
  if (route === 'payments') {
    return <PaymentsView navigate={navigate} />;
  }
  return <StatementBillingView navigate={navigate} />;
}

function ToastBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: 'var(--fta-text-5)', color: '#fff', padding: '10px 16px',
      borderRadius: 8, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    }}>
      {message}
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  }
  return [toast, showToast];
}

function resolveStatement(navParam) {
  const sample = AppData.billing.sampleStatement;
  const found = AppData.billing.statements.find(s => s.id === navParam);
  if (!found) return sample;
  return {
    ...sample,
    id: found.id,
    account: found.account,
    period: found.period || found.cycle,
    cycle: found.cycle,
    balance: found.balance,
    closingBalance: found.balance,
    statementBalance: found.balance,
    minDue: found.minDue,
    minPayment: found.minPayment,
    due: found.due || found.dueDate,
    dueDate: found.dueDate || found.due,
    status: found.status,
  };
}

function BigStat({ label, value, sub, tone }) {
  const tones = { blue: 'var(--fta-primary-6)', green: '#12B76A', red: '#F04438', gray: 'var(--fta-text-4)' };
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--fta-text-4)', fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: tones[tone] || 'var(--fta-text-5)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 4 }}>{sub}</div>}
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

// Billing Operations Center: overview first (billing health at a glance), statement
// management second — a single vertical page rather than separate tabs, since the two
// are always read together when working a billing cycle.
function StatementBillingView({ navigate }) {
  const s = AppData.billing.summary;
  const statements = AppData.billing.statements;
  const [cycleFilter, setCycleFilter] = useState('All Cycles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [toast, showToast] = useToast();

  const cycleOptions = [...new Set(statements.map(st => st.cycle))];
  const statusOptions = [...new Set(statements.map(st => st.status))];

  const filteredData = statements.filter(st => {
    const matchCycle = cycleFilter === 'All Cycles' || st.cycle === cycleFilter;
    const matchStatus = statusFilter === 'All Status' || st.status === statusFilter;
    return matchCycle && matchStatus;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (st, q) =>
      st.id.toLowerCase().includes(q) ||
      st.account.toLowerCase().includes(q) ||
      st.cycle.toLowerCase().includes(q),
  });

  function handleReset() {
    setCycleFilter('All Cycles');
    setStatusFilter('All Status');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statement & Billing</h1>
          <div className="page-subtitle">Billing operations and account statements · May 1 – May 31, 2026</div>
        </div>
      </div>

      {/* Section 1: Billing Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <SmallStat label="Outstanding Balance" value={fmtMoney(s.outstanding)} icon="card" tone="navy" />
        <SmallStat label="Billed This Cycle" value={fmtMoney(s.billedThisCycle)} icon="receipt" tone="blue" />
        <SmallStat label="Payments Received" value={fmtMoney(s.paymentsReceived)} icon="check-circle" tone="green" />
        <SmallStat label="Fee Revenue" value={fmtMoney(s.feeRevenue)} icon="chart" tone="peach" />
        <SmallStat label="Interest Revenue" value={fmtMoney(s.interestRevCycle)} icon="trending-up" tone="pink" />
      </div>

      {/* Section 2: Billing Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
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

      <div className="divider" />

      {/* Section 3: Statement List */}
      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>Cycle</DataTableFilterLabel>
          <div className="select">
            <select value={cycleFilter} onChange={e => setCycleFilter(e.target.value)}>
              <option>All Cycles</option>
              {cycleOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Status</DataTableFilterLabel>
          <div className="select">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              {statusOptions.map(st => <option key={st}>{st}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterActions onReset={handleReset} />
      </DataTableFilters>
      <div className="filter-divider" />

      <StandardDataTable
        title="Statement List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search by account, cycle',
        }}
        actions={
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Export queued')}>
            <Icon name="download" size={12} />Export All
          </button>
        }
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="statement-id">Statement ID</TableHead>
              <TableHead columnId="statement-account">Account</TableHead>
              <TableHead columnId="statement-cycle">Cycle</TableHead>
              <TableHead columnId="statement-date">Statement Date</TableHead>
              <TableHead columnId="statement-closing-balance" style={{ textAlign: 'right' }}>Closing Balance</TableHead>
              <TableHead columnId="statement-min-payment" style={{ textAlign: 'right' }}>Minimum Payment Due</TableHead>
              <TableHead columnId="statement-due-date">Due Date</TableHead>
              <TableHead columnId="statement-status">Status</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(s) =>
          s.pageRows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => navigate('statement-detail', row.id)}
            >
              <TableCell className="mono muted">{row.id}</TableCell>
              <TableCell style={{ fontWeight: 500 }}>{row.account}</TableCell>
              <TableCell>{row.cycle}</TableCell>
              <TableCell className="muted">{row.close}</TableCell>
              <TableCell style={{ fontWeight: 500, textAlign: 'right' }}>{fmtMoney(row.balance)}</TableCell>
              <TableCell style={{ textAlign: 'right' }}>{fmtMoney(row.minPayment)}</TableCell>
              <TableCell className="muted">{row.dueDate}</TableCell>
              <TableCell><StatusPill status={row.status} /></TableCell>
              <TableActionCell>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                  <button
                    className="text-sm text-primary hover:underline whitespace-nowrap"
                    onClick={() => navigate('statement-detail', row.id)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    style={{ padding: '0 6px' }}
                    aria-label="Download statement"
                    onClick={() => showToast('Download queued')}
                  >
                    <Icon name="download" size={12} />
                  </button>
                </div>
              </TableActionCell>
            </TableRow>
          ))
        }
        emptyState={<DataTableEmptyStateRow colSpan={9} />}
      />
      <ToastBanner message={toast} />
    </div>
  );
}

function StatementDetail({ navigate, navParam }) {
  const stmt = resolveStatement(navParam);
  const [toast, showToast] = useToast();

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Statement & Billing', route: 'billing-summary' }, { label: stmt.id }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Statement Detail</h1>
          <div className="page-subtitle">{stmt.id} · {stmt.period} · {stmt.account}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => showToast('Download queued')}><Icon name="download" size={14} />Download PDF</button>
          <button className="btn btn-primary" onClick={() => showToast('Statement regenerated')}><Icon name="circle" size={14} />Regenerate</button>
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
      <ToastBanner message={toast} />
    </div>
  );
}

function PaymentsView({ navigate }) {
  const payments = AppData.billing.payments;
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [toast, showToast] = useToast();

  const totalReceived = payments.filter(p => p.status === 'Settled').reduce((s, p) => s + p.amount, 0);
  const totalFailed = payments.filter(p => p.status === 'Failed').length;

  const filteredData = payments.filter(p => statusFilter === 'All Status' || p.status === statusFilter);

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (p, q) =>
      p.id.toLowerCase().includes(q) ||
      p.account.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q) ||
      String(p.amount).includes(q),
  });

  function handleReset() {
    setStatusFilter('All Status');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <div className="page-subtitle">Payment transactions and reconciliation · May 2026</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <BigStat label="Total Received" value={fmtMoney(totalReceived)} tone="green" sub="Settled payments" />
        <BigStat label="Failed Payments" value={totalFailed} tone={totalFailed > 0 ? 'red' : 'green'} sub="Require action" />
        <BigStat label="Total Transactions" value={payments.length} tone="blue" sub="This period" />
      </div>

      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>Status</DataTableFilterLabel>
          <div className="select">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option><option>Settled</option><option>Failed</option><option>Processing</option><option>Scheduled</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterActions onReset={handleReset} />
      </DataTableFilters>
      <div className="filter-divider" />

      <StandardDataTable
        title="Payment List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search by account, ID',
        }}
        actions={
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Export queued')}>
            <Icon name="download" size={12} />Export
          </button>
        }
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="payment-id">Payment ID</TableHead>
              <TableHead columnId="payment-account">Account</TableHead>
              <TableHead columnId="payment-method">Method</TableHead>
              <TableHead columnId="payment-amount" style={{ textAlign: 'right' }}>Amount</TableHead>
              <TableHead columnId="payment-date">Date</TableHead>
              <TableHead columnId="payment-status">Status</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(s) =>
          s.pageRows.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="mono muted">{p.id}</TableCell>
              <TableCell style={{ fontWeight: 500 }}>{p.account}</TableCell>
              <TableCell>{p.method}</TableCell>
              <TableCell style={{ fontWeight: 500, textAlign: 'right', color: p.status === 'Failed' ? 'var(--fta-error)' : undefined }}>{fmtMoney(p.amount)}</TableCell>
              <TableCell className="muted">{p.date}</TableCell>
              <TableCell><StatusPill status={p.status} /></TableCell>
              <TableActionCell>
                {p.status === 'Failed'
                  ? <button className="btn btn-sm btn-primary" onClick={() => showToast('Retry requested')}>Retry</button>
                  : <button className="btn btn-sm btn-ghost" onClick={() => showToast('Receipt opened')}>Receipt</button>}
              </TableActionCell>
            </TableRow>
          ))
        }
        emptyState={<DataTableEmptyStateRow colSpan={7} />}
      />
      <ToastBanner message={toast} />
    </div>
  );
}
