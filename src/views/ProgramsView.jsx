import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, Field, Pager, ProgramLogo, NetworkMark } from '../components/shared';
import { Button } from '../components/ui/button';
import { TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import AppData from '../data/AppData';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';

export default function ProgramsView({ navigate, navParam, initialTab }) {
  if (navParam) {
    const program = AppData.programs.find(p => p.id === navParam);
    if (program) return <ProgramDetail program={program} navigate={navigate} initialTab={initialTab} />;
  }
  return <ProgramList navigate={navigate} />;
}

function ProgramList({ navigate }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const filteredData = AppData.programs.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (industryFilter && p.industry !== industryFilter) return false;
    return true;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (p, q) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.contact.toLowerCase().includes(q),
  });

  const uniqueStatuses = [...new Set(AppData.programs.map(p => p.status))].filter(Boolean).sort();
  const uniqueIndustries = [...new Set(AppData.programs.map(p => p.industry))].filter(Boolean).sort();

  function handleReset() {
    setStatusFilter('');
    setIndustryFilter('');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in" data-screen-label="Programs List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Program</h1>
          <div className="page-subtitle">Card programs and their sub-programs · As of 03/12/2024</div>
        </div>
      </div>

      {/* Filter bar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
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
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Industry</span>
              <div className="select" style={{ width: 200 }}>
                <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueIndustries.map(i => <option key={i} value={i}>{i}</option>)}
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
        title="Program List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search program name, ID, contact',
        }}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0 7px', height: 32, display: 'flex', alignItems: 'center' }} title="Grid view">
              <LayoutGrid size={15} />
            </button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0 7px', height: 32, display: 'flex', alignItems: 'center' }} title="List view">
              <List size={15} />
            </button>
            <Button onClick={() => navigate('create-program')}>
              <Plus size={14} />
              Create Program
            </Button>
          </div>
        }
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="program-name">Program Name</TableHead>
              <TableHead columnId="program-status">Status</TableHead>
              <TableHead columnId="program-industry">Industry</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(s) =>
          s.pageRows.map((p) => (
            <TableRow
              key={p.id}
              className="cursor-pointer"
              onClick={() => navigate('program-detail', p.id)}
            >
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ProgramLogo />
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <ProgramStatusDot status={p.status} />
              </TableCell>
              <TableCell>{p.industry}</TableCell>
              <TableActionCell>
                <button
                  className="text-sm text-primary hover:underline whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </TableActionCell>
            </TableRow>
          ))
        }
        emptyState={<DataTableEmptyStateRow colSpan={4} />}
      />
    </div>
  );
}

function ProgramStatusDot({ status }) {
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

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-9">
          <TabsTrigger value="details"><Icon name="list" className="ico" />Program Details</TabsTrigger>
          <TabsTrigger value="subs"><Icon name="card" className="ico" />Sub-program</TabsTrigger>
          <TabsTrigger value="files"><Icon name="file" className="ico" />Files</TabsTrigger>
        </TabsList>
        <TabsContent value="details"><ProgramDetailsForm program={program} /></TabsContent>
        <TabsContent value="subs"><SubProgramsList programId={program.id} navigate={navigate} /></TabsContent>
        <TabsContent value="files"><FilesEmpty /></TabsContent>
      </Tabs>
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
  const [statusFilter, setStatusFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [formFactorFilter, setFormFactorFilter] = useState('');

  const allSubs = AppData.subPrograms.filter(s => s.programId === programId);

  const filteredData = allSubs.filter(s => {
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
      s.id.toLowerCase().includes(q),
  });

  const uniqueStatuses = [...new Set(allSubs.map(s => s.status))].filter(Boolean).sort();
  const uniqueNetworks = [...new Set(allSubs.map(s => s.network))].filter(Boolean).sort();
  const uniqueClassifications = [...new Set(allSubs.map(s => s.classification))].filter(Boolean).sort();

  function handleReset() {
    setStatusFilter('');
    setNetworkFilter('');
    setClassificationFilter('');
    setFormFactorFilter('');
    state.setSearch('');
  }

  return (
    <div>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Status</span>
              <div className="select" style={{ width: 140 }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Network</span>
              <div className="select" style={{ width: 140 }}>
                <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueNetworks.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Classification Type</span>
              <div className="select" style={{ width: 160 }}>
                <select value={classificationFilter} onChange={e => setClassificationFilter(e.target.value)}>
                  <option value="">Please Select</option>
                  {uniqueClassifications.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fta-text-4)' }}>Physical / Virtual</span>
              <div className="select" style={{ width: 140 }}>
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

      <div style={{ marginTop: 12 }}>
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
            <Button size="sm" onClick={() => navigate('create-subprogram', programId)}>
              <Plus size={13} />
              Create Sub-program
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
              onClick={() => navigate('subprogram-detail', { id: sub.id, from: 'program' })}
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
  const hasPhysical = formFactors?.includes('physical') || type === 'Physical';
  const hasVirtual = formFactors?.includes('virtual') || type === 'Virtual';
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
