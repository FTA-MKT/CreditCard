import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, FilterField, Field, Pager, NetworkMark, CreditCardArt, buildCardsForCustomer } from '../components/shared';
import AppData from '../data/AppData';

export default function CustomersView({ navigate, navParam }) {
  if (navParam) {
    const cust = AppData.customers.find(c => c.id === navParam);
    if (cust) return <CustomerDetail customer={cust} navigate={navigate} />;
  }
  return <CustomerList navigate={navigate} />;
}

function CustomerList({ navigate }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [state, setState] = useState('All');

  const filtered = AppData.customers.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'All Status' || c.status === status;
    const matchState = state === 'All' || c.state === state;
    return matchSearch && matchStatus && matchState;
  });

  return (
    <div className="content-inner fade-in" data-screen-label="Customers List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <div className="page-subtitle">Cardholder accounts across all programs · Total {AppData.customers.length.toLocaleString()} accounts</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14} />Add Customer</button>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 180 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>All Status</option><option>Active</option><option>Frozen</option><option>Pending</option><option>Closed</option>
            </select>
          </FilterField>
          <FilterField label="State" style={{ width: 140 }}>
            <select value={state} onChange={e => setState(e.target.value)}>
              <option>All</option>
              <option>NY</option><option>TX</option><option>CA</option><option>FL</option>
              <option>WA</option><option>NJ</option><option>NV</option><option>AZ</option><option>OR</option><option>ID</option>
            </select>
          </FilterField>
          <FilterField label="Date Created" style={{ width: 200 }}>
            <select defaultValue="Last 12 months">
              <option>Last 12 months</option><option>Last 90 days</option><option>Last 30 days</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatus('All Status'); setState('All'); }}>Reset</button>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Customer List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 360 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by name, email, or customer ID" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-sm btn-ghost"><Icon name="filter" size={12} />Filter</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th><th>Customer ID</th><th>Email</th><th>Phone</th><th>State</th>
              <th style={{ textAlign: 'right' }}>Cards</th><th>Status</th><th>Created</th><th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="--clickable" onClick={() => navigate('customer-detail', c.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ColorAvatar name={c.name} />
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                  </div>
                </td>
                <td className="mono muted">{c.id}</td>
                <td>{c.email}</td>
                <td className="mono">{c.phone}</td>
                <td>{c.state}</td>
                <td style={{ textAlign: 'right' }}>{c.cards}</td>
                <td><StatusPill status={c.status} /></td>
                <td className="muted">{c.created}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); navigate('customer-detail', c.id); }}>
                    <Icon name="eye" size={12} />View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot"><span>Total {filtered.length} items</span><Pager /></div>
      </div>
    </div>
  );
}

function CustomerDetail({ customer, navigate }) {
  const [view, setView] = useState('grid');
  const cards = buildCardsForCustomer(customer);

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Customers', route: 'customers' }, { label: customer.name }]} />

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
          <ColorAvatar name={customer.name} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 className="page-title" style={{ fontSize: 22 }}>{customer.name}</h1>
              <StatusPill status={customer.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: 'var(--fta-text-4)', fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="phone" size={12} />{customer.phone}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="mail" size={12} />{customer.email}</span>
              <span className="mono muted">{customer.id}</span>
            </div>
          </div>
          <button className="btn btn-ghost"><Icon name="edit" size={14} />Edit</button>
        </div>

        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Field label="Birthday" value="11/08/1993" />
          <Field label="SSN" value="*****1246" />
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Field label="Email" value={customer.email} />
          <Field label="Phone" value={customer.phone} />
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Field label="Address 1" value="4140 Parker Rd. Allentown" />
          <Field label="Address 2" value="—" />
        </div>
        <div className="grid-4">
          <Field label="City" value="New York" />
          <Field label="State" value={customer.state} />
          <Field label="Country" value="USA" />
          <Field label="ZIP" value="000134" />
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Cards <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({cards.length})</span></h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="input" style={{ width: 240 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by last 4" />
            </div>
            <div style={{ display: 'flex', border: '1px solid var(--fta-line-3)', borderRadius: 4, overflow: 'hidden' }}>
              <button onClick={() => setView('grid')} style={{ background: view === 'grid' ? 'var(--fta-primary-1)' : 'transparent', color: view === 'grid' ? 'var(--fta-primary-6)' : 'var(--fta-text-4)', border: 'none', padding: '8px 10px', cursor: 'pointer' }}>
                <Icon name="grid" size={14} />
              </button>
              <button onClick={() => setView('list')} style={{ background: view === 'list' ? 'var(--fta-primary-1)' : 'transparent', color: view === 'list' ? 'var(--fta-primary-6)' : 'var(--fta-text-4)', border: 'none', padding: '8px 10px', cursor: 'pointer' }}>
                <Icon name="list" size={14} />
              </button>
            </div>
            <button className="btn btn-primary btn-sm"><Icon name="plus" size={12} />Create Card</button>
          </div>
        </div>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {cards.map(c => <CreditCardArt key={c.id} card={c} />)}
          </div>
        ) : (
          <table className="table">
            <thead><tr><th>Card</th><th>Last 4</th><th>Exp</th><th>Type</th><th>Network</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
            <tbody>
              {cards.map(c => (
                <tr key={c.id}>
                  <td>{c.brand}</td>
                  <td className="mono">{c.last4}</td>
                  <td>{c.exp}</td>
                  <td><span className={"pill --" + (c.type === 'Physical' ? 'warning' : 'info')}>{c.type}</span></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={c.network} />{c.network}</span></td>
                  <td><StatusPill status={c.status} /></td>
                  <td style={{ textAlign: 'right' }}><button className="btn btn-sm btn-ghost">Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
