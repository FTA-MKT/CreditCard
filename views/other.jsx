/* global React, Icon, StatusPill, ColorAvatar, AppData, initials, NetworkMark, FilterField, Pager, ProgramLogo */
// views/other.jsx — Sub-program, Nested Program, Cards, Transactions

const { useState: useStateOther } = React;

// ── Sub-program (full list across all programs) ─────────────────
function SubProgramsView({ navigate }) {
  return (
    <div className="content-inner fade-in" data-screen-label="Sub-programs">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sub-program</h1>
          <div className="page-subtitle">All sub-programs across active card programs</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14} />Create Sub-program</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Sub-program List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({AppData.subPrograms.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 320 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search by sub-program name, BIN" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Sub-program</th>
              <th>Sub-program ID</th>
              <th>Parent Program</th>
              <th>BIN Prefix</th>
              <th>Network</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Cards</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {AppData.subPrograms.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td className="mono muted">{s.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ProgramLogo size={22} />
                    <span style={{ fontSize: 13 }}>Neo Banking Rewards</span>
                  </div>
                </td>
                <td className="mono">{s.bin}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <NetworkMark network={s.network} />
                    {s.network}
                  </span>
                </td>
                <td>{s.type}</td>
                <td style={{ textAlign: 'right' }}>{s.cards.toLocaleString()}</td>
                <td><StatusPill status={s.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>Total {AppData.subPrograms.length} items</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

// ── Nested Program ────────────────────────────────────────────
function NestedProgramView({ navigate }) {
  const nested = [
    { name: 'Acme Retail Co-Brand', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Active', valid: '07/03/2024 – 10/01/2024' },
    { name: 'Northwind Travel Plus', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Inactive', valid: '07/03/2024 – 10/01/2024' },
    { name: 'Globex Energy Fleet', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Under Review', valid: '07/03/2024 – 10/01/2024' },
    { name: 'Initech Office Supplies', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Active', valid: '07/03/2024 – 10/01/2024' },
    { name: 'Stark Industries Procure', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Active', valid: '07/03/2024 – 10/01/2024' },
    { name: 'Wayne Foundation Grants', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Active', valid: '07/03/2024 – 10/01/2024' },
    { name: 'Pied Piper Compression', merchant: '5546111, 5546333, 5546123', accounts: 'Finbank Saving Account 2222', status: 'Inactive', valid: '07/03/2024 – 10/01/2024' },
  ];

  return (
    <div className="content-inner fade-in" data-screen-label="Nested Programs">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nested Program</h1>
          <div className="page-subtitle">Merchant- or co-branded programs running under a sub-program</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14} />Create Nested Program</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Nested Program List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({nested.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 360 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search Sub-Program name, merchant name, ID, card type" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nested Program Name</th>
              <th>Merchant ID</th>
              <th>Status</th>
              <th>Accounts</th>
              <th>Valid Through</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {nested.map((n, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{n.name}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {n.merchant.split(', ').slice(0, 3).map(m => <span key={m} className="tag mono">{m}</span>)}
                    {n.merchant.split(', ').length > 3 && <span className="tag --more">+{n.merchant.split(', ').length - 3}</span>}
                  </div>
                </td>
                <td><StatusPill status={n.status} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ProgramLogo size={22} />
                    <span style={{ fontSize: 13 }}>{n.accounts}</span>
                  </div>
                </td>
                <td className="muted">{n.valid}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost" style={{ color: n.status === 'Active' || n.status === 'Under Review' ? 'var(--fta-primary-6)' : 'var(--fta-text-4)' }}>
                    {n.status === 'Active' || n.status === 'Under Review' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>Total 9 items · 3,104 cards under nested</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

// ── Cards (all cards) ──────────────────────────────────────────
function CardsView({ navigate }) {
  const cards = AppData.customers.slice(0, 8).flatMap(c => {
    const seed = parseInt(c.id.replace(/\D/g, '')) || 1;
    return Array.from({ length: Math.min(3, c.cards) }).map((_, i) => ({
      id: `${c.id}-${i}`,
      brand: 'Neo Bank',
      last4: ['4142', '8211', '6190', '3022', '7711', '0048', '1955', '6624', '3320'][(i + seed) % 9],
      exp: '06/25',
      type: ['Physical', 'Virtual', 'Virtual'][(i + seed) % 3],
      network: ['Visa', 'Visa', 'Mastercard'][(i + seed) % 3],
      holder: c.name,
      status: c.status === 'Active' ? 'Active' : c.status,
    }));
  });

  return (
    <div className="content-inner fade-in" data-screen-label="Cards">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cards</h1>
          <div className="page-subtitle">All cards across programs · {cards.length.toLocaleString()} active</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14} />Issue Card</button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <FilterField label="Type" style={{ width: 160 }}>
            <select defaultValue="All"><option>All</option><option>Physical</option><option>Virtual</option></select>
          </FilterField>
          <FilterField label="Network" style={{ width: 160 }}>
            <select defaultValue="All"><option>All</option><option>Visa</option><option>Mastercard</option></select>
          </FilterField>
          <FilterField label="Status" style={{ width: 160 }}>
            <select defaultValue="All"><option>All</option><option>Active</option><option>Frozen</option><option>Closed</option></select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <div className="input" style={{ width: 280 }}>
            <Icon name="search" className="ico" />
            <input placeholder="Search by last 4, holder" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {cards.slice(0, 12).map(c => <CreditCardArt key={c.id} card={c} />)}
        </div>
      </div>
    </div>
  );
}

// ── Transactions ──────────────────────────────────────────────
function TransactionsView({ navigate }) {
  const tx = buildTransactions();
  return (
    <div className="content-inner fade-in" data-screen-label="Transactions">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <div className="page-subtitle">All authorizations across programs · As of 03/12/2024</div>
        </div>
        <button className="btn btn-primary"><Icon name="download" size={14} />Export</button>
      </div>

      <div className="grid-4">
        <SmallStat label="Settled Today" value="$ 6,184,210.55" icon="shield" tone="green" />
        <SmallStat label="Approved" value="127,051" icon="check" tone="navy" />
        <SmallStat label="Declined" value="1,842" icon="x" tone="peach" />
        <SmallStat label="Disputed" value="36" icon="message" tone="pink" />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Recent Transactions <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({tx.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 320 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search merchant, holder, transaction ID" />
            </div>
            <button className="btn btn-sm btn-ghost"><Icon name="filter" size={12} />Filter</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Holder</th>
              <th>Card</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>MCC</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tx.map(t => (
              <tr key={t.id}>
                <td className="muted">{t.dt}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColorAvatar name={t.holder} size="sm" />
                    {t.holder}
                  </div>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <NetworkMark network={t.network} />
                    <span className="mono">{t.last4}</span>
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{t.merchant}</td>
                <td>{t.category}</td>
                <td className="mono muted">{t.mcc}</td>
                <td style={{ textAlign: 'right', fontWeight: 500, color: t.status === 'Declined' ? 'var(--fta-destructive)' : 'var(--fta-text-5)' }}>
                  {t.status === 'Declined' ? '—' : '$'}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td><StatusPill status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>Showing 15 of 127,051,901 transactions</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

function buildTransactions() {
  const merchants = [
    { m: 'Amazon Mktp', cat: 'Online Retail', mcc: '5942' },
    { m: 'Whole Foods', cat: 'Groceries', mcc: '5411' },
    { m: 'Delta Airlines', cat: 'Travel', mcc: '4511' },
    { m: 'Shell Oil',    cat: 'Fuel', mcc: '5541' },
    { m: 'Spotify USA',  cat: 'Entertainment', mcc: '4899' },
    { m: 'Walmart Supercenter', cat: 'Retail', mcc: '5310' },
    { m: 'Starbucks',    cat: 'Dining', mcc: '5814' },
    { m: 'Lyft',         cat: 'Transit', mcc: '4111' },
    { m: 'Apple iCloud', cat: 'Subscriptions', mcc: '7372' },
    { m: 'Trader Joe\'s',cat: 'Groceries', mcc: '5411' },
    { m: 'CVS Pharmacy', cat: 'Health', mcc: '5912' },
    { m: 'Target',       cat: 'Retail', mcc: '5310' },
    { m: 'Wells Fargo ATM', cat: 'Cash', mcc: '6011' },
    { m: 'United Airlines', cat: 'Travel', mcc: '4511' },
    { m: 'Best Buy',     cat: 'Electronics', mcc: '5732' },
  ];
  const customers = AppData.customers;
  const statuses = ['Active', 'Active', 'Active', 'Active', 'Declined', 'Disputed'];
  return merchants.map((mm, i) => {
    const c = customers[i % customers.length];
    return {
      id: 'TX-' + (1024 + i),
      dt: `03/12/2024 ${String(14 - Math.floor(i / 3)).padStart(2, '0')}:${String(56 - i*3).padStart(2,'0')}`,
      holder: c.name,
      last4: ['4142', '8211', '6190', '3022', '7711'][i % 5],
      network: i % 3 === 0 ? 'Mastercard' : 'Visa',
      merchant: mm.m,
      category: mm.cat,
      mcc: mm.mcc,
      amount: [12.40, 84.32, 384.18, 47.95, 9.99, 142.65, 6.85, 11.20, 2.99, 56.40, 38.21, 76.10, 200.00, 612.55, 1284.99][i % 15],
      status: statuses[i % statuses.length] === 'Active' ? (i === 4 ? 'Declined' : (i === 12 ? 'Disputed' : 'Active')) : statuses[i % statuses.length],
    };
  });
}

// ── Fraud Alerts (Flow 5 §4.5) ────────────────────────────────
function FraudView({ navigate }) {
  const alerts = AppData.fraud;
  const open = alerts.filter(a => a.status === 'Open').length;
  return (
    <div className="content-inner fade-in" data-screen-label="Fraud Alerts">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fraud Alerts</h1>
          <div className="page-subtitle">Transactions flagged by the fraud engine · {open} open · As of 03/12/2026</div>
        </div>
        <div className="select" style={{ width: 160 }}>
          <select defaultValue="All Status"><option>All Status</option><option>Open</option><option>Confirmed</option><option>Dismissed</option></select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Flagged Transactions <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({alerts.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 280 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search alert, holder, merchant" />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Alert</th>
              <th>Cardholder</th>
              <th>Card</th>
              <th>Merchant</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th>Fraud Score</th>
              <th>Signal</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id}>
                <td className="mono" style={{ fontWeight: 500, color: 'var(--fta-primary-6)' }}>{a.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColorAvatar name={a.name} size="sm" />{a.name}
                  </div>
                </td>
                <td className="mono">{a.card}</td>
                <td>{a.merchant}</td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>${a.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 44, height: 6, borderRadius: 3, background: 'var(--fta-fill-3)', overflow: 'hidden' }}>
                      <div style={{ width: (a.score * 100) + '%', height: '100%', background: a.score > 0.85 ? 'var(--fta-destructive)' : a.score > 0.6 ? 'var(--fta-warning)' : 'var(--fta-success)' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: a.score > 0.85 ? 'var(--fta-destructive)' : 'var(--fta-text-5)' }}>{a.score.toFixed(2)}</span>
                  </div>
                </td>
                <td className="muted" style={{ fontSize: 12 }}>{a.reason}</td>
                <td><StatusPill status={a.status === 'Open' ? 'Pending' : a.status === 'Confirmed' ? 'Disputed' : 'Inactive'} /></td>
                <td style={{ textAlign: 'right' }}>
                  {a.status === 'Open'
                    ? <div style={{ display: 'inline-flex', gap: 4 }}>
                        <button className="btn btn-sm btn-ghost">Dismiss</button>
                        <button className="btn btn-sm btn-outline">Freeze</button>
                      </div>
                    : <button className="btn btn-sm btn-ghost">View</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>One-click freeze escalates to Cardholder Mgmt · links to dispute & account context</span>
          <Pager />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SubProgramsView, NestedProgramView, CardsView, TransactionsView, FraudView });
