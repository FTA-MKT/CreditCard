import React, { useState } from 'react';
import { Icon, Breadcrumb } from '../components/Shell';
import { Toggle } from '../components/shared';
import { RadioGroup } from '../components/forms/RadioGroup';
import AppData from '../data/AppData';

// Methods surfaced on the Allowed Autopay Methods panel, in spec order (Minimum, Statement, Fixed).
const ALLOWED_METHOD_IDS = ['minimum', 'full', 'fixed'];
const METHOD_LABELS = { minimum: 'Minimum Payment Due', full: 'Statement Balance', fixed: 'Fixed Amount' };

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

function scheduleSummary(type, days) {
  return type === 'due_date' ? 'Due date' : `${days} day${Number(days) === 1 ? '' : 's'} before due date`;
}

// Autopay Policy is a single Program-level configuration page — not an operations
// center. Enrollment, execution monitoring, and audit trails belong to Cardholder
// Account management / a future Autopay Operations phase, not this page.
export default function AutopayView({ navigate }) {
  const p = AppData.autopay.policy;
  const [enabled, setEnabled] = useState(p.enabled ?? true);
  const [modes, setModes] = useState(p.modes);
  const [timing, setTiming] = useState(p.timing === 'On Due Date' ? 'due_date' : 'days_before');
  const [offsetDays, setOffsetDays] = useState(p.offsetDays);
  const [reminder, setReminder] = useState(p.reminder);
  const [reminderDays, setReminderDays] = useState(p.reminderDays);
  const [changes, setChanges] = useState([
    { id: 'C-2', summary: 'Admin changed execution timing', detail: 'Due date → 3 days before due date', when: 'Yesterday' },
    { id: 'C-1', summary: 'Admin updated autopay methods', detail: 'Statement Balance: OFF → ON', when: '2 days ago' },
  ]);
  const [saved, setSaved] = useState(false);
  const [toast, showToast] = useToast();

  function toggleMethod(id) {
    setModes(ms => {
      const target = ms.find(m => m.id === id);
      if (!target || target.locked) return ms;
      if (target.checked && ms.filter(m => m.checked && ALLOWED_METHOD_IDS.includes(m.id)).length <= 1) {
        showToast('At least one autopay method must remain enabled.');
        return ms;
      }
      return ms.map(m => m.id === id ? { ...m, checked: !m.checked } : m);
    });
  }

  function handleSave() {
    const lines = [];

    if ((p.enabled ?? true) !== enabled) {
      lines.push({ id: `C-${Date.now()}-status`, summary: 'Admin changed policy status', detail: `${enabled ? 'Disabled' : 'Enabled'} → ${enabled ? 'Enabled' : 'Disabled'}`, when: 'Just now' });
    }

    const prevModesById = Object.fromEntries(p.modes.map(m => [m.id, m.checked]));
    const methodChanges = [];
    ALLOWED_METHOD_IDS.forEach(id => {
      const m = modes.find(x => x.id === id);
      if (m && prevModesById[id] !== m.checked) {
        methodChanges.push(`${METHOD_LABELS[id]}: ${prevModesById[id] ? 'ON' : 'OFF'} → ${m.checked ? 'ON' : 'OFF'}`);
      }
    });
    if (methodChanges.length) {
      lines.push({ id: `C-${Date.now()}-methods`, summary: 'Admin updated autopay methods', detail: methodChanges.join('; '), when: 'Just now' });
    }

    const prevSchedule = scheduleSummary(p.timing === 'On Due Date' ? 'due_date' : 'days_before', p.offsetDays);
    const nextSchedule = scheduleSummary(timing, offsetDays);
    if (prevSchedule !== nextSchedule) {
      lines.push({ id: `C-${Date.now()}-schedule`, summary: 'Admin changed execution timing', detail: `${prevSchedule} → ${nextSchedule}`, when: 'Just now' });
    }

    if ((p.reminder ?? false) !== reminder) {
      lines.push({ id: `C-${Date.now()}-reminder`, summary: 'Admin updated payment reminder', detail: reminder ? `Disabled → Enabled (${reminderDays} days before)` : 'Enabled → Disabled', when: 'Just now' });
    } else if (reminder && p.reminderDays !== Number(reminderDays)) {
      lines.push({ id: `C-${Date.now()}-reminder-days`, summary: 'Admin updated payment reminder', detail: `${p.reminderDays} days before → ${reminderDays} days before`, when: 'Just now' });
    }

    if (lines.length) setChanges(prev => [...lines, ...prev]);

    AppData.autopay.policy = {
      ...p,
      enabled,
      modes,
      timing: timing === 'due_date' ? 'On Due Date' : `${offsetDays} Days Before Due`,
      offsetDays: Number(offsetDays),
      reminder,
      reminderDays: Number(reminderDays),
    };

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const enabledCount = modes.filter(m => m.checked && ALLOWED_METHOD_IDS.includes(m.id)).length;

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Settings', route: 'settings' }, { label: 'Autopay Policy' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Autopay Policy</h1>
          <div className="page-subtitle">Manage autopay availability and payment execution rules for this program.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-4)' }}>Autopay {enabled ? 'Enabled' : 'Disabled'}</span>
          <Toggle on={enabled} onClick={() => setEnabled(e => !e)} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -4 }}>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>{saved ? 'Saved ✓' : 'Save Changes'}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Section 1: Allowed Payment Methods */}
        <div className="card">
          <div className="card-section-title">Allowed Autopay Methods</div>
          <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginBottom: 14 }}>Configure which autopay options are available to cardholders.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ALLOWED_METHOD_IDS.map(id => {
              const m = modes.find(x => x.id === id);
              if (!m) return null;
              const desc = id === 'minimum'
                ? 'Required safety payment method. Cannot be disabled.'
                : id === 'full'
                ? 'Automatically pay the full statement balance.'
                : 'Allow cardholders to set a fixed payment amount.';
              return (
                <div key={m.id} style={{ border: '1px solid var(--fta-line-3)', borderRadius: 10, padding: 14, background: m.locked ? 'var(--fta-fill-2)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {METHOD_LABELS[id]}
                        {m.locked && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: '#e2e8f0', color: 'var(--fta-text-4)', textTransform: 'uppercase', letterSpacing: 0.3 }}>Locked</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 3 }}>{desc}</div>
                    </div>
                    <Toggle on={m.checked} onClick={() => toggleMethod(m.id)} disabled={m.locked || !enabled} />
                  </div>
                </div>
              );
            })}
          </div>
          {enabledCount === 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fta-error)' }}>At least one autopay method must remain enabled.</div>
          )}
        </div>

        {/* Section 2: Payment Schedule */}
        <div className="card">
          <div className="card-section-title">Execution Schedule</div>
          <RadioGroup
            name="autopay-timing"
            value={timing}
            onChange={setTiming}
            options={[
              { value: 'due_date', label: 'Execute on payment due date' },
              { value: 'days_before', label: 'Execute before due date' },
            ]}
          />
          {timing === 'days_before' && (
            <div style={{ marginTop: 14, maxWidth: 220 }}>
              <div className="field-label">Days Before Due Date</div>
              <div className="input"><input type="number" value={offsetDays} onChange={e => setOffsetDays(e.target.value)} min={1} max={30} /></div>
            </div>
          )}
        </div>

        {/* Section 3: Payment Reminder */}
        <div className="card">
          <div className="card-section-title">Payment Reminder</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: reminder ? 16 : 0 }}>
            <div style={{ fontWeight: 500 }}>Enable reminder</div>
            <Toggle on={reminder} onClick={() => setReminder(r => !r)} />
          </div>
          {reminder && (
            <div style={{ maxWidth: 220 }}>
              <div className="field-label">Reminder Timing (Days Before Payment)</div>
              <div className="input"><input type="number" value={reminderDays} onChange={e => setReminderDays(e.target.value)} min={1} max={14} /></div>
            </div>
          )}
        </div>

        {/* Section 4: Failure Handling */}
        <div className="card">
          <div className="card-section-title">Payment Failure Handling</div>
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            Automatic Retry <strong>Disabled</strong> <Icon name="lock" size={12} style={{ color: 'var(--fta-text-3)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--fta-text-4)' }}>
            Failed autopay payments require cardholder action. This is a fixed product rule and is not admin-configurable.
          </div>
        </div>

        {/* Section 5: Recent Changes */}
        <div className="card">
          <div className="card-section-title">Recent Changes</div>
          {changes.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--fta-text-4)' }}>No changes yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {changes.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--fta-line-3)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.summary}</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2 }}>{c.detail}</div>
                  </div>
                  <div className="muted-2" style={{ fontSize: 11.5, flexShrink: 0, whiteSpace: 'nowrap' }}>Updated: {c.when}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastBanner message={toast} />
    </div>
  );
}
