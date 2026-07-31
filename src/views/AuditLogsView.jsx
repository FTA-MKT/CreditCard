import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { Field, EnDateInput } from '../components/shared';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableActionHead, TableActionCell } from '../components/ui/table';
import { StandardDataTable } from '../components/business/data-display/StandardDataTable';
import { useDataTableState } from '../components/business/data-display/useDataTableControls';
import { DataTableEmptyStateRow } from '../components/business/data-display/DataTableEmptyState';
import { DataTableFilters, DataTableFilterField, DataTableFilterLabel } from '../components/business/data-display/DataTableWorkbench';
import { DataTableFilterActions } from '../components/business/data-display/DataTableFilterActions';
import AppData from '../data/AppData';

export default function AuditLogsView({ navigate, navParam }) {
  if (navParam) {
    const entry = AppData.auditLogs.find(a => a.id === navParam);
    if (entry) return <AuditLogDetail entry={entry} navigate={navigate} />;
  }
  return <AuditLogList navigate={navigate} />;
}

function toISODate(timestamp) {
  const m = timestamp.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? `${m[3]}-${m[1]}-${m[2]}` : '';
}

function AuditLogList({ navigate }) {
  const logs = AppData.auditLogs;
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [userFilter, setUserFilter] = useState('All Users');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [resourceFilter, setResourceFilter] = useState('All Resources');

  const userOptions = [...new Set(logs.map(a => a.user))].sort();
  const actionOptions = [...new Set(logs.map(a => a.action))].sort();
  const resourceOptions = [...new Set(logs.map(a => a.resourceType))].sort();

  const filteredData = logs.filter(a => {
    const iso = toISODate(a.timestamp);
    const matchFrom = !dateFrom || (iso && iso >= dateFrom);
    const matchTo = !dateTo || (iso && iso <= dateTo);
    const matchUser = userFilter === 'All Users' || a.user === userFilter;
    const matchAction = actionFilter === 'All Actions' || a.action === actionFilter;
    const matchResource = resourceFilter === 'All Resources' || a.resourceType === resourceFilter;
    return matchFrom && matchTo && matchUser && matchAction && matchResource;
  });

  const state = useDataTableState({
    data: filteredData,
    searchPredicate: (a, q) =>
      a.user.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.resource.toLowerCase().includes(q) ||
      a.resourceId.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q),
  });

  function handleReset() {
    setDateFrom('');
    setDateTo('');
    setUserFilter('All Users');
    setActionFilter('All Actions');
    setResourceFilter('All Resources');
    state.setSearch('');
  }

  return (
    <div className="content-inner fade-in" data-screen-label="Audit Logs">
      <Breadcrumb navigate={navigate} items={[{ label: 'Settings', route: 'settings' }, { label: 'Audit Logs' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <div className="page-subtitle">Track user activities, configuration changes, and system events.</div>
        </div>
      </div>

      <DataTableFilters>
        <DataTableFilterField>
          <DataTableFilterLabel>From</DataTableFilterLabel>
          <div className="input" style={{ position: 'relative' }}><EnDateInput value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>To</DataTableFilterLabel>
          <div className="input" style={{ position: 'relative' }}><EnDateInput value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>User</DataTableFilterLabel>
          <div className="select">
            <select value={userFilter} onChange={e => setUserFilter(e.target.value)}>
              <option>All Users</option>
              {userOptions.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Action</DataTableFilterLabel>
          <div className="select">
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option>All Actions</option>
              {actionOptions.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterField>
          <DataTableFilterLabel>Resource</DataTableFilterLabel>
          <div className="select">
            <select value={resourceFilter} onChange={e => setResourceFilter(e.target.value)}>
              <option>All Resources</option>
              {resourceOptions.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </DataTableFilterField>
        <DataTableFilterActions onReset={handleReset} />
      </DataTableFilters>

      <StandardDataTable
        title="Audit Log"
        search={{
          value: state.search,
          onChange: state.setSearch,
          placeholder: 'Search user, action, resource, description',
        }}
        state={state}
        tableProps={{ widthBehavior: 'fill', showColumnBorders: false }}
        header={
          <TableHeader>
            <TableRow>
              <TableHead columnId="audit-timestamp">Timestamp</TableHead>
              <TableHead columnId="audit-user">User</TableHead>
              <TableHead columnId="audit-action">Action</TableHead>
              <TableHead columnId="audit-resource">Resource</TableHead>
              <TableHead columnId="audit-description">Description</TableHead>
              <TableHead columnId="audit-status">Status</TableHead>
              <TableActionHead />
            </TableRow>
          </TableHeader>
        }
        renderRows={(s) =>
          s.pageRows.map((a) => (
            <TableRow key={a.id} className="cursor-pointer" onClick={() => navigate('audit-log-detail', a.id)}>
              <TableCell className="mono muted">{a.timestamp}</TableCell>
              <TableCell style={{ fontWeight: 500 }}>{a.user}</TableCell>
              <TableCell>{a.action}</TableCell>
              <TableCell>
                <div style={{ fontWeight: 500 }}>{a.resource}</div>
                <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)' }}>{a.resourceType}</div>
              </TableCell>
              <TableCell style={{ whiteSpace: 'normal' }}>{a.description}</TableCell>
              <TableCell><StatusPill status={a.status} /></TableCell>
              <TableActionCell>
                <button
                  className="text-sm text-primary hover:underline whitespace-nowrap"
                  onClick={e => { e.stopPropagation(); navigate('audit-log-detail', a.id); }}
                >
                  View
                </button>
              </TableActionCell>
            </TableRow>
          ))
        }
        emptyState={<DataTableEmptyStateRow colSpan={7} />}
      />
    </div>
  );
}

function formatValue(v) {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number') return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return String(v);
}

function AuditLogDetail({ entry, navigate }) {
  const hasChanges = entry.before || entry.after;
  const changedFields = hasChanges
    ? [...new Set([...Object.keys(entry.before || {}), ...Object.keys(entry.after || {})])]
    : [];

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Settings', route: 'settings' }, { label: 'Audit Logs', route: 'audit-logs' }, { label: entry.id }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {entry.action} {entry.resourceType} <StatusPill status={entry.status} />
          </h1>
          <div className="page-subtitle">{entry.id} · {entry.timestamp}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-section-title">Event Summary</div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="User" value={entry.user} />
            <Field label="Timestamp" value={entry.timestamp} />
          </div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Resource" value={entry.resource} />
            <Field label="Resource ID" value={entry.resourceId} />
          </div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="Action" value={entry.action} />
            <Field label="Status" valueNode={<StatusPill status={entry.status} />} />
          </div>
          <Field label="Description" value={entry.description} />
        </div>

        <div className="card">
          <div className="card-section-title">Before / After Changes</div>
          {changedFields.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--fta-text-4)' }}>This event does not have any field-level changes.</div>
          ) : (
            <Table framed={false} widthBehavior="fill" showColumnBorders={false}>
              <TableHeader>
                <TableRow>
                  <TableHead columnId="change-field">Field</TableHead>
                  <TableHead columnId="change-before">Before</TableHead>
                  <TableHead columnId="change-after">After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changedFields.map(field => (
                  <TableRow key={field}>
                    <TableCell style={{ fontWeight: 500, textTransform: 'capitalize' }}>{field.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                    <TableCell className="muted">{formatValue(entry.before?.[field])}</TableCell>
                    <TableCell style={{ fontWeight: 500 }}>{formatValue(entry.after?.[field])}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="card">
          <div className="card-section-title">Metadata</div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Field label="IP Address" value={entry.metadata?.ipAddress} />
            <Field label="Session / Job ID" value={entry.metadata?.sessionId} />
          </div>
          <Field label="User Agent" value={entry.metadata?.userAgent} />
        </div>
      </div>
    </div>
  );
}
