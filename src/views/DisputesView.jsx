import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, Field, NetworkMark, SmallStat } from '../components/shared';
import { TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';
import { DataTableFilters, DataTableFilterField, DataTableFilterLabel } from '../components/business/data-display/DataTableWorkbench';
import { DataTableFilterActions } from '../components/business/data-display/DataTableFilterActions';
import { Button } from '../components/ui/button';
import AppData from '../data/AppData';

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

// Deterministic pseudo-numeric string derived from a seed, so the same dispute
// always renders the same value but different disputes render different values.
function seededDigits(seed, salt, len) {
  let h = 0;
  const s = String(seed) + salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h).padStart(len, '0').slice(0, len);
}

function pseudoTransactionId(dispute) {
  return `${seededDigits(dispute.id, 'txn-a', 8)}-${seededDigits(dispute.id, 'txn-b', 4)}-4${seededDigits(dispute.id, 'txn-c', 3)}-${seededDigits(dispute.id, 'txn-d', 4)}-${seededDigits(dispute.id, 'txn-e', 12)}`;
}

export default function DisputesView({ navigate, navParam }) {
  if (navParam) {
    const disp = AppData.disputes.find(d => d.id === navParam);
    if (disp) return <DisputeDetail dispute={disp} navigate={navigate} />;
  }
  return <DisputeList navigate={navigate} />;
}

function DisputeList({ navigate }) {
  const [status, setStatus] = useState('All Status');
  const [reason, setReason] = useState('All Reasons');
  const [network, setNetwork] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [toast, showToast] = useToast();

  const filteredData = AppData.disputes.filter(d => {
    const matchStatus = status === 'All Status' || d.status === status;
    const matchReason = reason === 'All Reasons' || d.reason === reason;
    const matchNetwork = network === 'All' || d.network === network;
    return matchStatus && matchReason && matchNetwork;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (d, q) =>
      d.holder.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.case.toLowerCase().includes(q) ||
      d.merchant.toLowerCase().includes(q),
  });

  function handleReset() {
    setStatus('All Status');
    setReason('All Reasons');
    setNetwork('All');
    setDateRange('Last 30 days');
    state.setSearch('');
  }

  const totalAmount = state.rows.reduce((s, d) => s + d.amount, 0);
  const openCount = state.rows.filter(d => !['Case Won', 'Case Closed'].includes(d.status)).length;
  const wonCount = state.rows.filter(d => d.status === 'Case Won').length;

  return (
    <div className="content-inner fade-in" data-screen-label="Disputes List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Disputes</h1>
          <div className="page-subtitle">Cardholder disputes and chargebacks · As of 04/29/2024</div>
        </div>
      </div>

      <div className="grid-3">
        <SmallStat label="Total Disputed" value={`$ ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="message" tone="navy" />
        <SmallStat label="Open Cases" value={openCount} icon="circle" tone="peach" />
        <SmallStat label="Cases Won (last 30d)" value={wonCount} icon="shield" tone="green" />
      </div>

      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>Status</DataTableFilterLabel>
          <div className="select">
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>All Status</option>
              <option>Received</option><option>Pending Customer</option><option>Submitted</option><option>Representment</option>
              <option>Prearbitration</option><option>Arbitration</option><option>Case Won</option><option>Case Closed</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Reason</DataTableFilterLabel>
          <div className="select">
            <select value={reason} onChange={e => setReason(e.target.value)}>
              <option>All Reasons</option>
              {[...new Set(AppData.disputes.map(d => d.reason))].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Network</DataTableFilterLabel>
          <div className="select">
            <select value={network} onChange={e => setNetwork(e.target.value)}>
              <option>All</option><option>Visa</option><option>Mastercard</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Date</DataTableFilterLabel>
          <div className="select">
            <select
              value={dateRange}
              onChange={e => { setDateRange(e.target.value); showToast('Date filter is not connected in this mock dataset.'); }}
            >
              <option>Last 30 days</option><option>Last 90 days</option><option>Year-to-date</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterActions onReset={handleReset} onSearch={() => showToast('Filters applied.')} />
      </DataTableFilters>
      <div className="filter-divider" />

      <StandardDataTable
        title="Dispute List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search case, card holder, merchant',
        }}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-sm btn-ghost" onClick={() => showToast('Export is not wired up in this mock.')}>
              <Icon name="download" size={12} />Export
            </button>
            <Button onClick={() => navigate('create-dispute')}>
              <Icon name="plus" size={14} />File Dispute
            </Button>
          </div>
        }
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="dispute-case">Case</TableHead>
              <TableHead columnId="dispute-holder">Card Holder</TableHead>
              <TableHead columnId="dispute-card">Card</TableHead>
              <TableHead columnId="dispute-merchant">Merchant</TableHead>
              <TableHead columnId="dispute-reason">Reason</TableHead>
              <TableHead columnId="dispute-amount" style={{ textAlign: 'right' }}>Amount</TableHead>
              <TableHead columnId="dispute-filed">Filed</TableHead>
              <TableHead columnId="dispute-status">Status</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(s) =>
          s.pageRows.map((d) => (
            <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate('dispute-detail', d.id)}>
              <TableCell className="mono" style={{ fontWeight: 500, color: 'var(--fta-primary-6)' }}>{d.case}</TableCell>
              <TableCell><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ColorAvatar name={d.holder} size="sm" /><span>{d.holder}</span></div></TableCell>
              <TableCell><div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={d.network} /><span className="mono">{d.card}</span></div></TableCell>
              <TableCell>{d.merchant}</TableCell>
              <TableCell><span style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{d.reason}</span></TableCell>
              <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className="muted">{d.filed}</TableCell>
              <TableCell><StatusPill status={d.status} /></TableCell>
              <TableActionCell>
                <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); navigate('dispute-detail', d.id); }}>
                  <Icon name="eye" size={12} />View
                </button>
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

function DisputeDetail({ dispute, navigate }) {
  const steps = AppData.disputeSteps;
  const stepIdx = dispute.step;
  const [toast, showToast] = useToast();
  const txnId = dispute.transactionId || pseudoTransactionId(dispute);
  const networkClaimId = seededDigits(dispute.case, 'ncid', 8);
  const primaryClaimId = seededDigits(dispute.case, 'pcid', 7);
  const reasonCode = seededDigits(dispute.case, 'code', 4);

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Disputes', route: 'disputes' }, { label: 'Dispute Details' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            Dispute Details <StatusPill status={dispute.status} />
          </h1>
          <div className="page-subtitle">Case {dispute.case} · Filed {dispute.filed}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => showToast('Export is not wired up in this mock.')}>
            <Icon name="download" size={14} />Export
          </button>
          <button className="btn btn-primary" onClick={() => showToast('Update Case is not wired up in this mock.')}>
            <Icon name="edit" size={14} />Update Case
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'flex-start' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Progress Tracking</h3>
            <span className="pill --warning">{['Case Won', 'Case Closed'].includes(dispute.status) ? 'Closed' : 'In Progress'}</span>
          </div>
          <div className="stepper">
            {steps.map((s, i) => {
              const completed = i < stepIdx;
              const current = i === stepIdx;
              const upcoming = i > stepIdx;
              return (
                <div key={s} className={"step" + (upcoming ? " --upcoming" : "")}>
                  {completed && <div className="step-dot"><Icon name="check" size={12} strokeWidth={3} /></div>}
                  {current && <div className="step-dot --current"><div style={{ width: 8, height: 8, background: 'var(--fta-primary-6)', borderRadius: 999 }} /></div>}
                  {upcoming && <div className="step-dot --upcoming"><div className="inner" /></div>}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-section-title">General Details</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Card Holder" value={dispute.holder} prefix={<ColorAvatar name={dispute.holder} size="sm" />} />
              <Field label="Transaction ID" value={txnId} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Reason" value={dispute.reason.toUpperCase().replace(/ /g, '_')} />
              <Field label="Amount" value={`$ ${dispute.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Created By" value={dispute.createdBy || 'System'} />
              <Field label="Created Date" value={dispute.createdDate || dispute.filed} />
            </div>
            <Field label="Customer Comments" value={dispute.customerComment || 'No comments were provided by the cardholder for this case.'} />
          </div>

          {dispute.auditLog?.length > 0 && (
            <div className="card">
              <div className="card-section-title">Case Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dispute.auditLog.map(entry => (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--fta-line-3)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{entry.action}</div>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2 }}>{entry.detail}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{entry.actor}</div>
                      <div className="muted-2" style={{ fontSize: 11.5 }}>{entry.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-section-title">Network Details</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Network Claim ID" value={networkClaimId} />
              <Field label="Primary Claim ID" value={primaryClaimId} />
            </div>
            <div className="grid-2">
              <Field label="Network Reason Code" value={reasonCode} />
              <Field label="Network" valueNode={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={dispute.network} />{dispute.network}</span>} />
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Resolution Details</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Resolution Reason" value={dispute.status === 'Case Won' ? 'Chargeback in favor of cardholder' : '—'} />
              <Field label="Resolution Date" value={dispute.status === 'Case Won' ? dispute.filed : '—'} />
            </div>
            <Field label="Resolution Note" value={dispute.status === 'Case Won' ? 'Merchant did not respond within 30 days. Permanent credit issued to cardholder.' : '—'} />
          </div>

          <div className="card">
            <div className="card-section-title">Upload Evidences</div>
            {dispute.evidence?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {dispute.evidence.map(e => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--fta-line-3)', borderRadius: 8, padding: '10px 14px' }}>
                    <Icon name="file" size={18} style={{ color: 'var(--fta-text-3)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.fileName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)' }}>{e.uploadedDate} · Uploaded by {e.source}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ border: '1.5px dashed var(--fta-line-3)', borderRadius: 8, padding: 32, textAlign: 'center', color: 'var(--fta-text-3)' }}>
              <Icon name="upload" size={28} />
              <div style={{ marginTop: 8, fontSize: 14, color: 'var(--fta-text-5)' }}>Drag & drop evidence files here</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Receipts, screenshots, statements (PDF, JPG, PNG · 10 MB max)</div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }} onClick={() => showToast('File upload is not wired up in this mock.')}>
                Browse Files
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastBanner message={toast} />
    </div>
  );
}

function labelForStep(i) {
  return ['Created Date', 'Customer Filed Date', 'Network Filed Date', 'Representment Date', 'Prearbitration Date', 'Arbitration Date'][i] || 'Date';
}
