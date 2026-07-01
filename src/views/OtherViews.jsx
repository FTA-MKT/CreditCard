import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, FilterField, Field, Pager, NetworkMark, SmallStat } from '../components/shared';
import AppData from '../data/AppData';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';

export function SubProgramsView({ navigate }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [formFactorFilter, setFormFactorFilter] = useState('');

  const filteredData = AppData.subPrograms.filter(s => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (networkFilter && s.network !== networkFilter) return false;
    if (classificationFilter && s.classification !== classificationFilter) return false;
    if (formFactorFilter === 'Physical' && !(s.type === 'Physical' || s.formFactors?.includes('physical'))) return false;
    if (formFactorFilter === 'Virtual' && !(s.type === 'Virtual' || s.formFactors?.includes('virtual'))) return false;
    return true;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (s, q) =>
      s.name.toLowerCase().includes(q) ||
      (s.bin || '').includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.type || '').toLowerCase().includes(q),
  });

  const uniqueStatuses = [...new Set(AppData.subPrograms.map(s => s.status))].filter(Boolean).sort();
  const uniqueNetworks = [...new Set(AppData.subPrograms.map(s => s.network))].filter(Boolean).sort();
  const uniqueClassifications = [...new Set(AppData.subPrograms.map(s => s.classification))].filter(Boolean).sort();

  function handleReset() {
    setStatusFilter('');
    setNetworkFilter('');
    setClassificationFilter('');
    setFormFactorFilter('');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sub-Programs</h1>
          <div className="page-subtitle">All sub-programs across all card programs</div>
        </div>
      </div>

      {/* Filter bar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Status</span>
              <div className="select" style={{ width: 160 }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Network</span>
              <div className="select" style={{ width: 160 }}>
                <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueNetworks.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Classification Type</span>
              <div className="select" style={{ width: 180 }}>
                <select value={classificationFilter} onChange={e => setClassificationFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueClassifications.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Physical / Virtual</span>
              <div className="select" style={{ width: 160 }}>
                <select value={formFactorFilter} onChange={e => setFormFactorFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  <option value="Physical">Physical</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset</button>
            <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={13} />Search
            </button>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
      </div>

      <StandardDataTable
        title="Sub-program List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search name, BIN, ID',
        }}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0 7px', height: 32, display: 'flex', alignItems: 'center' }} title="Grid view">
              <LayoutGrid size={15} />
            </button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0 7px', height: 32, display: 'flex', alignItems: 'center' }} title="List view">
              <List size={15} />
            </button>
            <Button onClick={() => navigate('create-subprogram')}>
              <Plus size={14} />
              Create Sub-Program
            </Button>
          </div>
        }
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="sub-name">Sub-program Name</TableHead>
              <TableHead columnId="sub-bin">BIN Prefix</TableHead>
              <TableHead columnId="sub-status">Status</TableHead>
              <TableHead columnId="sub-cardtype">Card Type</TableHead>
              <TableHead columnId="sub-class">Classification</TableHead>
              <TableHead columnId="sub-ff">Physical / Virtual</TableHead>
              <TableHead columnId="sub-network">Network</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(tableState) =>
          tableState.pageRows.map((sub) => (
            <TableRow
              key={sub.id}
              className="cursor-pointer"
              onClick={() => navigate('subprogram-detail', { id: sub.id, from: 'global' })}
            >
              <TableCell>
                <span style={{ color: 'var(--fta-primary-6)', fontWeight: 500 }}>{sub.name}</span>
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">{sub.bin}</TableCell>
              <TableCell><SubStatusDot status={sub.status} /></TableCell>
              <TableCell><CardTypeTag cardType={sub.cardType} /></TableCell>
              <TableCell>{sub.classification}</TableCell>
              <TableCell><FormFactorTag type={sub.type} formFactors={sub.formFactors} /></TableCell>
              <TableCell>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <NetworkMark network={sub.network} />{sub.network}
                </span>
              </TableCell>
              <TableActionCell>
                <button
                  className="text-sm text-primary hover:underline whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sub.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </TableActionCell>
            </TableRow>
          ))
        }
        emptyState={<DataTableEmptyStateRow colSpan={8} />}
      />
    </div>
  );
}

function SubStatusDot({ status }) {
  const dotColor =
    status === 'Active' ? '#22c55e' :
    status === 'Inactive' ? '#9ca3af' :
    '#f59e0b';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function CardTypeTag({ cardType }) {
  if (!cardType) return <span style={{ color: 'var(--fta-text-3)' }}>—</span>;
  const isCredit = cardType === 'credit';
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
      background: isCredit ? '#eff6ff' : '#fdf2f8',
      color: isCredit ? '#1e40af' : '#9d174d',
    }}>
      {isCredit ? 'Credit Card' : 'Debit Card'}
    </span>
  );
}

function FormFactorTag({ type, formFactors }) {
  const hasPhysical = formFactors?.includes('physical') || type === 'Physical' || (type || '').toLowerCase().includes('physical');
  const hasVirtual = formFactors?.includes('virtual') || type === 'Virtual' || (type || '').toLowerCase().includes('virtual');
  const Tag = ({ bg, color, label }) => (
    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: bg, color }}>{label}</span>
  );
  if (hasPhysical && hasVirtual) return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      <Tag bg="#eff6ff" color="#1e40af" label="Physical" />
      <Tag bg="#fff7ed" color="#c2410c" label="Virtual" />
    </span>
  );
  if (hasPhysical) return <Tag bg="#eff6ff" color="#1e40af" label="Physical" />;
  if (hasVirtual) return <Tag bg="#fff7ed" color="#c2410c" label="Virtual" />;
  return <span style={{ color: 'var(--fta-text-3)' }}>—</span>;
}

export function NestedProgramView({ navigate, navParam }) {
  const subId      = navParam && typeof navParam === 'object' ? navParam.id   : navParam;
  const from       = navParam && typeof navParam === 'object' ? navParam.from : 'program';
  const initialTab = navParam && typeof navParam === 'object' && navParam.tab ? navParam.tab : 'details';

  const [tab, setTab] = useState(initialTab);

  const sub = AppData.subPrograms.find(s => s.id === subId);
  if (!sub) return (
    <div className="content-inner fade-in">
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--fta-text-3)' }}>
        Sub-program not found.
      </div>
    </div>
  );

  const parentProgram = sub.programId ? AppData.programs.find(p => p.id === sub.programId) : null;

  const breadcrumbItems = (from === 'global' || !parentProgram)
    ? [{ label: 'Sub-Programs', route: 'subprograms' }, { label: sub.name }]
    : [{ label: 'Program', route: 'programs' }, { label: parentProgram.name, route: 'program-detail-subs', param: parentProgram.id }, { label: sub.name }];

  const v = (val) => val || '—';

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={breadcrumbItems} />
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{sub.name} <StatusPill status={sub.status} /></h1>
          <div className="page-subtitle">Sub-Program ID {sub.id} · BIN Prefix {v(sub.bin)} · {(sub.cards || 0).toLocaleString()} cards{parentProgram ? ` · under ${parentProgram.name}` : ''}</div>
        </div>
        <button className="btn btn-primary"><Icon name="edit" size={14} />Edit</button>
      </div>

      {parentProgram && (
        <div className="card" style={{ marginBottom: 0, background: 'var(--fta-primary-1)', border: '1px solid var(--fta-primary-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fta-primary-6)', textTransform: 'uppercase', letterSpacing: '.5px', minWidth: 100 }}>Parent Program</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fta-text-1)', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent' }}
                onMouseEnter={e => e.target.style.textDecorationColor = 'currentColor'}
                onMouseLeave={e => e.target.style.textDecorationColor = 'transparent'}
                onClick={() => navigate('program-detail-subs', parentProgram.id)}>
                {parentProgram.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--fta-text-3)', fontFamily: 'monospace' }}>{parentProgram.id}</span>
              <StatusPill status={parentProgram.status} />
            </div>
          </div>
        </div>
      )}

      {/* ── Internal tabs ── */}
      <div className="tabpills">
        <button className={'tabpill' + (tab === 'details' ? ' --active' : '')} onClick={() => setTab('details')}>
          <Icon name="list" className="ico" />Sub-program Details
        </button>
        <button className={'tabpill' + (tab === 'cards' ? ' --active' : '')} onClick={() => setTab('cards')}>
          <Icon name="card" className="ico" />Cards
        </button>
        <button className={'tabpill' + (tab === 'files' ? ' --active' : '')} onClick={() => setTab('files')}>
          <Icon name="file" className="ico" />Files
        </button>
      </div>

      {/* ── Details tab ── */}
      {tab === 'details' && (
        <>
          <div className="card">
            <div className="card-section-title">General Information</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Sub-Program Name" value={v(sub.name)} />
              <Field label="Sub-Program ID" value={v(sub.id)} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Business Name" value={v(sub.bizName)} />
              <Field label="Status" valueNode={<StatusPill status={sub.status} />} />
            </div>
            <Field label="Description" value={v(sub.description)} />
          </div>

          <div className="card">
            <div className="card-section-title">Card Setting</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Card Type (Credit / Debit)" value={v(sub.cardType)} />
              <Field label="Physical / Virtual" value={v(sub.type)} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="BIN Prefix" value={v(sub.bin)} />
              <Field label="Network" valueNode={sub.network ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={sub.network} />{sub.network}</span> : <span>—</span>} />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Usage Type" value={v(sub.usageType)} />
              <Field label="Classification" value={v(sub.classification)} />
            </div>
            <div className="grid-2">
              <Field label="Valid Period" value={v(sub.validPeriod)} />
            </div>
          </div>

          {/* Financial Account + Credit Settings */}
          {(() => {
            const snap = sub.financialAccountSnapshot
              ?? (sub.financialAccountId ? AppData.financialAccounts.find(a => a.id === sub.financialAccountId) ?? null : null);
            const hasLegacy = sub.creditMin || sub.creditMax || sub.purchaseApr || sub.billingCycle || sub.gracePeriod;
            const cs = snap ?? (hasLegacy ? sub : null);
            return (
              <div className="card">
                <div className="card-section-title">Financial Account</div>
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <Field label="Name"     value={snap ? snap.name     : 'Not configured'} />
                  <Field label="Type"     value={snap ? snap.type     : 'Not configured'} />
                </div>
                <div className="grid-2" style={{ marginBottom: cs ? 16 : 0 }}>
                  <Field label="Currency" value={snap ? snap.currency : 'Not configured'} />
                </div>
                {cs && (
                  <>
                    <div className="card-section-title" style={{ marginTop: 8 }}>Credit Settings</div>
                    <div className="grid-2" style={{ marginBottom: 16 }}>
                      <Field label="Credit Limit (Min)" value={cs.creditMin ? `$ ${Number(cs.creditMin).toLocaleString()}` : '—'} />
                      <Field label="Credit Limit (Max)" value={cs.creditMax ? `$ ${Number(cs.creditMax).toLocaleString()}` : '—'} />
                    </div>
                    <div className="grid-2" style={{ marginBottom: 16 }}>
                      <Field label="Purchase APR"  value={cs.purchaseApr  ? `${cs.purchaseApr}%` : '—'} />
                      <Field label="Billing Cycle" value={cs.billingCycle || '—'} />
                    </div>
                    <div className="grid-2">
                      <Field label="Grace Period" value={cs.gracePeriod ? `${cs.gracePeriod} days` : '—'} />
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          <div className="card">
            <div className="card-section-title">Customer Service</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Service Name" value={v(sub.svcName)} />
              <Field label="Phone" value={v(sub.svcPhone)} />
            </div>
            <div className="grid-2">
              <Field label="Email" value={v(sub.svcEmail)} />
              <Field label="Service Hours" value={v(sub.svcHours)} />
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Card Artwork &amp; Production</div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>Card Front Artwork</div>
                {sub.cardFrontArtwork?.previewUrl && sub.cardFrontArtwork.fileType !== 'image/svg+xml'
                  ? <img src={sub.cardFrontArtwork.previewUrl} alt="front" style={{ maxHeight: 80, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--fta-line-2)' }} />
                  : <div style={{ fontSize: 13, color: 'var(--fta-text-3)', fontStyle: 'italic' }}>{sub.cardFrontArtwork ? sub.cardFrontArtwork.fileName : 'Not configured'}</div>
                }
                {sub.cardFrontArtwork?.width && <div style={{ fontSize: 11.5, color: 'var(--fta-text-4)', marginTop: 4 }}>{sub.cardFrontArtwork.width} × {sub.cardFrontArtwork.height} px</div>}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>Card Back Artwork</div>
                {sub.cardBackArtwork?.previewUrl && sub.cardBackArtwork.fileType !== 'image/svg+xml'
                  ? <img src={sub.cardBackArtwork.previewUrl} alt="back" style={{ maxHeight: 80, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--fta-line-2)' }} />
                  : <div style={{ fontSize: 13, color: 'var(--fta-text-3)', fontStyle: 'italic' }}>{sub.cardBackArtwork ? sub.cardBackArtwork.fileName : 'Not configured'}</div>
                }
                {sub.cardBackArtwork?.width && <div style={{ fontSize: 11.5, color: 'var(--fta-text-4)', marginTop: 4 }}>{sub.cardBackArtwork.width} × {sub.cardBackArtwork.height} px</div>}
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <Field label="Card Material" value={v(sub.cardMaterial)} />
              <Field label="Form Factors" value={sub.formFactors?.length ? sub.formFactors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ') : v(sub.type)} />
            </div>
            <div className="grid-2">
              <Field label="Unit Price (USD)" value={sub.cardMaterialUnitPrice != null ? `$${Number(sub.cardMaterialUnitPrice).toFixed(2)} / card` : '—'} />
              <Field label="Card Quantity" value={sub.cardQuantity != null ? Number(sub.cardQuantity).toLocaleString() : '—'} />
            </div>
            {sub.cardTotalPrice != null && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--fta-fill-2)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-3)' }}>Estimated Total</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fta-text-1)' }}>${Number(sub.cardTotalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>

          {(() => {
            const legal = sub.legalTermsSnapshot
              || (sub.legalTermsPackageId ? AppData.approvedLegalTermsPackages.find(p => p.id === sub.legalTermsPackageId) : null);
            return (
              <div className="card">
                <div className="card-section-title">Approved Legal Terms</div>
                {!legal ? (
                  <div style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>Not configured</div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 20 }}>
                      {[
                        ['Package Name',  legal.name],
                        ['Version',       legal.version],
                        ['Issuer',        legal.issuer],
                        ['Market',        legal.market],
                        ['Network',       legal.network],
                        ['Product Type',  legal.productType],
                        ['Effective Date',legal.effectiveDate],
                        ['Approved By',   legal.approvedBy],
                        ['Last Updated',  legal.lastUpdated],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-1)' }}>{val || '—'}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Documents</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        ['Terms & Conditions',   legal.documents?.termsAndConditionsUrl],
                        ['Privacy Policy',        legal.documents?.privacyPolicyUrl],
                        ['Cardholder Agreement',  legal.documents?.cardholderAgreementUrl],
                      ].map(([label, url]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                          <span style={{ color: 'var(--fta-text-3)', minWidth: 180, flexShrink: 0 }}>{label}</span>
                          {url
                            ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fta-primary-6)', wordBreak: 'break-all', lineHeight: 1.4 }}>{url}</a>
                            : <span style={{ color: 'var(--fta-text-3)' }}>Not configured</span>
                          }
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </>
      )}

      {/* ── Cards tab ── */}
      {tab === 'cards' && <SubCardsTab sub={sub} navigate={navigate} program={parentProgram} />}

      {/* ── Files tab ── */}
      {tab === 'files' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
            <Icon name="file" size={28} />
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No files attached yet</div>
          <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 16 }}>Upload contracts, compliance documents, and card brand kits.</div>
          <button className="btn btn-primary"><Icon name="upload" size={14} />Upload File</button>
        </div>
      )}
    </div>
  );
}

function SubCardsTab({ sub, navigate, program }) {
  const [cardViewMode, setCardViewMode] = useState('grid');
  const [searchText,   setSearchText]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const allSubCards = AppData.cards.filter(c => c.subprogramId === sub.id);

  const filtered = allSubCards.filter(c => {
    const q = searchText.trim().toLowerCase();
    const matchSearch = !q
      || (c.cardName  || '').toLowerCase().includes(q)
      || (c.id        || '').toLowerCase().includes(q)
      || (c.cardCode  || '').toLowerCase().includes(q)
      || (c.binPrefix || '').includes(q);
    const matchStatus = statusFilter === 'All Status' || c.cardStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleCreateCard() {
    navigate('issue-card', { programId: sub.programId, subprogramId: sub.id, from: 'subprogram-cards' });
  }

  return (
    <>
      {/* ── Filter row ── */}
      <div className="card" style={{ padding: 16, marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 176 }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>Under Review</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </FilterField>
          <FilterField label="Date Range" style={{ width: 176 }}>
            <select defaultValue="All Time">
              <option>All Time</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setSearchText(''); setStatusFilter('All Status'); }}>Reset</button>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      {/* ── Main cards section ── */}
      <div className="card" style={{ padding: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--fta-line-2)' }}>
          <h2 style={{ margin: 0 }}>
            Cards
            <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span>
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="input" style={{ width: 220 }}>
              <Icon name="search" className="ico" />
              <input
                placeholder="Search name, ID, code…"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <CardViewBtn active={cardViewMode === 'grid'} onClick={() => setCardViewMode('grid')} title="Grid view">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/></svg>
            </CardViewBtn>
            <CardViewBtn active={cardViewMode === 'list'} onClick={() => setCardViewMode('list')} title="List view">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="2" width="13" height="2" rx="1" fill="currentColor"/><rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor"/><rect x="1" y="11" width="13" height="2" rx="1" fill="currentColor"/></svg>
            </CardViewBtn>
            <div style={{ width: 1, height: 22, background: 'var(--fta-line-2)' }} />
            <button className="btn btn-primary btn-sm" onClick={handleCreateCard}>
              <Icon name="plus" size={12} />Create Card
            </button>
          </div>
        </div>

        {/* Content */}
        {allSubCards.length === 0 ? (
          <CardEmptyState onCreateCard={handleCreateCard} />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fta-text-3)', fontSize: 13 }}>
            No cards match your filters.
          </div>
        ) : cardViewMode === 'grid' ? (
          <CardsGridView cards={filtered} program={program} navigate={navigate} />
        ) : (
          <CardsListView cards={filtered} navigate={navigate} />
        )}

        {/* Pagination footer */}
        {allSubCards.length > 0 && (
          <div className="table-foot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Total {filtered.length} items</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Pager />
              <select style={{ fontSize: 12, border: '1px solid var(--fta-line-2)', borderRadius: 4, padding: '3px 6px', color: 'var(--fta-text-3)', background: '#fff', cursor: 'pointer' }}>
                <option>30 / page</option>
                <option>50 / page</option>
                <option>100 / page</option>
              </select>
              <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>Go to</span>
              <input type="number" min={1} defaultValue={1} style={{ width: 44, fontSize: 12, border: '1px solid var(--fta-line-2)', borderRadius: 4, padding: '3px 6px', textAlign: 'center' }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── SubCardsTab helpers ─────────────────────────────────────── */

function CardViewBtn({ active, onClick, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{
      padding: '5px 8px',
      border: `1.5px solid ${active ? 'var(--fta-primary-6)' : 'var(--fta-line-2)'}`,
      borderRadius: 6,
      background: active ? 'var(--fta-primary-1)' : '#fff',
      color: active ? 'var(--fta-primary-6)' : 'var(--fta-text-3)',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'border-color .15s, background .15s, color .15s',
    }}>
      {children}
    </button>
  );
}

function CardEmptyState({ onCreateCard }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px' }}>
      <div style={{ width: 56, height: 56, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
        <Icon name="card" size={26} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No cards created yet.</div>
      <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20 }}>
        Create a card product definition for this sub-program.
      </div>
      <button className="btn btn-primary" onClick={onCreateCard}>
        <Icon name="plus" size={14} />Create Card
      </button>
    </div>
  );
}

function CardsGridView({ cards, program, navigate }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(228px, 1fr))',
      gap: 16,
      padding: 20,
    }}>
      {cards.map(card => <CardProductTile key={card.id} card={card} program={program} navigate={navigate} />)}
    </div>
  );
}

function CardProductTile({ card, program, navigate }) {
  const lastFour   = (card.binPrefix || '').slice(-4).padStart(4, '0') || '4142';
  const expDate    = deriveCardExpDate(card.validPeriod);
  const artwork    = card.artworkFront || program?.cardFrontArtwork;
  const hasArtwork = !!(artwork?.previewUrl && artwork.previewUrl !== '');
  const visual     = getCardPreviewVisual(card);
  const textColor  = hasArtwork ? '#FFFFFF'                : visual.textColor;
  const chipColor  = hasArtwork ? 'rgba(255,255,255,0.45)' : visual.chipColor;
  const decoAlpha1 = hasArtwork ? 'rgba(0,0,0,0.08)'       : visual.decoAlpha1;
  const decoAlpha2 = hasArtwork ? 'rgba(0,0,0,0.05)'       : visual.decoAlpha2;
  const badgeBg    = hasArtwork ? 'rgba(0,0,0,0.35)'        : visual.badgeBg;
  const statusDot  = card.cardStatus === 'Active' ? '#4ade80'
    : card.cardStatus === 'Under Review' ? '#fbbf24' : '#9ca3af';

  return (
    <div
      onClick={() => navigate?.('card-detail', { cardId: card.id, from: 'subprogram-cards' })}
      style={{
        ...(hasArtwork
          ? { backgroundImage: `url(${artwork.previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: visual.background }),
        borderRadius: 14,
        padding: '16px 18px 14px',
        color: textColor,
        aspectRatio: '1.586 / 1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        cursor: navigate ? 'pointer' : 'default',
      }}>
      {hasArtwork && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none', zIndex: 0 }} />
      )}
      {/* decorative circles */}
      <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: '50%', background: decoAlpha1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 28, top: 44,  width:  72, height:  72, borderRadius: '50%', background: decoAlpha2, pointerEvents: 'none' }} />

      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: badgeBg, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          {visual.isCredit ? 'Credit Card' : 'Debit Card'}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.85, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {program?.name || 'Card Program'}
        </span>
      </div>

      {/* chip (decorative) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: 28, height: 20, borderRadius: 4, background: chipColor }} />
      </div>

      {/* card number + product name */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 13.5, letterSpacing: '2px', fontWeight: 500 }}>
          **** **** **** {lastFour}
        </div>
        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {card.cardName}
        </div>
      </div>

      {/* bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 8.5, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>Valid Thru</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{expDate}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, justifyContent: 'flex-end' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot }} />
            <span style={{ fontSize: 9.5, fontWeight: 600, opacity: 0.9 }}>{card.cardStatus || 'Under Review'}</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-.3px', opacity: 0.95 }}>
            {card.network === 'Visa' ? 'VISA' : card.network === 'Mastercard' ? 'MC' : (card.network || '')}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardsListView({ cards, navigate }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Card No.</th>
          <th>Card Type</th>
          <th>Physical / Virtual</th>
          <th>Card ID</th>
          <th>Funding Method</th>
          <th>Card Product</th>
          <th>Created Date</th>
          <th style={{ textAlign: 'right' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {cards.map(c => {
          const lastFour  = (c.binPrefix || '').slice(-4).padStart(4, '0') || '4142';
          const ff        = c.formFactors;
          const formText  = ff?.length >= 2 ? 'Physical & Virtual'
            : ff?.[0] === 'physical' ? 'Physical Card'
            : ff?.[0] === 'virtual'  ? 'Virtual Card' : '—';
          const createdDate = c.createdAt
            ? new Date(c.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
            : '—';

          return (
            <tr key={c.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CardMiniThumb network={c.network} cardType={c.cardType} />
                  <span className="mono" style={{ fontSize: 12 }}>**** **** **** {lastFour}</span>
                </div>
              </td>
              <td>
                <span style={{
                  fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: c.cardType === 'credit' ? '#eff6ff' : '#f0fff4',
                  color:      c.cardType === 'credit' ? '#1e40af' : '#166534',
                }}>
                  {c.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
                </span>
              </td>
              <td style={{ fontSize: 13 }}>{formText}</td>
              <td className="mono muted" style={{ fontSize: 12 }}>{c.id}</td>
              <td style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>Just-in-Time Funding</td>
              <td style={{ fontWeight: 500 }}>{c.cardName}</td>
              <td className="muted">{createdDate}</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => navigate?.('card-detail', { cardId: c.id, from: 'subprogram-cards' })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12, fontWeight: 500 }}>View</button>
                  <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12, fontWeight: 500 }}>Lock</button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function CardMiniThumb({ network, cardType }) {
  const isCredit = !String(cardType || '').toLowerCase().includes('debit');
  const bg       = isCredit ? '#294A60' : '#CFCFCF';
  const textCol  = isCredit ? 'rgba(255,255,255,0.85)' : 'rgba(29,33,41,0.7)';
  return (
    <div style={{
      width: 36, height: 22, borderRadius: 4, flexShrink: 0,
      background: bg,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', bottom: 2, right: 3, fontSize: 6.5, fontWeight: 800, fontStyle: 'italic', color: textCol }}>
        {network === 'Visa' ? 'VISA' : network === 'Mastercard' ? 'MC' : (network?.[0] || '')}
      </div>
    </div>
  );
}

function deriveCardExpDate(validPeriod) {
  const match = (validPeriod || '').match(/(\d+)/);
  if (!match) return '12/27';
  const now  = new Date();
  const year = now.getFullYear() + parseInt(match[1]);
  return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(year).slice(-2)}`;
}

function cardNetworkGradient(network) {
  const map = {
    'Visa':             'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)',
    'Mastercard':       'linear-gradient(135deg, #4a0000 0%, #7b1a1a 50%, #c0392b 100%)',
    'UnionPay':         'linear-gradient(135deg, #1a3a1a 0%, #2e7d32 50%, #1b5e20 100%)',
    'American Express': 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #00796b 100%)',
  };
  return map[network] || 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)';
}

const CARD_CREDIT_GRADIENTS = [
  'linear-gradient(135deg, #294A60 0%, #0B1744 100%)',
  'linear-gradient(135deg, #3A3F46 0%, #1F2933 100%)',
  'linear-gradient(135deg, #5B5A55 0%, #2F3437 100%)',
  'linear-gradient(135deg, #526678 0%, #26384A 100%)',
];
const CARD_DEBIT_GRADIENT = 'linear-gradient(135deg, #E7E7E7 0%, #CFCFCF 100%)';

function cardIdHashSlot(id) {
  let h = 0;
  const s = String(id || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h % CARD_CREDIT_GRADIENTS.length;
}

function getCardPreviewVisual(card) {
  const artwork    = card.inheritedSubprogramSnapshot?.artworkFront;
  const hasArtwork = !!(artwork?.previewUrl && artwork.previewUrl !== '');
  const isCredit   = !String(card.cardType || card.cardTypeLabel || '').toLowerCase().includes('debit');
  if (hasArtwork) {
    return { type: 'artwork', url: artwork.previewUrl, isCredit };
  }
  return {
    type:       'gradient',
    background: isCredit ? CARD_CREDIT_GRADIENTS[cardIdHashSlot(card.id)] : CARD_DEBIT_GRADIENT,
    textColor:  isCredit ? '#FFFFFF'                : '#1D2129',
    chipColor:  isCredit ? 'rgba(255,255,255,0.45)' : 'rgba(29,33,41,0.45)',
    decoAlpha1: isCredit ? 'rgba(255,255,255,0.07)' : 'rgba(29,33,41,0.05)',
    decoAlpha2: isCredit ? 'rgba(255,255,255,0.05)' : 'rgba(29,33,41,0.04)',
    badgeBg:    isCredit ? 'rgba(255,255,255,0.2)'  : 'rgba(29,33,41,0.1)',
    isCredit,
  };
}

export function CardsView({ navigate }) {
  const [viewMode,       setViewMode]       = useState('grid');
  const [statusFilter,   setStatusFilter]   = useState('All Status');
  const [cardTypeFilter, setCardTypeFilter] = useState('All Types');
  const [networkFilter,  setNetworkFilter]  = useState('All Networks');
  const [searchText,     setSearchText]     = useState('');

  const allCards = AppData.cards;

  const filtered = allCards.filter(c => {
    const q = searchText.trim().toLowerCase();
    const matchSearch  = !q
      || (c.cardholderSnapshot?.name || '').toLowerCase().includes(q)
      || (c.last4 || '').includes(q)
      || (c.cardName || '').toLowerCase().includes(q);
    const matchStatus  = statusFilter   === 'All Status'   || c.cardStatus === statusFilter;
    const matchType    = cardTypeFilter === 'All Types'     || c.cardType   === cardTypeFilter;
    const matchNetwork = networkFilter  === 'All Networks'  || c.network    === networkFilter;
    return matchSearch && matchStatus && matchType && matchNetwork;
  });

  function handleReset() {
    setStatusFilter('All Status');
    setCardTypeFilter('All Types');
    setNetworkFilter('All Networks');
    setSearchText('');
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cards</h1>
          <div className="page-subtitle">All issued cards across all programs · {allCards.length.toLocaleString()} total</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('issue-card', { from: 'global-cards' })}>
          <Icon name="plus" size={14} />Create Card
        </button>
      </div>

      <div className="grid-3">
        <SmallStat label="Total Issued"      value={allCards.length}                                         icon="card"   tone="navy"  />
        <SmallStat label="Active"            value={allCards.filter(c => c.cardStatus === 'Active').length}  icon="circle" tone="green" />
        <SmallStat label="Frozen / Inactive" value={allCards.filter(c => c.cardStatus !== 'Active').length} icon="shield" tone="peach" />
      </div>

      {/* Filter row */}
      <div className="card" style={{ padding: 16, marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 160 }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>Active</option>
              <option>Frozen</option>
              <option>Inactive</option>
            </select>
          </FilterField>
          <FilterField label="Card Type" style={{ width: 160 }}>
            <select value={cardTypeFilter} onChange={e => setCardTypeFilter(e.target.value)}>
              <option>All Types</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
            </select>
          </FilterField>
          <FilterField label="Network" style={{ width: 160 }}>
            <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
              <option>All Networks</option>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>UnionPay</option>
              <option>American Express</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={handleReset}>Reset</button>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      {/* Cards section */}
      <div className="card" style={{ padding: 0 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--fta-line-2)' }}>
          <h2 style={{ margin: 0 }}>
            Cards
            <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span>
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="input" style={{ width: 240 }}>
              <Icon name="search" className="ico" />
              <input
                placeholder="Search holder, last 4, card name…"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <CardViewBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')} title="Grid view">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/></svg>
            </CardViewBtn>
            <CardViewBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} title="List view">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="2" width="13" height="2" rx="1" fill="currentColor"/><rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor"/><rect x="1" y="11" width="13" height="2" rx="1" fill="currentColor"/></svg>
            </CardViewBtn>
            <div style={{ width: 1, height: 22, background: 'var(--fta-line-2)' }} />
            <button className="btn btn-primary btn-sm" onClick={() => navigate('issue-card', { from: 'global-cards' })}>
              <Icon name="plus" size={12} />Create Card
            </button>
          </div>
        </div>

        {/* Content */}
        {allCards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <div style={{ width: 56, height: 56, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
              <Icon name="card" size={26} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No cards issued yet.</div>
            <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20 }}>Issue a card to a cardholder to get started.</div>
            <button className="btn btn-primary" onClick={() => navigate('issue-card', { from: 'global-cards' })}>
              <Icon name="plus" size={14} />Create Card
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fta-text-3)', fontSize: 13 }}>
            No cards match your filters.
          </div>
        ) : viewMode === 'grid' ? (
          <IssuedCardsGrid cards={filtered} navigate={navigate} />
        ) : (
          <IssuedCardsList cards={filtered} navigate={navigate} />
        )}

        {allCards.length > 0 && (
          <div className="table-foot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Total {filtered.length} items</span>
            <Pager />
          </div>
        )}
      </div>
    </div>
  );
}

function IssuedCardTile({ card, navigate }) {
  const last4      = card.last4 || (card.binPrefix || '').slice(-4).padStart(4, '0') || '0000';
  const visual     = getCardPreviewVisual(card);
  const hasArtwork = visual.type === 'artwork';
  const textColor  = hasArtwork ? '#FFFFFF'                : visual.textColor;
  const chipColor  = hasArtwork ? 'rgba(255,255,255,0.45)' : visual.chipColor;
  const decoAlpha1 = hasArtwork ? 'rgba(0,0,0,0.08)'       : visual.decoAlpha1;
  const decoAlpha2 = hasArtwork ? 'rgba(0,0,0,0.05)'       : visual.decoAlpha2;
  const badgeBg    = hasArtwork ? 'rgba(0,0,0,0.35)'        : visual.badgeBg;
  const statusDot  = card.cardStatus === 'Active' ? '#4ade80'
    : card.cardStatus === 'Frozen' ? '#f97316' : '#9ca3af';
  const expDate = card.expirationDate
    ? (() => { const d = new Date(card.expirationDate); return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`; })()
    : '—';
  const programName = card.inheritedSubprogramSnapshot?.programName || '';

  return (
    <div
      onClick={() => navigate('card-detail', { cardId: card.id, from: 'cards' })}
      style={{
        ...(hasArtwork
          ? { backgroundImage: `url(${visual.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: visual.background }),
        borderRadius: 14, padding: '16px 18px 14px', color: textColor,
        aspectRatio: '1.586 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', overflow: 'hidden',
        cursor: 'pointer',
      }}>
      {hasArtwork && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none', zIndex: 0 }} />
      )}
      <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: '50%', background: decoAlpha1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 28, top: 44, width: 72, height: 72, borderRadius: '50%', background: decoAlpha2, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: badgeBg, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          {visual.isCredit ? 'Credit' : 'Debit'}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.85, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {programName}
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 1, fontSize: 11.5, fontWeight: 600, opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {card.cardholderSnapshot?.name || '—'}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: 28, height: 20, borderRadius: 4, background: chipColor, marginBottom: 6 }} />
        <div style={{ fontFamily: 'monospace', fontSize: 13.5, letterSpacing: '2px', fontWeight: 500 }}>
          **** **** **** {last4}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 8.5, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>Valid Thru</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{expDate}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, justifyContent: 'flex-end' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot }} />
            <span style={{ fontSize: 9.5, fontWeight: 600, opacity: 0.9 }}>{card.cardStatus || 'Active'}</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-.3px', opacity: 0.95 }}>
            {card.network === 'Visa' ? 'VISA' : card.network === 'Mastercard' ? 'MC' : (card.network || '')}
          </div>
        </div>
      </div>
    </div>
  );
}

function IssuedCardsGrid({ cards, navigate }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(228px, 1fr))', gap: 16, padding: 20 }}>
      {cards.map(card => <IssuedCardTile key={card.id} card={card} navigate={navigate} />)}
    </div>
  );
}

function IssuedCardsList({ cards, navigate }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Card Number</th>
          <th>Card Holder</th>
          <th>Network</th>
          <th>Card Type</th>
          <th>Form Factor</th>
          <th>Program</th>
          <th>Status</th>
          <th>Created</th>
          <th style={{ textAlign: 'right' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {cards.map(c => {
          const last4 = c.last4 || (c.binPrefix || '').slice(-4).padStart(4, '0') || '0000';
          const createdDate = c.createdAt
            ? new Date(c.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
            : '—';
          const ff = c.formFactors;
          const formText = ff?.length >= 2 ? 'Physical & Virtual'
            : ff?.[0] === 'physical' ? 'Physical' : ff?.[0] === 'virtual' ? 'Virtual' : '—';
          return (
            <tr key={c.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CardMiniThumb network={c.network} cardType={c.cardType} />
                  <span className="mono" style={{ fontSize: 12 }}>**** **** **** {last4}</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ColorAvatar name={c.cardholderSnapshot?.name || '?'} size="sm" />
                  <span>{c.cardholderSnapshot?.name || '—'}</span>
                </div>
              </td>
              <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={c.network} />{c.network}</span></td>
              <td>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: c.cardType === 'credit' ? '#eff6ff' : '#f0fff4', color: c.cardType === 'credit' ? '#1e40af' : '#166534' }}>
                  {c.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
                </span>
              </td>
              <td style={{ fontSize: 13 }}>{formText}</td>
              <td style={{ fontWeight: 500, fontSize: 12 }}>{c.inheritedSubprogramSnapshot?.programName || '—'}</td>
              <td><StatusPill status={c.cardStatus} /></td>
              <td className="muted">{createdDate}</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => navigate('card-detail', { cardId: c.id, from: 'cards' })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12, fontWeight: 500 }}>View</button>
                  <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12, fontWeight: 500 }}>Lock</button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const SAMPLE_TXN_MERCHANTS = [
  'Amazon', 'Starbucks', 'Uber', 'Whole Foods', 'Netflix', 'Apple', 'Target',
  'Costco', 'Shell', 'CVS Pharmacy', 'Home Depot', 'Lyft', 'Trader Joe\'s', 'Best Buy',
];
const SAMPLE_TXN_CATEGORIES = [
  'Shopping', 'Food & Beverage', 'Transportation', 'Groceries', 'Streaming', 'Technology',
  'Retail', 'Wholesale', 'Gas & Auto', 'Healthcare', 'Home Improvement', 'Transportation',
  'Groceries', 'Electronics',
];

export function TransactionsView({ navigate }) {
  const txns = AppData.customers.flatMap((c, ci) =>
    Array.from({ length: 6 }, (_, i) => ({
      id: `txn-${ci}-${i}`,
      holder: c.name,
      merchant: SAMPLE_TXN_MERCHANTS[(ci * 6 + i) % SAMPLE_TXN_MERCHANTS.length],
      category: SAMPLE_TXN_CATEGORIES[(ci * 6 + i) % SAMPLE_TXN_CATEGORIES.length],
      amount: Math.round((12 + (ci * 7 + i * 13) % 400) * 100) / 100,
      last4: String(1234 + ci * 7 + i * 3).slice(-4),
      network: i % 2 === 0 ? 'Visa' : 'Mastercard',
      date: `04/${String(1 + (ci * 6 + i) % 28).padStart(2, '0')}/2024`,
      type: i % 5 === 0 ? 'Refund' : 'Purchase',
      status: i % 9 === 0 ? 'Pending' : 'Settled',
    }))
  );

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <div className="page-subtitle">All settled and pending transactions · April 2024</div>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={14} />Export</button>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 160 }}>
            <select><option>All Status</option><option>Settled</option><option>Pending</option></select>
          </FilterField>
          <FilterField label="Type" style={{ width: 160 }}>
            <select><option>All</option><option>Purchase</option><option>Refund</option></select>
          </FilterField>
          <FilterField label="Network" style={{ width: 160 }}>
            <select><option>All</option><option>Visa</option><option>Mastercard</option></select>
          </FilterField>
          <FilterField label="Date" style={{ width: 200 }}>
            <select><option>April 2024</option><option>March 2024</option><option>Last 30 days</option></select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Transaction List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({txns.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 300 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search merchant, holder, card" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Card Holder</th><th>Merchant</th><th>Category</th><th>Card</th>
              <th style={{ textAlign: 'right' }}>Amount</th><th>Date</th><th>Type</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {txns.slice(0, 30).map(t => (
              <tr key={t.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ColorAvatar name={t.holder} size="sm" /><span>{t.holder}</span></div></td>
                <td style={{ fontWeight: 500 }}>{t.merchant}</td>
                <td><span style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{t.category}</span></td>
                <td><div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={t.network} /><span className="mono">·· {t.last4}</span></div></td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>${t.amount.toFixed(2)}</td>
                <td className="muted">{t.date}</td>
                <td><span className={"pill " + (t.type === 'Refund' ? '--success' : '--info')}>{t.type}</span></td>
                <td><StatusPill status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Showing 30 of {txns.length}</span><Pager /></div>
      </div>
    </div>
  );
}

export function FraudView({ navigate }) {
  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fraud Monitoring</h1>
          <div className="page-subtitle">Suspicious activity and fraud alerts · Real-time monitoring</div>
        </div>
        <button className="btn btn-primary"><Icon name="shield" size={14} />Configure Rules</button>
      </div>

      <div className="grid-3">
        <SmallStat label="Active Alerts" value={AppData.fraud.filter(f => f.status === 'Alert').length} icon="circle" tone="peach" />
        <SmallStat label="Under Review" value={AppData.fraud.filter(f => f.status === 'Review').length} icon="eye" tone="navy" />
        <SmallStat label="Cleared" value={AppData.fraud.filter(f => f.status === 'Cleared').length} icon="shield" tone="green" />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Fraud Alerts <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({AppData.fraud.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 280 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by name, merchant, card" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Cardholder</th><th>Card</th><th>Merchant</th><th>Reason</th>
              <th style={{ textAlign: 'right' }}>Amount</th><th style={{ textAlign: 'right' }}>Risk Score</th>
              <th>Status</th><th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {AppData.fraud.map(f => (
              <tr key={f.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ColorAvatar name={f.name} size="sm" /><span>{f.name}</span></div></td>
                <td className="mono">·· {f.card}</td>
                <td>{f.merchant}</td>
                <td><span style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{f.reason}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>${f.amount.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{
                    fontWeight: 700, fontSize: 13,
                    color: f.score >= 80 ? 'var(--fta-error)' : f.score >= 50 ? 'var(--fta-warning)' : 'var(--fta-success)'
                  }}>{f.score}</span>
                </td>
                <td><StatusPill status={f.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-ghost">Review</button>
                    <button className="btn btn-sm btn-ghost">Block</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {AppData.fraud.length} items</span><Pager /></div>
      </div>
    </div>
  );
}
