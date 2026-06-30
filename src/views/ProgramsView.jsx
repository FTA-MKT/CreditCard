import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, Field, Pager, ProgramLogo, NetworkMark } from '../components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import AppData from '../data/AppData';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';

function statusVariant(status) {
  if (['Active', 'Published', 'Verified', 'Case Won', 'Posted'].includes(status)) return 'default';
  if (['Inactive', 'Closed', 'Case Closed'].includes(status)) return 'secondary';
  if (['Declined', 'Failed', 'At-Risk', 'Disputed'].includes(status)) return 'destructive';
  return 'outline';
}

export default function ProgramsView({ navigate, navParam, initialTab }) {
  if (navParam) {
    const program = AppData.programs.find(p => p.id === navParam);
    if (program) return <ProgramDetail program={program} navigate={navigate} initialTab={initialTab} />;
  }
  return <ProgramList navigate={navigate} />;
}

function ProgramList({ navigate }) {
  const state = useDataTableState({
    data: AppData.programs,
    searchPredicate: (p, q) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.contact.toLowerCase().includes(q),
  });

  return (
    <div className="content-inner fade-in" data-screen-label="Programs List">
      <div className="page-header">
        <div>
          <h1 className="page-title">Program</h1>
          <div className="page-subtitle">Card programs and their sub-programs · As of 03/12/2024</div>
        </div>
        <Button onClick={() => navigate('create-program')}>
          <Plus size={14} />
          Create Program
        </Button>
      </div>

      <StandardDataTable
        title="Program List"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search program name, ID, contact',
        }}
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
    <Card style={{ padding: 0 }}>
      <CardHeader style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--fta-line-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardTitle style={{ fontSize: 15 }}>
            Sub-program List
            <span style={{ color: 'var(--fta-text-3)', fontWeight: 400, fontSize: 13, marginLeft: 6 }}>({subs.length})</span>
          </CardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="input" style={{ width: 260 }}>
              <Search size={14} className="ico" style={{ color: 'var(--fta-text-3)' }} />
              <input placeholder="Search Sub-Program name, ID, BIN" />
            </div>
            <Button size="sm" onClick={() => navigate('create-subprogram', programId)}>
              <Plus size={13} />
              Create Sub-program
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent style={{ padding: 0 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead columnId="sub-name">Sub-program Name</TableHead>
              <TableHead columnId="sub-id">Sub-program ID</TableHead>
              <TableHead columnId="sub-bin">BIN Prefix</TableHead>
              <TableHead columnId="sub-network">Network</TableHead>
              <TableHead columnId="sub-type">Type</TableHead>
              <TableHead columnId="sub-cards" className="text-right">Cards</TableHead>
              <TableHead columnId="sub-status">Status</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-sm">
                  No sub-programs yet. Click "Create Sub-program" to add one.
                </TableCell>
              </TableRow>
            ) : subs.map(s => (
              <TableRow
                key={s.id}
                className="cursor-pointer"
                onClick={() => navigate('subprogram-detail', { id: s.id, from: 'program' })}
              >
                <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{s.id}</TableCell>
                <TableCell className="font-mono">{s.bin}</TableCell>
                <TableCell>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <NetworkMark network={s.network} />{s.network}
                  </span>
                </TableCell>
                <TableCell>{s.type}</TableCell>
                <TableCell className="text-right">{(s.cards || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
                </TableCell>
                <TableActionCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent text-muted-foreground"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={e => { e.stopPropagation(); navigate('subprogram-detail', { id: s.id, from: 'program' }); }}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableActionCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="table-foot">
          <span>Total {subs.length} items</span>
          <Pager />
        </div>
      </CardContent>
    </Card>
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
