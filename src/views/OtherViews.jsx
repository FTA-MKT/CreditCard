import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, FilterField, Field, Pager, NetworkMark, SmallStat, ProgramLogo } from '../components/shared';
import AppData from '../data/AppData';
import { LayoutGrid, List, Plus, Search, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { DataTableWorkbench, DataTableFilters, DataTableFilterField, DataTableFilterLabel } from '../components/business/data-display/DataTableWorkbench';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';
import { DataTableFilterActions } from '../components/business/data-display/DataTableFilterActions';
import { ArtworkDetailBlock } from '../components/forms/ArtworkPreview';

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

// ── Nested Program List ──────────────────────────────────────────
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

const NESTED_STATUS_BADGE_VARIANT = {
  Active: 'success',
  Inactive: 'secondary',
  'Under Review': 'warning',
};

function NestedProgramStatusBadge({ status }) {
  return <Badge variant={NESTED_STATUS_BADGE_VARIANT[status] || 'secondary'}>{status}</Badge>;
}

function MerchantIdTags({ ids, max = 3 }) {
  const shown = ids.slice(0, max);
  const rest = ids.length - shown.length;
  const tagStyle = { fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: '#f1f5f9', color: 'var(--fta-text-4)' };
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
      {shown.map(id => <span key={id} style={tagStyle}>{id}</span>)}
      {rest > 0 && <span style={tagStyle}>+{rest}</span>}
    </span>
  );
}

function mapNestedProgram(sub, statusOverride) {
  return {
    id: sub.id,
    name: sub.name || 'Demo Nested Program Name',
    status: statusOverride || sub.status || 'Active',
    accountName: sub.accountName || sub.financialProductSnapshot?.name || 'Finbank Saving Account 2222',
    validThrough: sub.validThrough || '07/03/2024 - 10/01/2024',
    merchantIds: sub.merchantIds || ['5546111', '5546333', '5546123', '5546128', '5546199', '5546201'],
  };
}

function NestedProgramListView({ navigate }) {
  const [viewMode, setViewMode] = useState('grid');
  const [statusOverrides, setStatusOverrides] = useState({});
  const [toast, showToast] = useToast();

  const data = AppData.subPrograms.map(sub => mapNestedProgram(sub, statusOverrides[sub.id]));

  const state = useDataTableState({
    data,
    initialFilters: { status: '' },
    searchPredicate: (item, q) =>
      item.name.toLowerCase().includes(q) ||
      item.accountName.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.merchantIds.some(m => m.toLowerCase().includes(q)),
    filterPredicate: (item, filters) => !filters.status || item.status === filters.status,
  });

  function handleReset() {
    state.setSearch('');
    state.resetFilters();
  }

  function toggleStatus(item) {
    const next = item.status === 'Inactive' ? 'Active' : 'Inactive';
    setStatusOverrides(prev => ({ ...prev, [item.id]: next }));
    showToast(next === 'Active' ? 'Nested program activated' : 'Nested program deactivated');
  }

  const actions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Button
        variant={viewMode === 'grid' ? 'outline' : 'ghost'}
        size="icon-sm"
        title="Grid view"
        onClick={() => setViewMode('grid')}
      >
        <LayoutGrid size={15} />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'outline' : 'ghost'}
        size="icon-sm"
        title="List view"
        onClick={() => setViewMode('list')}
      >
        <List size={15} />
      </Button>
      <Button onClick={() => showToast('Create nested program flow is not available in this prototype')}>
        <Plus size={14} />
        Create Nested Program
      </Button>
    </div>
  );

  const searchProps = {
    value: state.search,
    onChange: state.setSearch,
    placeholder: 'Search name, account, merchant ID',
  };

  const footerProps = {
    totalLabel: `Total ${state.totalRows} items`,
    currentPage: state.safeCurrentPage,
    totalPages: state.totalPages,
    pageItems: state.pageItems,
    onPageChange: state.setCurrentPage,
    pageSize: { value: state.pageSize, onValueChange: state.setPageSize, options: ['10', '20', '50'] },
    goTo: { value: state.goToValue, onValueChange: state.setGoToValue, onCommit: state.commitGoTo },
  };

  return (
    <div className="content-inner fade-in">
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Status</span>
              <div className="select" style={{ width: 180 }}>
                <select value={state.filters.status} onChange={e => state.setFilter('status', e.target.value)}>
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset</button>
            <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => showToast('Filters applied.')}>
              <Search size={13} />Search
            </button>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
      </div>

      {viewMode === 'grid' ? (
        <DataTableWorkbench title="Nested Program List" search={searchProps} actions={actions} surfaceVariant="embedded" {...footerProps}>
          <div className="grid-3">
            {state.pageRows.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--fta-text-3)', padding: 40 }}>
                No nested programs match the current filters.
              </div>
            ) : state.pageRows.map(item => (
              <div
                key={item.id}
                className="card"
                style={{ position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: 14, right: 14, color: 'var(--fta-text-3)' }}>
                  <MoreVertical size={16} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingRight: 24 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--fta-text-5)' }}>{item.name}</span>
                  <NestedProgramStatusBadge status={item.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <ProgramLogo size={22} />
                  <span style={{ fontSize: 13, color: 'var(--fta-text-4)' }}>{item.accountName}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fta-text-3)', marginBottom: 4 }}>VALID THROUGH</div>
                  <div style={{ fontSize: 13 }}>{item.validThrough}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fta-text-3)', marginBottom: 4 }}>MERCHANT ID</div>
                  <MerchantIdTags ids={item.merchantIds} />
                </div>
              </div>
            ))}
          </div>
        </DataTableWorkbench>
      ) : (
        <StandardDataTable
          title="Nested Program List"
          search={searchProps}
          actions={actions}
          state={state}
          showGoTo
          tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
          header={
            <TableHeader>
              <TableRow>
                <TableHead columnId="np-name">Nested Program Name</TableHead>
                <TableHead columnId="np-merchant">Merchant ID</TableHead>
                <TableHead columnId="np-status">Status</TableHead>
                <TableHead columnId="np-accounts">Accounts</TableHead>
                <TableHead columnId="np-valid">Valid Through</TableHead>
                <TableActionHead />
              </TableRow>
            </TableHeader>
          }
          renderRows={(tableState) =>
            tableState.pageRows.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </TableCell>
                <TableCell><MerchantIdTags ids={item.merchantIds} /></TableCell>
                <TableCell><SubStatusDot status={item.status} /></TableCell>
                <TableCell>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <ProgramLogo size={24} />{item.accountName}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.validThrough}</TableCell>
                <TableActionCell>
                  <button
                    className="text-sm text-primary hover:underline whitespace-nowrap"
                    onClick={(e) => { e.stopPropagation(); toggleStatus(item); }}
                  >
                    {item.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                  </button>
                </TableActionCell>
              </TableRow>
            ))
          }
          emptyState={<DataTableEmptyStateRow colSpan={6} />}
        />
      )}

      <ToastBanner message={toast} />
    </div>
  );
}

export function NestedProgramView({ navigate, navParam }) {
  const subId      = navParam && typeof navParam === 'object' ? navParam.id   : navParam;
  const from       = navParam && typeof navParam === 'object' ? navParam.from : 'program';
  const initialTab = navParam && typeof navParam === 'object' && navParam.tab ? navParam.tab : 'details';

  const [tab, setTab] = useState(initialTab);

  const sub = AppData.subPrograms.find(s => s.id === subId);
  if (!sub) return <NestedProgramListView navigate={navigate} />;

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
              <span style={{ fontWeight: 600, fontSize: 13.5, color: '#333333', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent' }}
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
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-9">
          <TabsTrigger value="details"><Icon name="list" className="ico" />Sub-program Details</TabsTrigger>
          <TabsTrigger value="cards"><Icon name="card" className="ico" />Cards</TabsTrigger>
          <TabsTrigger value="files"><Icon name="file" className="ico" />Files</TabsTrigger>
        </TabsList>
      </Tabs>

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

          {/* Financial Product + Credit Terms */}
          {(() => {
            // Priority: new financialProductSnapshot → new id lookup → old financialAccountSnapshot → old id lookup
            const snap = sub.financialProductSnapshot
              ?? (sub.financialProductId ? AppData.financialProducts.find(a => a.id === sub.financialProductId) ?? null : null)
              ?? sub.financialAccountSnapshot
              ?? (sub.financialAccountId ? AppData.financialProducts.find(a => a.id === sub.financialAccountId) ?? null : null);
            const hasLegacy = sub.creditMin || sub.creditMax || sub.purchaseApr || sub.billingCycle || sub.gracePeriod;
            const cs = snap ?? (hasLegacy ? sub : null);
            const productType = snap ? (snap.productType ?? snap.type ?? '—') : null;
            return (
              <div className="card">
                <div className="card-section-title">Financial Product</div>
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <Field label="Product Name" value={snap ? snap.name        : 'Not configured'} />
                  <Field label="Product Type" value={snap ? productType      : 'Not configured'} />
                </div>
                <div className="grid-2" style={{ marginBottom: cs ? 16 : 0 }}>
                  <Field label="Currency" value={snap ? snap.currency : 'Not configured'} />
                </div>
                {cs && (
                  <>
                    <div className="card-section-title" style={{ marginTop: 8 }}>Credit Terms</div>
                    <div className="grid-2" style={{ marginBottom: 16 }}>
                      <Field label="Credit Limit Range (Min, USD)" value={cs.creditMin ? `$ ${Number(cs.creditMin).toLocaleString()}` : '—'} />
                      <Field label="Credit Limit Range (Max, USD)" value={cs.creditMax ? `$ ${Number(cs.creditMax).toLocaleString()}` : '—'} />
                    </div>
                    <div className="grid-2" style={{ marginBottom: 16 }}>
                      <Field label="Purchase APR (%)"  value={cs.purchaseApr  ? `${cs.purchaseApr}%` : '—'} />
                      <Field label="Billing Cycle" value={cs.billingCycle || '—'} />
                    </div>
                    <div className="grid-2">
                      <Field label="Grace Period (days)" value={cs.gracePeriod ? `${cs.gracePeriod} days` : '—'} />
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {(() => {
            const fmtLimit = (entry) => (entry && entry.enabled && entry.amount)
              ? `${entry.currency || 'USD'} ${Number(entry.amount).toLocaleString()}`
              : 'Not configured';
            const l = sub.limits || {};
            return (
              <div className="card">
                <div className="card-section-title">Spending Limits</div>
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <Field label="Per-Transaction Limit" value={fmtLimit(l.perTxn)} />
                  <Field label="Daily Limit" value={fmtLimit(l.daily)} />
                </div>
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <Field label="Weekly Limit" value={fmtLimit(l.weekly)} />
                  <Field label="Monthly Limit" value={fmtLimit(l.monthly)} />
                </div>
                <div className="grid-2">
                  <Field label="ATM Limit" value={fmtLimit(l.atm)} />
                </div>
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
              <ArtworkDetailBlock artwork={sub.cardFrontArtwork} label="Card Front Artwork" />
              <ArtworkDetailBlock artwork={sub.cardBackArtwork} label="Card Back Artwork" />
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
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fta-text-5)' }}>${Number(sub.cardTotalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-5)' }}>{val || '—'}</div>
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

          <div className="card">
            <div className="card-section-title">Rewards Program</div>
            {(() => {
              const config = AppData.rewardsConfigurations?.find(c => c.subprogramId === sub.id);
              const prog = config || (sub.rewardsEnabled ? sub.rewardsProgram : null);
              const isNewSchema = !!(prog?.programName);

              if (!prog) {
                return <div style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>Rewards not enabled for this sub-program.</div>;
              }

              if (isNewSchema) {
                const timingLabel = prog.postingTiming === 'after_clearing' ? 'After transaction clearing'
                  : prog.postingTiming === 'after_statement' ? 'After statement generation'
                  : prog.postingTiming === 'settlement' ? 'After transaction clearing'
                  : prog.postingTiming === 'billing_cycle' ? 'After statement generation'
                  : prog.postingTiming || '—';
                const accrualLabel = prog.accrualBasis === 'purchase_based' ? 'Purchase based'
                  : prog.accrualBasis === 'payment_based' ? 'Payment based' : null;
                const baseRate = prog.baseEarningRate?.value ?? prog.baseEarningRule?.multiplier ?? 1;
                const earningRules = prog.earningRules ?? prog.bonusEarningRules ?? [];
                let scEnabled = false, conversionDisplay = '—', minIncrementDisplay = '—';
                if (Array.isArray(prog.redemptionMethods)) {
                  const sc = prog.redemptionMethods.find(m => m.type === 'statement_credit' && m.enabled);
                  scEnabled = !!sc;
                  if (sc?.conversion) conversionDisplay = `${sc.conversion.points.toLocaleString()} pts = $${sc.conversion.amount.toFixed(2)} ${sc.conversion.currency || 'USD'}`;
                  if (sc?.minimumIncrement) minIncrementDisplay = `Every ${sc.minimumIncrement.toLocaleString()} pts`;
                } else if (prog.redemptionMethods?.statementCredit) {
                  scEnabled = prog.redemptionMethods.statementCredit.enabled;
                  if (prog.conversionRate != null) conversionDisplay = `1 pt = $${Number(prog.conversionRate).toFixed(2)}`;
                  if (prog.minimumRedemptionIncrement != null) minIncrementDisplay = `Every ${Number(prog.minimumRedemptionIncrement).toLocaleString()} pts`;
                }
                return (
                  <>
                    <div className="grid-2" style={{ marginBottom: 16 }}>
                      <Field label="Program Name" value={prog.programName || '—'} />
                      <Field label="Posting Timing" value={timingLabel} />
                    </div>
                    {accrualLabel && (
                      <div style={{ marginBottom: 16 }}>
                        <Field label="Accrual Basis" value={accrualLabel} />
                      </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Earning Rules</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--fta-fill-2)', borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
                        <span style={{ fontWeight: 700, minWidth: 32, color: 'var(--fta-primary-6)' }}>{baseRate}×</span>
                        <span>Base — All eligible purchases</span>
                        <span style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>({baseRate}x points per $1)</span>
                      </div>
                      {earningRules.map(rule => (
                        <div key={rule.id || rule.category || rule.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--fta-fill-2)', borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
                          <span style={{ fontWeight: 700, minWidth: 32, color: 'var(--fta-primary-6)' }}>{rule.multiplier}×</span>
                          <span style={{ fontWeight: 500 }}>{rule.name || rule.category}</span>
                          {rule.mccCodes?.length > 0 && (
                            <span style={{ fontSize: 11, color: 'var(--fta-text-3)', marginLeft: 4 }}>MCC: {rule.mccCodes.join(', ')}</span>
                          )}
                        </div>
                      ))}
                      {!earningRules.length && (
                        <div style={{ fontSize: 12, color: 'var(--fta-text-3)', paddingLeft: 4 }}>No bonus categories configured.</div>
                      )}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Redemption Methods</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {scEnabled && <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: 'var(--fta-primary-1)', color: 'var(--fta-primary-7)' }}>Statement Credit</span>}
                        {!scEnabled && <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>—</span>}
                      </div>
                    </div>
                    <div className="grid-2">
                      <Field label="Conversion Rate" value={conversionDisplay} />
                      <Field label="Minimum Redemption" value={minIncrementDisplay} />
                    </div>
                  </>
                );
              }

              // Legacy schema fallback
              return (
                <>
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    <Field label="Reward Name" value={prog.name || '—'} />
                    <Field label="Reward Type" value={prog.type || '—'} />
                  </div>
                  {prog.description && (
                    <div style={{ marginBottom: 16 }}>
                      <Field label="Description" value={prog.description} />
                    </div>
                  )}
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    <Field label="Earn Rate" value={prog.earnRate || '—'} />
                    <Field label="Spend Rule" value={prog.spendRule || '—'} />
                  </div>
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    <Field label="Reward Period" value={prog.period || '—'} />
                    <Field label="Event Rule" value={prog.eventRule || '—'} />
                  </div>
                  {prog.mccRules?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <Field label="MCC Rules" value={prog.mccRules.join(', ')} />
                    </div>
                  )}
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    <Field label="Redemption Options" value={prog.redemptionOptions?.join(', ') || '—'} />
                    <Field label="Redemption Threshold" value={prog.redemptionThreshold || '—'} />
                  </div>
                  {prog.pointsExpiry && <Field label="Points Expiry" value={prog.pointsExpiry} />}
                </>
              );
            })()}
          </div>
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

  function handleIssueCard() {
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
            <button className="btn btn-primary btn-sm" onClick={handleIssueCard}>
              <Icon name="plus" size={12} />Issue Card
            </button>
          </div>
        </div>

        {/* Content */}
        {allSubCards.length === 0 ? (
          <CardEmptyState onIssueCard={handleIssueCard} />
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

function CardEmptyState({ onIssueCard }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px' }}>
      <div style={{ width: 56, height: 56, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
        <Icon name="card" size={26} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No cards issued yet.</div>
      <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20 }}>
        Issue a card to a cardholder under this sub-program.
      </div>
      <button className="btn btn-primary" onClick={onIssueCard}>
        <Icon name="plus" size={14} />Issue Card
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

  const allCards = AppData.cards;

  const filteredData = allCards.filter(c => {
    const matchStatus  = statusFilter   === 'All Status'   || c.cardStatus === statusFilter;
    const matchType    = cardTypeFilter === 'All Types'     || c.cardType   === cardTypeFilter;
    const matchNetwork = networkFilter  === 'All Networks'  || c.network    === networkFilter;
    return matchStatus && matchType && matchNetwork;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (c, q) =>
      (c.cardholderSnapshot?.name || '').toLowerCase().includes(q) ||
      (c.last4 || '').includes(q) ||
      (c.cardName || '').toLowerCase().includes(q),
  });

  function handleReset() {
    setStatusFilter('All Status');
    setCardTypeFilter('All Types');
    setNetworkFilter('All Networks');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cards</h1>
          <div className="page-subtitle">All issued cards across all programs · {allCards.length.toLocaleString()} total</div>
        </div>
      </div>

      <div className="grid-3">
        <SmallStat label="Total Issued"      value={allCards.length}                                         icon="card"   tone="navy"  />
        <SmallStat label="Active"            value={allCards.filter(c => c.cardStatus === 'Active').length}  icon="circle" tone="green" />
        <SmallStat label="Frozen / Inactive" value={allCards.filter(c => c.cardStatus !== 'Active').length} icon="shield" tone="peach" />
      </div>

      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>Status</DataTableFilterLabel>
          <div className="select">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>Active</option>
              <option>Frozen</option>
              <option>Inactive</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Card Type</DataTableFilterLabel>
          <div className="select">
            <select value={cardTypeFilter} onChange={e => setCardTypeFilter(e.target.value)}>
              <option>All Types</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Network</DataTableFilterLabel>
          <div className="select">
            <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
              <option>All Networks</option>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>UnionPay</option>
              <option>American Express</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterActions onReset={handleReset} />
      </DataTableFilters>
      <div className="filter-divider" />

      <DataTableWorkbench
        title="Cards"
        surfaceVariant={viewMode === 'grid' ? 'embedded' : 'default'}
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search holder, last 4, card name…',
        }}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CardViewBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')} title="Grid view">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/></svg>
            </CardViewBtn>
            <CardViewBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} title="List view">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="2" width="13" height="2" rx="1" fill="currentColor"/><rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor"/><rect x="1" y="11" width="13" height="2" rx="1" fill="currentColor"/></svg>
            </CardViewBtn>
            <Button onClick={() => navigate('issue-card', { from: 'global-cards' })}>
              <Plus size={14} />
              Issue Card
            </Button>
          </div>
        }
        totalLabel={`Total ${state.totalRows} items`}
        currentPage={state.safeCurrentPage}
        totalPages={state.totalPages}
        pageItems={state.pageItems}
        onPageChange={state.setCurrentPage}
        pageSize={{ value: state.pageSize, onValueChange: state.setPageSize, options: ['10', '20', '50'] }}
      >
        {allCards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <div style={{ width: 56, height: 56, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
              <Icon name="card" size={26} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No cards issued yet.</div>
            <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20 }}>Issue a card to a cardholder to get started.</div>
            <button className="btn btn-primary" onClick={() => navigate('issue-card', { from: 'global-cards' })}>
              <Icon name="plus" size={14} />Issue Card
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          state.pageRows.length > 0 ? (
            <IssuedCardsGrid cards={state.pageRows} navigate={navigate} />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fta-text-3)', fontSize: 13 }}>
              No cards match your filters.
            </div>
          )
        ) : (
          <Table framed={false} widthBehavior="fill" showColumnBorders={false}>
            <TableHeader>
              <TableRow>
                <TableHead columnId="card-number">Card Number</TableHead>
                <TableHead columnId="card-holder">Card Holder</TableHead>
                <TableHead columnId="card-network">Network</TableHead>
                <TableHead columnId="card-type">Card Type</TableHead>
                <TableHead columnId="card-form-factor">Form Factor</TableHead>
                <TableHead columnId="card-program">Program</TableHead>
                <TableHead columnId="card-status">Status</TableHead>
                <TableHead columnId="card-created">Created</TableHead>
                <TableActionHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.pageRows.length > 0
                ? <IssuedCardsRows cards={state.pageRows} navigate={navigate} />
                : <DataTableEmptyStateRow colSpan={9} />}
            </TableBody>
          </Table>
        )}
      </DataTableWorkbench>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(228px, 1fr))', gap: 16 }}>
      {cards.map(card => <IssuedCardTile key={card.id} card={card} navigate={navigate} />)}
    </div>
  );
}

function IssuedCardsRows({ cards, navigate }) {
  return cards.map(c => {
    const last4 = c.last4 || (c.binPrefix || '').slice(-4).padStart(4, '0') || '0000';
    const createdDate = c.createdAt
      ? new Date(c.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
      : '—';
    const ff = c.formFactors;
    const formText = ff?.length >= 2 ? 'Physical & Virtual'
      : ff?.[0] === 'physical' ? 'Physical' : ff?.[0] === 'virtual' ? 'Virtual' : '—';
    return (
      <TableRow key={c.id}>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CardMiniThumb network={c.network} cardType={c.cardType} />
            <span className="mono" style={{ fontSize: 12 }}>**** **** **** {last4}</span>
          </div>
        </TableCell>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ColorAvatar name={c.cardholderSnapshot?.name || '?'} size="sm" />
            <span>{c.cardholderSnapshot?.name || '—'}</span>
          </div>
        </TableCell>
        <TableCell><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={c.network} />{c.network}</span></TableCell>
        <TableCell>
          <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: c.cardType === 'credit' ? '#eff6ff' : '#f0fff4', color: c.cardType === 'credit' ? '#1e40af' : '#166534' }}>
            {c.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
          </span>
        </TableCell>
        <TableCell style={{ fontSize: 13 }}>{formText}</TableCell>
        <TableCell style={{ fontWeight: 500, fontSize: 12 }}>{c.inheritedSubprogramSnapshot?.programName || '—'}</TableCell>
        <TableCell><StatusPill status={c.cardStatus} /></TableCell>
        <TableCell className="muted">{createdDate}</TableCell>
        <TableActionCell>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => navigate('card-detail', { cardId: c.id, from: 'cards' })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12, fontWeight: 500 }}>View</button>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12, fontWeight: 500 }}>Lock</button>
          </div>
        </TableActionCell>
      </TableRow>
    );
  });
}

const TXN_STATUS_TONE = { Posted: 'success', Pending: 'info', Declined: 'danger', Refunded: 'info', Reversed: 'warning' };
function TxnStatusBadge({ status }) {
  const tone = TXN_STATUS_TONE[status] || 'inactive';
  return <span className={`pill --${tone}`}><span className="dot" />{status}</span>;
}

const TXN_TYPE_TONE = { Purchase: 'info', Refund: 'success', 'Authorization Hold': 'warning', Reversal: 'inactive' };
function TxnTypeBadge({ type }) {
  const tone = TXN_TYPE_TONE[type] || 'inactive';
  return <span className={`pill --${tone}`}>{type}</span>;
}

const TXN_REFERENCE_DATE = new Date('2026-06-01');
function parseTxnDate(str) {
  const [m, d, y] = str.split('/');
  return new Date(`${y}-${m}-${d}`);
}

// A transaction is "disputed" / "fraud flagged" when it matches a disputes[] / fraud[]
// record on cardholder + merchant + amount (see the AppData.transactions comment).
function findLinkedDispute(t) {
  return AppData.disputes.find(d => d.holder === t.holder && d.merchant === t.merchant && Math.abs(d.amount - t.amount) < 0.01);
}
function findLinkedFraud(t) {
  return AppData.fraud.find(f => f.name === t.holder && f.merchant === t.merchant && Math.abs(f.amount - t.amount) < 0.01);
}
function findTxnCard(t) {
  return t.cardId ? AppData.cards.find(c => c.id === t.cardId) : null;
}

function declineDetailsFor(t, fraudHit) {
  if (fraudHit) return { reason: fraudHit.reason, code: 'FRAUD-BLOCK', response: 'Pick Up Card' };
  if (t.category === 'Cash Advance') return { reason: 'Cash advance limit exceeded', code: '61', response: 'Exceeds Withdrawal Limit' };
  return { reason: 'Do not honor', code: '05', response: 'Do Not Honor' };
}

// Deterministic pseudo-numeric string derived from a seed, so the same transaction
// always renders the same value but different transactions render different values.
function seededDigits(seed, salt, len) {
  let h = 0; const s = String(seed) + salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h).padStart(len, '0').slice(0, len);
}

// Presentation-only fields for the Detail page's General Information / Merchant
// sections that aren't part of the core transactions[] record — derived from the
// transaction plus its linked card/cardholder rather than stored redundantly.
function deriveTxnDetailFields(t) {
  const card = findTxnCard(t);
  const cardholder = AppData.customers.find(c => c.id === t.cardholderId);
  const nestedProgram = card?.subprogramId ? AppData.subPrograms.find(s => s.id === card.subprogramId) : null;
  const isSettled = ['Posted', 'Refunded', 'Reversed'].includes(t.status);
  return {
    nestedProgramName: nestedProgram?.name || '—',
    authorizationCode: seededDigits(t.id, 'auth', 6),
    acceptorId: seededDigits(t.id, 'acceptor', 8).toUpperCase(),
    dateAuthorized: t.date,
    dateSettled: isSettled ? t.date : '—',
    authorizationAmount: t.amount,
    settledAmount: isSettled ? t.amount : 0,
    fundingMethod: card?.formFactors?.includes('physical') ? 'Pre-Funded' : 'Just-in-time Funding',
    result: t.status === 'Declined' ? 'Declined' : 'Approved',
    acquirerFee: 0,
    descriptor: t.merchant,
    city: cardholder?.city || '—',
    state: cardholder?.state || '—',
    country: cardholder?.country || '—',
  };
}

function txnTimelineSteps(t, dispute) {
  const amt = `$${t.amount.toFixed(2)}`;
  const steps = [{ label: 'Authorization', meta: `${t.date} · ${amt}`, date: t.date, status: 'Approved', done: true }];
  if (t.status === 'Declined') {
    steps.push({ label: 'Declined', meta: `${t.date} · ${amt}`, date: t.date, status: 'Declined', done: true });
    return steps;
  }
  if (t.status === 'Pending') {
    steps.push({ label: 'Clearing', meta: 'Awaiting merchant capture', date: '—', status: 'Pending', done: false });
    return steps;
  }
  steps.push({ label: 'Clearing', meta: t.date, date: t.date, status: 'Approved', done: true });
  const finalLabel = t.status === 'Refunded' ? 'Refund' : t.status === 'Reversed' ? 'Reversal' : 'Settled';
  steps.push({ label: finalLabel, meta: `${t.date} · ${amt}`, date: t.date, status: t.status, done: true });
  if (dispute) steps.push({ label: 'Disputed', meta: `Case ${dispute.case} filed ${dispute.filed}`, date: dispute.filed, status: dispute.status, done: true });
  return steps;
}

function auditActionFor(stepLabel) {
  if (stepLabel === 'Authorization') return 'Authorization Approved';
  if (stepLabel === 'Declined') return 'Authorization Declined';
  if (stepLabel === 'Clearing') return 'Clearing Processed';
  if (stepLabel === 'Disputed') return 'Dispute Filed';
  return `Transaction ${stepLabel}`;
}

const _MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function statementLabelFor(t) {
  const [m, , y] = t.date.split('/');
  return `${_MONTH_NAMES[parseInt(m, 10) - 1] || ''} ${y} Statement`;
}

function RelatedRecordRow({ icon, label, value, onClick }) {
  const disabled = !onClick;
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', borderRadius: 8, background: 'var(--fta-fill-2)',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name={icon} size={15} style={{ color: 'var(--fta-text-4)' }} />
        <div>
          <div style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>{label}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: disabled ? 'var(--fta-text-3)' : 'var(--fta-text-5)' }}>{value}</div>
        </div>
      </div>
      {!disabled && <Icon name="chev-right" size={14} style={{ color: 'var(--fta-text-3)' }} />}
    </div>
  );
}

export function TransactionsView({ navigate, navParam }) {
  if (navParam) {
    const txn = AppData.transactions.find(t => t.id === navParam);
    if (txn) return <TransactionDetail txn={txn} navigate={navigate} />;
  }
  return <TransactionList navigate={navigate} />;
}

// ── Transaction Detail: local presentational helpers ────────────
// Scoped to this page only — the shared <Field> box component (and its
// callers elsewhere in this file) are left untouched. These render a
// lighter, row-based "key-value list" instead of one bordered box per
// field, which is what an operations-style transaction page needs when a
// single record carries 25+ attributes.
function DetailRow({ label, value, valueNode, full }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
      padding: '9px 0', borderBottom: '1px solid var(--fta-line-3)',
      gridColumn: full ? '1 / -1' : undefined,
    }}>
      <span style={{ fontSize: 12.5, color: 'var(--fta-text-3)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-5)', textAlign: 'right' }}>{valueNode ?? value}</span>
    </div>
  );
}

function DetailSubsection({ title, first, children }) {
  return (
    <div style={{ marginTop: first ? 0 : 22 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fta-text-4)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <div className="grid-2">{children}</div>
    </div>
  );
}

function HeaderStat({ label, value, valueNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={{ fontSize: 11, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fta-text-5)' }}>{valueNode ?? value}</span>
    </div>
  );
}

function HeaderStatDivider() {
  return <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--fta-line-3)' }} />;
}

function TransactionDetail({ txn, navigate }) {
  const [toast, showToast] = useToast();
  const card = findTxnCard(txn);
  const dispute = findLinkedDispute(txn);
  const fraudHit = findLinkedFraud(txn);
  const decline = txn.status === 'Declined' ? declineDetailsFor(txn, fraudHit) : null;
  const timeline = txnTimelineSteps(txn, dispute);
  const d = deriveTxnDetailFields(txn);

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Transactions', route: 'transactions' }, { label: txn.id }]} />

      {/* ── Transaction Header: the amount is the primary identity of this page ── */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--fta-fill-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="receipt" size={24} style={{ color: 'var(--fta-primary-6)' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fta-text-5)' }}>
                ${txn.amount.toFixed(2)} <TxnStatusBadge status={txn.status} />
              </h1>
              <div style={{ fontSize: 14, color: 'var(--fta-text-4)', marginTop: 2 }}>{txn.merchant}</div>
              <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 4 }}>{txn.id} · {txn.date}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={() => showToast('File Dispute flow is not available in this prototype')}>File Dispute</button>
            <button className="btn btn-ghost" onClick={() => showToast('Return Reversal flow is not available in this prototype')}>Return Reversal</button>
            <button className="btn btn-ghost" onClick={() => showToast('Export is not wired up in this mock.')}>
              <Icon name="download" size={14} />Export
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="btn btn-ghost" aria-label="More actions"><MoreVertical size={14} /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => showToast('Void flow is not available in this prototype')}>Void</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => showToast('Edit Category flow is not available in this prototype')}>Edit Category</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28, marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--fta-line-3)', flexWrap: 'wrap' }}>
          <HeaderStat label="Cardholder" valueNode={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><ColorAvatar name={txn.holder} size="sm" />{txn.holder}</span>} />
          <HeaderStatDivider />
          <HeaderStat label="Card" value={`•••• ${txn.last4}`} />
          <HeaderStatDivider />
          <HeaderStat label="Network" valueNode={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={txn.network} />{txn.network}</span>} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(300px, 1fr)', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-section-title">Transaction Details</div>

            <DetailSubsection title="General Information" first>
              <DetailRow label="Transaction ID" value={txn.id} />
              <DetailRow label="Card No. Last Four Digit" value={`•••• ${txn.last4}`} />
              <DetailRow label="Created Date" value={txn.date} />
              <DetailRow label="Date Authorized" value={d.dateAuthorized} />
              <DetailRow label="Nested Program Name" value={d.nestedProgramName} />
              <DetailRow label="Funding Method" value={d.fundingMethod} />
              <DetailRow label="Date Settled" value={d.dateSettled} />
              <DetailRow label="Result" value={d.result} />
              <DetailRow label="Authorization Amount" value={`$${d.authorizationAmount.toFixed(2)}`} />
              <DetailRow label="Settled Amount" value={`$${d.settledAmount.toFixed(2)}`} />
              <DetailRow label="Network" valueNode={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={txn.network} />{txn.network}</span>} />
              <DetailRow label="Acquirer Fee" value={`$${d.acquirerFee.toFixed(2)}`} />
              <DetailRow label="Authorization Code" value={d.authorizationCode} />
              <DetailRow label="Category" value={txn.category} />
              <DetailRow label="Type" valueNode={<TxnTypeBadge type={txn.type} />} />
              <DetailRow label="Card Type" value={card?.cardTypeLabel || '—'} />
              <DetailRow full label="Form Factor" valueNode={<FormFactorTag type={card?.type} formFactors={card?.formFactors} />} />
            </DetailSubsection>

            <DetailSubsection title="Merchant">
              <DetailRow label="Acceptor ID" value={d.acceptorId} />
              <DetailRow label="Descriptor" value={d.descriptor} />
              <DetailRow label="City" value={d.city} />
              <DetailRow label="Country" value={d.country} />
              <DetailRow label="Merchant Category Code (MCC)" value={txn.mcc} />
              <DetailRow label="State" value={d.state} />
              <DetailRow label="Merchant Amount" value={`$${txn.amount.toFixed(2)}`} />
              <DetailRow label="Merchant Auth Amount" value={`$${d.authorizationAmount.toFixed(2)}`} />
              <DetailRow full label="Merchant Currency" value="USD" />
            </DetailSubsection>
          </div>

          {decline && (
            <div className="card">
              <div className="card-section-title">Decline Details</div>
              <div className="grid-2">
                <DetailRow label="Decline Reason" value={decline.reason} />
                <DetailRow label="Decline Code" value={decline.code} />
                <DetailRow full label="Network Response" value={decline.response} />
              </div>
            </div>
          )}

          {fraudHit && (
            <div className="card">
              <div className="card-section-title">Fraud Alert</div>
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <DetailRow label="Fraud Flag" valueNode={<span className="pill --danger"><Icon name="alert-triangle" size={11} />Flagged</span>} />
                <DetailRow label="Fraud Status" valueNode={<FraudStatusBadge status={fraudHit.status} />} />
                <DetailRow label="Risk Score" valueNode={
                  <span style={{ fontWeight: 700, fontSize: 15, color: fraudHit.score >= 80 ? 'var(--fta-error)' : fraudHit.score >= 50 ? 'var(--fta-warning)' : 'var(--fta-success)' }}>
                    {fraudHit.score}
                  </span>
                } />
                <DetailRow label="Risk Tier" value={fraudRiskTier(fraudHit.score)} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div className="field-label" style={{ marginBottom: 6 }}>Fraud Signals</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--fta-text-5)', lineHeight: 1.7 }}>
                  {fraudHit.reason.split('+').map(sig => sig.trim()).filter(Boolean).map(sig => <li key={sig}>{sig}</li>)}
                </ul>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Confirm Fraud flow is not available in this prototype')}>Confirm Fraud</button>
                <button className="btn btn-sm btn-ghost" onClick={() => showToast('Dismiss flow is not available in this prototype')}>Dismiss</button>
                <button className="btn btn-sm btn-ghost" onClick={() => showToast('Escalate flow is not available in this prototype')}>Escalate</button>
                <button className="btn btn-sm btn-ghost" onClick={() => showToast('Freeze Card flow is not available in this prototype')}>Freeze Card</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-section-title">Timeline</div>
            <div className="stepper">
              {timeline.map((s, i) => (
                <div key={s.label} className={'step' + (!s.done ? ' --upcoming' : '')}>
                  <div className={'step-dot' + (!s.done ? ' --upcoming' : '')}>
                    {s.done ? <Icon name="check" size={12} strokeWidth={3} /> : <div className="inner" />}
                  </div>
                  <div className="step-title">{s.label} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--fta-text-3)' }}>· {s.status}</span></div>
                  <div className="step-meta">{s.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Related Records</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <RelatedRecordRow icon="user" label="Cardholder Account" value={`${txn.holder} · ${txn.cardholderId}`} onClick={() => navigate('customer-detail', txn.cardholderId)} />
              <RelatedRecordRow
                icon="message"
                label="Dispute Case"
                value={dispute ? `${dispute.reason} · Case ${dispute.case}` : 'No linked dispute'}
                onClick={dispute ? () => navigate('dispute-detail', dispute.id) : null}
              />
              <RelatedRecordRow icon="file" label="Statement" value={statementLabelFor(txn)} onClick={() => navigate('billing-summary')} />
            </div>
          </div>

          <div className="card">
            <div className="card-section-title">Audit Log</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {timeline.map((s, i) => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: i < timeline.length - 1 ? '1px solid var(--fta-line-3)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label === 'Disputed' ? 'Cardholder' : 'System'}</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>{auditActionFor(s.label)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{s.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastBanner message={toast} />
    </div>
  );
}

function TransactionList({ navigate }) {
  const [statusFilter, setStatusFilter]      = useState('All Status');
  const [typeFilter, setTypeFilter]          = useState('All Types');
  const [networkFilter, setNetworkFilter]    = useState('All Networks');
  const [dateFilter, setDateFilter]          = useState('All Dates');
  const [merchantFilter, setMerchantFilter]  = useState('All Merchants');
  const [fraudOnly, setFraudOnly]            = useState(false);
  const [toast, showToast]                   = useToast();

  const txns = AppData.transactions;
  const merchantOptions = [...new Set(txns.map(t => t.merchant))].sort();

  const filteredData = txns.filter(t => {
    const matchStatus   = statusFilter === 'All Status'     || t.status === statusFilter;
    const matchType      = typeFilter === 'All Types'        || t.type === typeFilter;
    const matchNetwork   = networkFilter === 'All Networks'  || t.network === networkFilter;
    const matchMerchant  = merchantFilter === 'All Merchants'|| t.merchant === merchantFilter;
    const matchFraud     = !fraudOnly || !!findLinkedFraud(t);
    const matchDate = (() => {
      if (dateFilter === 'All Dates') return true;
      const days = (TXN_REFERENCE_DATE - parseTxnDate(t.date)) / (1000 * 60 * 60 * 24);
      if (dateFilter === 'Last 7 Days')  return days >= 0 && days <= 7;
      if (dateFilter === 'Last 30 Days') return days >= 0 && days <= 30;
      return true;
    })();
    return matchStatus && matchType && matchNetwork && matchMerchant && matchFraud && matchDate;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (t, q) =>
      t.holder.toLowerCase().includes(q) ||
      t.merchant.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.last4.includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.mcc.includes(q),
  });

  function resetFilters() {
    setStatusFilter('All Status'); setTypeFilter('All Types');
    setNetworkFilter('All Networks'); setDateFilter('All Dates');
    setMerchantFilter('All Merchants'); setFraudOnly(false);
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaction</h1>
          <div className="page-subtitle">All cardholder transactions · May 2026</div>
        </div>
      </div>

      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>Status</DataTableFilterLabel>
          <div className="select">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option><option>Pending</option><option>Posted</option><option>Declined</option><option>Refunded</option><option>Reversed</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Type</DataTableFilterLabel>
          <div className="select">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option>All Types</option><option>Purchase</option><option>Refund</option><option>Authorization Hold</option><option>Reversal</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Network</DataTableFilterLabel>
          <div className="select">
            <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
              <option>All Networks</option><option>Visa</option><option>Mastercard</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Merchant</DataTableFilterLabel>
          <div className="select">
            <select value={merchantFilter} onChange={e => setMerchantFilter(e.target.value)}>
              <option>All Merchants</option>
              {merchantOptions.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Date</DataTableFilterLabel>
          <div className="select">
            <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
              <option>All Dates</option><option>Last 7 Days</option><option>Last 30 Days</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>&nbsp;</DataTableFilterLabel>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, height: 34, cursor: 'pointer', fontSize: 13, color: 'var(--fta-text-4)' }}>
            <input type="checkbox" checked={fraudOnly} onChange={e => setFraudOnly(e.target.checked)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
            Fraud flagged only
          </label>
        </DataTableFilterField>
        <DataTableFilterActions onReset={resetFilters} />
      </DataTableFilters>
      <div className="filter-divider" />

      <StandardDataTable
        title="Transaction List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search ID, holder, merchant, card, MCC',
        }}
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="txn-id">Transaction ID</TableHead>
              <TableHead columnId="txn-customer">Customer</TableHead>
              <TableHead columnId="txn-merchant">Merchant</TableHead>
              <TableHead columnId="txn-card">Card</TableHead>
              <TableHead columnId="txn-network">Network</TableHead>
              <TableHead columnId="txn-amount" style={{ textAlign: 'right' }}>Amount</TableHead>
              <TableHead columnId="txn-date">Date</TableHead>
              <TableHead columnId="txn-type">Type</TableHead>
              <TableHead columnId="txn-status">Status</TableHead>
              <TableHead columnId="txn-flags">Flags</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(s) =>
          s.pageRows.map((t) => {
            const card = findTxnCard(t);
            const fraudHit = findLinkedFraud(t);
            const disputeHit = findLinkedDispute(t);
            return (
              <TableRow key={t.id} className="cursor-pointer" onClick={() => navigate('transaction-detail', t.id)}>
                <TableCell className="mono muted">{t.id}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColorAvatar name={t.holder} size="sm" />
                    <div>
                      <div>{t.holder}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>•••• {t.last4}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ fontWeight: 500 }}>{t.merchant}</div>
                  <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>
                    {t.category} <span className="mono" style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>· {t.mcc}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{card?.cardTypeLabel || '—'}</div>
                  <FormFactorTag type={card?.type} formFactors={card?.formFactors} />
                </TableCell>
                <TableCell><div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={t.network} />{t.network}</div></TableCell>
                <TableCell style={{ textAlign: 'right', fontWeight: 500 }}>${t.amount.toFixed(2)}</TableCell>
                <TableCell className="muted">{t.date}</TableCell>
                <TableCell><TxnTypeBadge type={t.type} /></TableCell>
                <TableCell><StatusPill status={t.status} /></TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {fraudHit && <span className="pill --danger" title={fraudHit.reason}><Icon name="alert-triangle" size={11} />Fraud</span>}
                    {disputeHit && <span className="pill --warning" title={`Case ${disputeHit.case}`}><Icon name="message" size={11} />Dispute</span>}
                    {!fraudHit && !disputeHit && <span style={{ color: 'var(--fta-text-3)', fontSize: 12 }}>—</span>}
                  </div>
                </TableCell>
                <TableActionCell>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm btn-ghost" onClick={() => showToast('File Dispute flow is not available in this prototype')}>File Dispute</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => showToast('Return Reversal flow is not available in this prototype')}>Return Reversal</button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="btn btn-sm btn-ghost" style={{ padding: '0 6px' }} aria-label="More actions">
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => showToast('Void flow is not available in this prototype')}>Void</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => showToast('Edit Category flow is not available in this prototype')}>Edit Category</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableActionCell>
              </TableRow>
            );
          })
        }
        emptyState={<DataTableEmptyStateRow colSpan={11} />}
      />
      <ToastBanner message={toast} />
    </div>
  );
}

const FRAUD_STATUS_TONE = { Alert: 'danger', Review: 'warning', Cleared: 'success' };
function FraudStatusBadge({ status }) {
  const tone = FRAUD_STATUS_TONE[status] || 'inactive';
  return <span className={`pill --${tone}`}><span className="dot" />{status}</span>;
}

function fraudRiskTier(score) {
  if (score >= 80) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

// FraudView (the standalone "Fraud Alerts" page) has been retired — fraud
// investigation now happens inline on Transaction Detail. FraudStatusBadge and
// fraudRiskTier stay in use there.
