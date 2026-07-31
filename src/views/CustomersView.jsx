import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, Field, Pager, NetworkMark, fmtMoney, EnDateInput } from '../components/shared';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableSurface } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';
import { DataTableFooter } from '../components/business/data-display/DataTableFooter';
import { DataTableFilters, DataTableFilterField, DataTableFilterLabel } from '../components/business/data-display/DataTableWorkbench';
import { DataTableFilterActions } from '../components/business/data-display/DataTableFilterActions';
import AppData from '../data/AppData';

const BankIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18"/>
    <path d="M6 18V9"/><path d="M10 18V9"/><path d="M14 18V9"/><path d="M18 18V9"/>
    <path d="M2 9l10-7 10 7"/>
  </svg>
);

const _CREDIT_GRADIENTS = [
  'linear-gradient(135deg, #294A60 0%, #0B1744 100%)',
  'linear-gradient(135deg, #3A3F46 0%, #1F2933 100%)',
  'linear-gradient(135deg, #5B5A55 0%, #2F3437 100%)',
  'linear-gradient(135deg, #526678 0%, #26384A 100%)',
];
function cardIdHashSlot(id) {
  let h = 0; const s = String(id || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h % _CREDIT_GRADIENTS.length;
}
function getCardVisual(card) {
  const snap      = card.inheritedSubprogramSnapshot || {};
  const artwork   = snap.artworkFront;
  const hasArtwork = !!(artwork?.previewUrl && artwork.previewUrl !== '');
  const isCredit  = !String(card.cardType || '').toLowerCase().includes('debit');
  return {
    hasArtwork,
    artworkUrl:  hasArtwork ? artwork.previewUrl : null,
    isCredit,
    background:  isCredit ? _CREDIT_GRADIENTS[cardIdHashSlot(card.id)] : 'linear-gradient(135deg,#E7E7E7 0%,#CFCFCF 100%)',
    textColor:   isCredit ? '#FFFFFF' : '#1D2129',
    decoAlpha1:  isCredit ? 'rgba(255,255,255,0.07)' : 'rgba(29,33,41,0.05)',
    decoAlpha2:  isCredit ? 'rgba(255,255,255,0.05)' : 'rgba(29,33,41,0.04)',
    badgeBg:     hasArtwork ? 'rgba(0,0,0,0.35)' : (isCredit ? 'rgba(255,255,255,0.2)' : 'rgba(29,33,41,0.1)'),
  };
}

function formatExp(dateStr) {
  if (!dateStr) return '—';
  const p = dateStr.split('-');
  return p.length < 2 ? '—' : p[1] + '/' + p[0].slice(2);
}

function DetailTabs({ tabs, active, onSelect }) {
  return (
    <Tabs value={active} onValueChange={onSelect} style={{ marginBottom: 20 }}>
      <TabsList style={{ height: 46 }}>
        {tabs.map(([key, label]) => (
          <TabsTrigger key={key} value={key} style={{ paddingLeft: 16, paddingRight: 16 }}>{label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fta-text-4)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--fta-line-3)', margin: '20px 0' }} />;
}

// ─── Router ───────────────────────────────────────────────────
export default function CustomersView({ navigate, navParam }) {
  if (navParam) {
    const navId      = typeof navParam === 'string' ? navParam : navParam?.id;
    const initialTab = typeof navParam === 'object'  ? navParam?.activeTab : undefined;

    if (typeof navId === 'string' && navId.startsWith('BUS-')) {
      const biz = AppData.businesses.find(b => b.id === navId);
      if (biz) return <BusinessDetail business={biz} navigate={navigate} />;
    }
    const cust = AppData.customers.find(c => c.id === navId);
    if (cust) return <CardholderDetail customer={cust} navigate={navigate} initialTab={initialTab} />;
  }
  return <CustomerList navigate={navigate} />;
}

// ─── Customer List ────────────────────────────────────────────
function CustomerList({ navigate }) {
  const [mainTab, setMainTab]       = useState('cardholder');
  const [issuedTab, setIssuedTab]   = useState('issued');
  const [status, setStatus]         = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const issuedCustomers   = AppData.customers.filter(c => (c.cards || 0) > 0);
  const unissuedCustomers = AppData.customers.filter(c => (c.cards || 0) === 0);
  const businesses        = AppData.businesses || [];

  const activeRows = mainTab === 'business'
    ? businesses
    : (issuedTab === 'issued' ? issuedCustomers : unissuedCustomers);

  const filteredData = activeRows.filter(row => !status || row.status === status);

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (row, q) =>
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.phone.includes(q) ||
      (row.id || '').toLowerCase().includes(q) ||
      (row.postalCode || '').includes(q),
  });

  function reset() {
    setStatus('');
    setDateFilter('');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in" data-screen-label="Customers List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer</h1>
          <div className="page-subtitle">Business accounts and card holders</div>
        </div>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab} style={{ marginBottom: 16 }}>
        <TabsList style={{ height: 46 }}>
          <TabsTrigger value="business" style={{ paddingLeft: 16, paddingRight: 16 }}><BankIcon size={14} />Business</TabsTrigger>
          <TabsTrigger value="cardholder" style={{ paddingLeft: 16, paddingRight: 16 }}><Icon name="user" size={14} />Card Holder</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>Status</DataTableFilterLabel>
          <div className="select">
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Please Select</option>
              <option>Active</option><option>Inactive</option><option>Frozen</option>
              <option>Pending</option><option>Closed</option><option>Under Review</option>
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>{mainTab === 'business' ? 'Last Modified' : 'Created Date'}</DataTableFilterLabel>
          <div className="input" style={{ position: 'relative' }}>
            <EnDateInput value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </DataTableFilterField>
        <DataTableFilterActions onReset={reset} />
      </DataTableFilters>
      <div>
        <div className="filter-divider" />
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <h3 className="text-base font-semibold text-foreground" style={{ margin: 0 }}>
              {mainTab === 'cardholder' ? 'Customer List' : 'Business List'}
            </h3>
            <div className="relative w-60">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={state.search}
                onChange={e => state.setSearch(e.target.value)}
                placeholder={mainTab === 'cardholder' ? 'Search card holder, phone, E-mail, card no.' : 'Search business name, postal code'}
                className="pl-8 text-sm"
              />
            </div>
          </div>
          {mainTab === 'cardholder' && (
            <Tabs value={issuedTab} onValueChange={setIssuedTab} style={{ marginTop: 12 }}>
              <TabsList className="h-9">
                <TabsTrigger value="issued">Issued</TabsTrigger>
                <TabsTrigger value="unissued">Unissued</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      <TableSurface>
        <Table framed={false} widthBehavior="fill" showColumnBorders={false}>
          {mainTab === 'business' ? (
            <TableHeader>
              <TableRow>
                <TableHead columnId="biz-name">Business Name</TableHead>
                <TableHead columnId="biz-status">Status</TableHead>
                <TableHead columnId="biz-cardholders">Cardholders</TableHead>
                <TableHead columnId="biz-cards">Cards</TableHead>
                <TableHead columnId="biz-phone">Phone</TableHead>
                <TableHead columnId="biz-email">Email</TableHead>
                <TableHead columnId="biz-last-modified">Last Modified</TableHead>
                <TableHead columnId="biz-created">Created</TableHead>
              </TableRow>
            </TableHeader>
          ) : issuedTab === 'issued' ? (
            <TableHeader>
              <TableRow>
                <TableHead columnId="cust-name">Name</TableHead>
                <TableHead columnId="cust-cards">Number of Cards</TableHead>
                <TableHead columnId="cust-phone">Phone</TableHead>
                <TableHead columnId="cust-email">Email</TableHead>
                <TableHead columnId="cust-status">Status</TableHead>
                <TableHead columnId="cust-last-modified">Last Modified</TableHead>
                <TableHead columnId="cust-created">Created</TableHead>
              </TableRow>
            </TableHeader>
          ) : (
            <TableHeader>
              <TableRow>
                <TableHead columnId="cust-name">Name</TableHead>
                <TableHead columnId="cust-phone">Phone</TableHead>
                <TableHead columnId="cust-email">Email</TableHead>
                <TableHead columnId="cust-status">Status</TableHead>
                <TableHead columnId="cust-last-modified">Last Modified</TableHead>
                <TableHead columnId="cust-created">Created</TableHead>
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {state.pageRows.length === 0 ? (
              <DataTableEmptyStateRow colSpan={mainTab === 'business' ? 8 : issuedTab === 'issued' ? 7 : 6} />
            ) : mainTab === 'business' ? (
              state.pageRows.map((b) => (
                <TableRow key={b.id} className="cursor-pointer" onClick={() => navigate('customer-detail', b.id)}>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--fta-primary-1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fta-primary-6)' }}>
                        <BankIcon size={14} />
                      </div>
                      <span style={{ fontWeight: 500 }}>{b.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusPill status={b.status} /></TableCell>
                  <TableCell>{b.numberOfCardholders}</TableCell>
                  <TableCell>{b.numberOfCards}</TableCell>
                  <TableCell className="mono">{b.phone}</TableCell>
                  <TableCell>{b.email}</TableCell>
                  <TableCell className="muted">{b.lastModified}</TableCell>
                  <TableCell className="muted">{b.created}</TableCell>
                </TableRow>
              ))
            ) : (
              state.pageRows.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate('customer-detail', c.id)}>
                  <TableCell><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><ColorAvatar name={c.name} /><span style={{ fontWeight: 500 }}>{c.name}</span></div></TableCell>
                  {issuedTab === 'issued' && <TableCell>{c.cards}</TableCell>}
                  <TableCell className="mono">{c.phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell><StatusPill status={c.status} /></TableCell>
                  <TableCell className="muted">{c.lastModified || c.created}</TableCell>
                  <TableCell className="muted">{c.created}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <DataTableFooter
          totalLabel={`Total ${state.totalRows} items`}
          currentPage={state.safeCurrentPage}
          totalPages={state.totalPages}
          pageItems={state.pageItems}
          onPageChange={state.setCurrentPage}
          pageSize={{ value: state.pageSize, onValueChange: state.setPageSize, options: ['10', '20', '50'] }}
        />
      </TableSurface>
    </div>
  );
}

// ─── Business Detail ──────────────────────────────────────────
function BusinessDetail({ business, navigate }) {
  const [tab, setTab] = useState('details');
  const cardholders = AppData.customers.filter(c => c.businessId === business.id);

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Customers', route: 'customers' }, { label: business.name }]} />
      <div className="page-header">
        <h1 className="page-title">{business.name}</h1>
        <button className="btn btn-ghost"><Icon name="edit" size={14} />Edit</button>
      </div>

      <DetailTabs
        tabs={[['details', 'Business Details'], ['cardholders', 'Card Holders']]}
        active={tab}
        onSelect={setTab}
      />

      {tab === 'details' ? (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--fta-primary-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fta-primary-6)', flexShrink: 0 }}>
              <BankIcon size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{business.name}</span>
                <StatusPill status={business.status} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--fta-text-4)' }}>{business.email}</div>
            </div>
          </div>
          <Divider />

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Email"        value={business.email} />
            <Field label="Phone Number" value={business.phone} />
          </div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Website URL" value={business.websiteUrl || 'Not configured'} />
            <Field label="Support URL" value={business.supportUrl || 'Not configured'} />
          </div>
          <div style={{ marginBottom: 0 }}>
            <Field label="Description" value={business.description || 'Not configured'} />
          </div>

          <Divider />

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Address"   value={business.address || 'Not configured'} />
            <Field label="Address 2" value="—" />
          </div>
          <div className="grid-4">
            <Field label="City"        value={business.city        || '—'} />
            <Field label="State"       value={business.state       || '—'} />
            <Field label="Postal Code" value={business.postalCode  || '—'} />
            <Field label="Country"     value={business.country     || 'US'} />
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-toolbar" style={{ padding: '16px 20px 12px' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              Card Holders <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({cardholders.length})</span>
            </h3>
          </div>
          {cardholders.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--fta-text-4)', fontSize: 14 }}>No card holders associated with this business.</div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {cardholders.map(c => (
                  <tr key={c.id} className="--clickable" onClick={() => navigate('customer-detail', c.id)}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><ColorAvatar name={c.name} /><span style={{ fontWeight: 500 }}>{c.name}</span></div></td>
                    <td className="mono">{c.phone}</td>
                    <td>{c.email}</td>
                    <td><StatusPill status={c.status} /></td>
                    <td className="muted">{c.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="table-foot"><span>Total {cardholders.length} items</span><Pager /></div>
        </div>
      )}
    </div>
  );
}

// ─── Card Holder Detail ───────────────────────────────────────
function CardholderDetail({ customer, navigate, initialTab }) {
  const [tab, setTab]           = useState(initialTab || 'details');
  const [cardView, setCardView] = useState('list');

  const cards = AppData.cards.filter(c => c.cardholderId === customer.id);

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Customers', route: 'customers' }, { label: customer.name }]} />
      <div className="page-header">
        <h1 className="page-title">{customer.name}</h1>
        <button className="btn btn-ghost"><Icon name="edit" size={14} />Edit</button>
      </div>

      <DetailTabs
        tabs={[['details', 'Card Holder Details'], ['cards', 'Cards'], ['autopay', 'Autopay']]}
        active={tab}
        onSelect={setTab}
      />

      {tab === 'autopay' ? (
        <CardholderAutopayTab customer={customer} />
      ) : tab === 'details' ? (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <ColorAvatar name={customer.name} size="lg" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{customer.name}</span>
                <StatusPill status={customer.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: 'var(--fta-text-4)', fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={12} />{customer.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="mail" size={12} />{customer.email}</span>
                <span className="mono">{customer.id}</span>
              </div>
            </div>
          </div>
          <Divider />

          <SectionLabel>Personal Information</SectionLabel>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Date of Birth" value={customer.dateOfBirth || 'Not configured'} />
            <Field label="SSN"           value={customer.ssnMasked   || 'Not configured'} />
          </div>
          <div className="grid-2">
            <Field label="Email" value={customer.email} />
            <Field label="Phone" value={customer.phone} />
          </div>

          <Divider />

          <SectionLabel>Address</SectionLabel>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Address"   value={customer.address || 'Not configured'} />
            <Field label="Address 2" value="—" />
          </div>
          <div className="grid-4">
            <Field label="City"        value={customer.city       || 'Not configured'} />
            <Field label="State"       value={customer.state      || '—'} />
            <Field label="Postal Code" value={customer.postalCode || '—'} />
            <Field label="Country"     value={customer.country    || 'US'} />
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              Cards <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({cards.length})</span>
            </h3>
            {cards.length > 0 && (
              <div style={{ display: 'flex', border: '1px solid var(--fta-line-3)', borderRadius: 4, overflow: 'hidden' }}>
                <button onClick={() => setCardView('grid')} style={{ background: cardView === 'grid' ? 'var(--fta-primary-1)' : 'transparent', color: cardView === 'grid' ? 'var(--fta-primary-6)' : 'var(--fta-text-4)', border: 'none', padding: '8px 10px', cursor: 'pointer' }}>
                  <Icon name="grid" size={14} />
                </button>
                <button onClick={() => setCardView('list')} style={{ background: cardView === 'list' ? 'var(--fta-primary-1)' : 'transparent', color: cardView === 'list' ? 'var(--fta-primary-6)' : 'var(--fta-text-4)', border: 'none', padding: '8px 10px', cursor: 'pointer' }}>
                  <Icon name="list" size={14} />
                </button>
              </div>
            )}
          </div>

          {cards.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <div style={{ color: 'var(--fta-text-4)', fontSize: 14, marginBottom: 6 }}>No cards issued to this card holder yet.</div>
              <div style={{ color: 'var(--fta-text-4)', fontSize: 13 }}>Use Issue Card to create a new card.</div>
            </div>
          ) : cardView === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {cards.map(c => {
                const vis = getCardVisual(c);
                const snap = c.inheritedSubprogramSnapshot || {};
                const dot  = c.cardStatus === 'Active' ? '#4ade80' : c.cardStatus === 'Frozen' ? '#f97316' : '#9ca3af';
                return (
                  <div key={c.id} style={{
                    ...(vis.hasArtwork
                      ? { backgroundImage: `url(${vis.artworkUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: vis.background }),
                    borderRadius: 14, padding: '16px 18px 14px', color: vis.textColor,
                    aspectRatio: '1.586 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', overflow: 'hidden',
                  }}>
                    {vis.hasArtwork && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.15) 0%,rgba(0,0,0,.05) 40%,rgba(0,0,0,.35) 100%)', pointerEvents: 'none', zIndex: 0 }} />
                    )}
                    <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: '50%', background: vis.decoAlpha1, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', right: 28,  top:  44, width:  72, height:  72, borderRadius: '50%', background: vis.decoAlpha2, pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: vis.badgeBg, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                        {vis.isCredit ? 'Credit' : 'Debit'}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {snap.programName || c.cardName}
                      </span>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 28, height: 20, borderRadius: 4, background: 'linear-gradient(135deg,#c9a227,#f0c040)', opacity: 0.9 }} />
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: '2px', fontWeight: 500 }}>**** **** **** {c.last4}</div>
                      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                      <div>
                        <div style={{ fontSize: 8, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>Valid Thru</div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{formatExp(c.expirationDate)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, justifyContent: 'flex-end' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />
                          <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.9 }}>{c.cardStatus}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-.3px', opacity: 0.95 }}>
                          {c.network === 'Visa' ? 'VISA' : c.network === 'Mastercard' ? 'MC' : (c.network || '')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Card Name</th><th>Last 4</th><th>Exp</th><th>Type</th><th>Network</th>
                  <th>Sub-Program</th><th>Status</th><th>Created</th><th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cards.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.cardName}</td>
                    <td className="mono">{c.last4}</td>
                    <td className="mono">{formatExp(c.expirationDate)}</td>
                    <td><span className={'pill --' + (c.type === 'Physical' ? 'warning' : 'info')}>{c.type}</span></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={c.network} />{c.network}</span></td>
                    <td className="muted">{c.inheritedSubprogramSnapshot?.name || '—'}</td>
                    <td><StatusPill status={c.cardStatus} /></td>
                    <td className="muted">{c.createdAt ? c.createdAt.slice(0, 10) : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-sm btn-ghost" onClick={() => navigate('card-detail', { cardId: c.id, from: 'customer-cardholder-cards', customerId: customer.id, customerName: customer.name })}>
                        <Icon name="eye" size={12} />View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Card Holder Autopay Tab ────────────────────────────────────
const DISABLE_REASONS = ['Delinquency', 'Fraud Hold', 'Compliance Restriction', 'Funding Source Failure', 'Customer Request', 'Program Migration'];

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

function AutopayStateBadge({ state }) {
  const tone =
    state === 'Enabled' ? { bg: '#dcfce7', color: '#166534' } :
    state === 'Paused'  ? { bg: '#fef3c7', color: '#92400e' } :
    { bg: '#fee2e2', color: '#991b1b' };
  return (
    <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: tone.bg, color: tone.color }}>
      {state}
    </span>
  );
}

function runStatusTone(status) {
  return status === 'Settled' || status === 'Posted' ? 'success' : status === 'Processing' || status === 'Scheduled' ? 'info' : 'danger';
}

function CardholderAutopayTab({ customer }) {
  const acct = AppData.autopay.enrollment.accounts.find(a => a.id === customer.id);
  const [toast, showToast] = useToast();

  const initialState = acct ? (acct.status === 'Frozen' ? 'Disabled' : 'Enabled') : null;
  const [state, setState] = useState(initialState);
  const [overrides, setOverrides] = useState(acct?.overrides || []);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [reasonCode, setReasonCode] = useState('');

  if (!acct) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--fta-text-3)' }}>
        This card holder is not enrolled in autopay.
      </div>
    );
  }

  const history = AppData.billing.payments.filter(p => p.acct === customer.id && p.source === 'Autopay');
  const policy = AppData.autopay.policy;

  function pushOverride(action, reason) {
    setOverrides(list => [{ action, reason, actor: 'Current Admin', timestamp: 'Just now' }, ...list]);
  }

  function handleDisableConfirm() {
    if (!reasonCode) return;
    setState('Disabled');
    pushOverride('Disabled', reasonCode);
    setShowDisableForm(false);
    setReasonCode('');
    showToast('Autopay disabled — cardholder notified.');
  }

  function handlePause() {
    setState('Paused');
    pushOverride('Paused', 'Admin-initiated temporary halt');
    showToast('Autopay paused for this account.');
  }

  function handleResume() {
    setState('Enabled');
    pushOverride('Resumed', 'Admin-initiated resume');
    showToast('Autopay resumed for this account.');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="card-section-title" style={{ margin: 0 }}>Current Configuration</div>
          <AutopayStateBadge state={state} />
        </div>

        {state === 'Disabled' && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
            Autopay is disabled on this account. Per policy, only the cardholder can re-enroll — admin cannot re-enable on the cardholder's behalf.
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Field label="Mode" value={acct.mode} />
          <Field label="Fixed Amount" value={acct.fixed || '—'} />
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Field label="Funding Source" value={`${acct.fundingSource} · ${acct.verify}`} />
          <Field label="Execution Timing" value={`${policy.timing} · Cutoff ${policy.cutoff} ${policy.timezone}`} />
        </div>
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <Field label="Next Scheduled Run" value={acct.next} />
          <Field label="Projected Amount" valueNode={<span style={{ fontWeight: 600 }}>{fmtMoney(acct.projected)}</span>} />
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--fta-line-3)' }}>
          {state === 'Enabled' && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={handlePause}>Pause Autopay</button>
              <button className="btn btn-sm" style={{ color: 'var(--fta-error)', border: '1px solid var(--fta-error)' }} onClick={() => setShowDisableForm(s => !s)}>Disable Autopay</button>
            </>
          )}
          {state === 'Paused' && (
            <button className="btn btn-primary btn-sm" onClick={handleResume}>Resume Autopay</button>
          )}
        </div>

        <Dialog open={showDisableForm} onOpenChange={(open) => { setShowDisableForm(open); if (!open) setReasonCode(''); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable Autopay</DialogTitle>
            </DialogHeader>
            <div style={{ fontSize: 13, color: 'var(--fta-text-4)', marginBottom: 4 }}>
              A reason code is required. The cardholder will be notified once autopay is disabled.
            </div>
            <div className="field-label">Reason Code (required)</div>
            <div className="select" style={{ marginBottom: 6 }}>
              <select value={reasonCode} onChange={e => setReasonCode(e.target.value)}>
                <option value="">Select a reason</option>
                {DISABLE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <DialogFooter>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowDisableForm(false); setReasonCode(''); }}>Cancel</button>
              <button className="btn btn-sm" style={{ background: 'var(--fta-error)', color: '#fff', border: 'none' }} disabled={!reasonCode} onClick={handleDisableConfirm}>Confirm Disable</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Execution History <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({history.length})</span></h2>
        </div>
        {history.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--fta-text-4)', fontSize: 13 }}>No autopay executions recorded for this account yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Date</th><th style={{ textAlign: 'right' }}>Amount</th><th>Mode</th><th>Funding Source</th><th>Status</th><th>Failure Reason</th></tr>
            </thead>
            <tbody>
              {history.map(p => (
                <tr key={p.id}>
                  <td className="muted">{p.date}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmtMoney(p.amount)}</td>
                  <td>{acct.mode}</td>
                  <td className="mono">{p.funding}</td>
                  <td><span className={'pill --' + runStatusTone(p.status)}>{p.status}</span></td>
                  <td className="muted">{p.fail || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Pause / Disable History <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({overrides.length})</span></h2>
        </div>
        {overrides.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--fta-text-4)', fontSize: 13 }}>No pause or disable actions on record for this account.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Action</th><th>Reason</th><th>Actor</th><th>Timestamp</th></tr>
            </thead>
            <tbody>
              {overrides.map((o, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{o.action}</td>
                  <td>{o.reason}</td>
                  <td className="muted">{o.actor}</td>
                  <td className="muted">{o.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastBanner message={toast} />
    </div>
  );
}
