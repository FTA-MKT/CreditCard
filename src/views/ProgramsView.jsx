import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, FilterField, Field, Pager, ProgramLogo, NetworkMark } from '../components/shared';
import AppData from '../data/AppData';

export default function ProgramsView({ navigate, navParam, initialTab }) {
  if (navParam) {
    const program = AppData.programs.find(p => p.id === navParam);
    if (program) return <ProgramDetail program={program} navigate={navigate} initialTab={initialTab} />;
  }
  return <ProgramList navigate={navigate} />;
}

function ProgramList({ navigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

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
        <button className="btn btn-primary" onClick={() => navigate('create-program')}>
          <Icon name="plus" size={14} />
          Create Program
        </button>
      </div>

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
            <select defaultValue="All"><option>All</option><option>Visa</option><option>Mastercard</option></select>
          </FilterField>
          <FilterField label="Date Range" style={{ width: 200 }}>
            <select defaultValue="Last 90 days"><option>Last 90 days</option><option>Last 30 days</option><option>Year-to-date</option></select>
          </FilterField>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatusFilter('All Status'); }}>Reset</button>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
          <h2>Program List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({filtered.length})</span></h2>
          <div className="right">
            <div className="input" style={{ width: 320 }}>
              <Icon name="search" className="ico" />
              <input placeholder="Search program name, ID, contact" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Program Name</th><th>Program ID</th><th>Contact</th><th>Account Manager</th>
              <th style={{ textAlign: 'right' }}>Sub-programs</th><th style={{ textAlign: 'right' }}>Cards Issued</th>
              <th>Status</th><th>Last Updated</th><th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="--clickable" onClick={() => navigate('program-detail', p.id)}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><ProgramLogo /><span style={{ fontWeight: 500 }}>{p.name}</span></div></td>
                <td className="mono muted">{p.id}</td>
                <td>{p.contact}</td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ColorAvatar name={p.manager} size="sm" /><span>{p.manager}</span></div></td>
                <td style={{ textAlign: 'right' }}>{p.subs}</td>
                <td style={{ textAlign: 'right' }}>{p.cards.toLocaleString()}</td>
                <td><StatusPill status={p.status} /></td>
                <td className="muted">{p.updated}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); navigate('program-detail', p.id); }}>View</button>
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

function ProgramDetail({ program, navigate, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'details');
  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Program', route: 'programs' }, { label: program.name }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {program.name} <StatusPill status={program.status} />
          </h1>
          <div className="page-subtitle">Program ID {program.id} · {program.cards.toLocaleString()} active cards · {program.subs} sub-programs</div>
        </div>
        <button className="btn btn-primary"><Icon name="edit" size={14} />Edit</button>
      </div>

      <div className="tabpills">
        <button className={"tabpill" + (tab === 'details' ? ' --active' : '')} onClick={() => setTab('details')}><Icon name="list" className="ico" />Program Details</button>
        <button className={"tabpill" + (tab === 'subs' ? ' --active' : '')} onClick={() => setTab('subs')}><Icon name="card" className="ico" />Sub-program</button>
        <button className={"tabpill" + (tab === 'files' ? ' --active' : '')} onClick={() => setTab('files')}><Icon name="file" className="ico" />Files</button>
      </div>

      {tab === 'details' && <ProgramDetailsForm program={program} />}
      {tab === 'subs' && <SubProgramsList programId={program.id} navigate={navigate} />}
      {tab === 'files' && <FilesEmpty />}
    </div>
  );
}

function ProgramDetailsForm({ program }) {
  return (
    <div className="card">
      <div className="card-section-title">General Information</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'flex-end' }}>
        <div><div className="field-label">Logo</div><ProgramLogo size={72} /></div>
        <button className="btn btn-primary btn-sm"><Icon name="upload" size={12} />Upload</button>
      </div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Program Name" value={program.name} editable />
        <Field label="Status" valueNode={<StatusPill status={program.status} />} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Field label="Description" value={program.description || ''} editable />
      </div>
      <div className="card-section-title">Details of Cooperation</div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Contact Information</div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Contact Name" value={program.contact} prefix={<ColorAvatar name={program.contact} size="sm" />} editable />
        <Field label="Phone" value={program.contactPhone || ''} />
      </div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <Field label="Email" value={program.contactEmail || ''} />
        <Field label="Address" value={program.contactAddress || ''} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Account Manager Information</div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Account Manager" value={program.manager} prefix={<ColorAvatar name={program.manager} size="sm" />} editable />
        <Field label="Phone" value={program.managerPhone || ''} />
      </div>
      <div className="grid-2">
        <Field label="Email" value={program.managerEmail || ''} />
        <Field label="Address" value={program.managerAddress || ''} />
      </div>
    </div>
  );
}

function SubProgramsList({ programId, navigate }) {
  const subs = AppData.subPrograms.filter(s => s.programId === programId);
  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="table-toolbar" style={{ padding: '16px 20px 0' }}>
        <h2>Sub-program List <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({subs.length})</span></h2>
        <div className="right">
          <div className="input" style={{ width: 280 }}>
            <Icon name="search" className="ico" />
            <input placeholder="Search Sub-Program name, ID, BIN" />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('create-subprogram', programId)}><Icon name="plus" size={12} />Create Sub-program</button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Sub-program Name</th><th>Sub-program ID</th><th>BIN Prefix</th><th>Network</th>
            <th>Type</th><th style={{ textAlign: 'right' }}>Cards</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {subs.length === 0 ? (
            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--fta-text-3)', fontSize: 13 }}>No sub-programs yet. Click "Create Sub-program" to add one.</td></tr>
          ) : subs.map(s => (
            <tr key={s.id} className="--clickable" onClick={() => navigate('subprogram-detail', { id: s.id, from: 'program' })}>
              <td style={{ fontWeight: 500 }}>{s.name}</td>
              <td className="mono muted">{s.id}</td>
              <td className="mono">{s.bin}</td>
              <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={s.network} />{s.network}</span></td>
              <td>{s.type}</td>
              <td style={{ textAlign: 'right' }}>{(s.cards || 0).toLocaleString()}</td>
              <td><StatusPill status={s.status} /></td>
              <td style={{ textAlign: 'right' }}>
                <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); navigate('subprogram-detail', { id: s.id, from: 'program' }); }}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-foot"><span>Total {subs.length} items</span><Pager /></div>
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
