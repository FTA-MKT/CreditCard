/* global React, Icon, StatusPill, Breadcrumb, ColorAvatar, AppData, initials */
// views/programs.jsx — Program list + Program detail

const { useState: useStateProg } = React;

function ProgramsView({ navigate, navParam }) {
  if (navParam) {
    const program = AppData.programs.find(p => p.id === navParam);
    if (program) return <ProgramDetail program={program} navigate={navigate} />;
  }
  return <ProgramList navigate={navigate} />;
}

// ── Program List ────────────────────────────────────────────
function ProgramList({ navigate }) {
  const [search, setSearch] = useStateProg('');
  const [statusFilter, setStatusFilter] = useStateProg('All Status');

  const filtered = AppData.programs.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="content-inner fade-in" data-screen-label="Programs List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Program</h1>
          <div className="page-subtitle">Card programs and their sub-programs · As of 03/12/2024</div>
        </div>
        <button className="btn btn-primary">
          <Icon name="plus" size={14} />
          Create Program
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FilterField label="Status" style={{ width: 200 }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Under Review</option>
            </select>
          </FilterField>
          <FilterField label="Network" style={{ width: 200 }}>
            <select defaultValue="All">
              <option>All</option>
              <option>Visa</option>
              <option>Mastercard</option>
            </select>
          </FilterField>
          <FilterField label="Date Range" style={{ width: 200 }}>
            <select defaultValue="Last 90 days">
              <option>Last 90 days</option>
              <option>Last 30 days</option>
              <option>Year-to-date</option>
            </select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatusFilter('All Status'); }}>Reset</button>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Program List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 320 }}>
              <Icon name="search" className="ico" />
              <input
                placeholder="Search program name, ID, contact"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Program ID</th>
              <th>Contact</th>
              <th>Account Manager</th>
              <th style={{ textAlign: 'right' }}>Sub-programs</th>
              <th style={{ textAlign: 'right' }}>Cards Issued</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="--clickable" onClick={() => navigate('program-detail', p.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ProgramLogo />
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </div>
                </td>
                <td className="mono muted">{p.id}</td>
                <td>{p.contact}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ColorAvatar name={p.manager} size="sm" />
                    <span>{p.manager}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>{p.subs}</td>
                <td style={{ textAlign: 'right' }}>{p.cards.toLocaleString()}</td>
                <td><StatusPill status={p.status} /></td>
                <td className="muted">{p.updated}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); navigate('program-detail', p.id); }}>View</button>
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

// ── Program Detail ────────────────────────────────────────────
function ProgramDetail({ program, navigate }) {
  const [tab, setTab] = useStateProg('details');
  return (
    <div className="content-inner fade-in" data-screen-label={"Program Detail " + program.id}>
      <Breadcrumb
        navigate={navigate}
        items={[
          { label: 'Program', route: 'programs' },
          { label: program.name },
        ]}
      />

      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {program.name}
            <StatusPill status={program.status} />
          </h1>
          <div className="page-subtitle">Program ID {program.id} · {program.cards.toLocaleString()} active cards · {program.subs} sub-programs</div>
        </div>
        <button className="btn btn-primary">
          <Icon name="edit" size={14} />
          Edit
        </button>
      </div>

      {/* Tab pills */}
      <div className="tabpills">
        <button className={"tabpill" + (tab==='details'?' --active':'')} onClick={()=>setTab('details')}><Icon name="list" className="ico" />Program Details</button>
        <button className={"tabpill" + (tab==='subs'?' --active':'')} onClick={()=>setTab('subs')}><Icon name="card" className="ico" />Sub-program</button>
        <button className={"tabpill" + (tab==='files'?' --active':'')} onClick={()=>setTab('files')}><Icon name="file" className="ico" />Files</button>
      </div>

      {tab === 'details' && <ProgramDetailsForm program={program} />}
      {tab === 'subs' && <SubProgramsList navigate={navigate} />}
      {tab === 'files' && <FilesEmpty />}
    </div>
  );
}

function ProgramDetailsForm({ program }) {
  return (
    <div className="card">
      <div className="card-section-title">General Information</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'flex-end' }}>
        <div>
          <div className="field-label">Logo</div>
          <ProgramLogo size={72} />
        </div>
        <button className="btn btn-primary btn-sm">
          <Icon name="upload" size={12} />
          Upload
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Program Name" value={program.name} editable />
        <Field label="Status" valueNode={<StatusPill status={program.status} />} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Field label="Description" value="Premium card program for Neo Banking — rewards, cashback, and travel benefits with low FX. Contracted by Fintech Automation on behalf of the issuing bank." editable />
      </div>

      <div className="card-section-title">Details of Cooperation</div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--fta-text-5)' }}>Contact Information</div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Contact Name" value={program.contact} prefix={<ColorAvatar name={program.contact} size="sm" />} editable />
        <Field label="Phone" value="(207) 555-0119" />
      </div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <Field label="Email" value="bwj@neobank.com" />
        <Field label="Address" value="2715 Ash Dr. San Jose, South Dakota 83475" />
      </div>

      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--fta-text-5)' }}>Account Manager Information</div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Account Manager" value={program.manager} prefix={<ColorAvatar name={program.manager} size="sm" />} editable />
        <Field label="Phone" value="(207) 555-0110" />
      </div>
      <div className="grid-2">
        <Field label="Email" value="brian.cooper@fintechautomation.com" />
        <Field label="Address" value="2715 Ash Dr. San Jose, South Dakota 83475" />
      </div>
    </div>
  );
}

function SubProgramsList({ navigate }) {
  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
        <h2>Sub-program List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({AppData.subPrograms.length})</span></h2>
        <div className="right">
          <div className="input" style={{ width: 280 }}>
            <Icon name="search" className="ico" />
            <input placeholder="Search Sub-Program name, ID, BIN" />
          </div>
          <button className="btn btn-primary btn-sm">
            <Icon name="plus" size={12} />
            Create Sub-program
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Sub-program Name</th>
            <th>Sub-program ID</th>
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
                <button className="btn btn-sm btn-ghost">
                  {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
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
  );
}

function FilesEmpty() {
  return (
    <div className="card" style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
        <Icon name="file" size={28} />
      </div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>No files attached yet</div>
      <div className="muted-2" style={{ fontSize: 13, marginBottom: 16 }}>Upload contracts, marketing assets, and program brand kits.</div>
      <button className="btn btn-primary"><Icon name="upload" size={14} />Upload File</button>
    </div>
  );
}

// ── shared bits ─────────────────────────────────────────────
function FilterField({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>{label}</div>
      <div className="select">{children}</div>
    </div>
  );
}

function Field({ label, value, valueNode, prefix, editable }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {prefix}
          <div className="field-value">{valueNode ?? value}</div>
        </div>
        {editable && <Icon name="edit" size={14} style={{ color: 'var(--fta-text-3)', flexShrink: 0 }} />}
      </div>
    </div>
  );
}

function Pager() {
  return (
    <div className="pager">
      <button disabled>‹</button>
      <button className="--active">1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
      <button>›</button>
    </div>
  );
}

function ProgramLogo({ size = 32 }) {
  // a small mark using brand colors — orange triangle + teal swoosh on navy
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size === 72 ? 12 : 6,
      background: '#0A1135',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path d="M4 20 L14 6 L20 20 Z" fill="#F1A943"/>
        <path d="M4 19 Q12 17 20 19 L20 21 Q12 19 4 21 Z" fill="#55D4D0"/>
      </svg>
    </div>
  );
}

function NetworkMark({ network }) {
  if (network === 'Visa') {
    return <span style={{ fontStyle: 'italic', fontWeight: 800, color: '#1A1F71', fontSize: 12, fontFamily: 'Georgia, serif' }}>VISA</span>;
  }
  return (
    <span style={{ display: 'inline-flex' }}>
      <span style={{ width: 14, height: 14, background: '#EB001B', borderRadius: 999 }} />
      <span style={{ width: 14, height: 14, background: '#F79E1B', borderRadius: 999, marginLeft: -6, opacity: 0.85 }} />
    </span>
  );
}

Object.assign(window, { ProgramsView, ProgramLogo, NetworkMark, Field, FilterField, Pager });
