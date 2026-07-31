import React, { useState } from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, NetworkMark, EnDateInput } from '../components/shared';
import { FormField } from '../components/forms/FormField';
import AppData from '../data/AppData';

const STEPS = ['Select Transaction', 'Dispute Details', 'Cardholder Statement', 'Evidence Upload', 'Review & Submit'];
const STEP_META = [
  'Choose the transaction to dispute',
  'Reason, amount & filing date',
  'Describe the reason for dispute',
  'Attach supporting evidence',
  'Confirm and create the case',
];

const DISPUTE_REASONS = [
  { value: 'Fraud / Unauthorized', code: '10.4' },
  { value: 'Billing Error', code: '12.6' },
  { value: 'Service Not Received', code: '13.3' },
  { value: 'Goods Not As Described / Quality', code: '13.1' },
  { value: 'Cancelled Recurring Transaction', code: '13.2' },
  { value: 'Credit Not Processed', code: '13.6' },
  { value: 'Processing Error', code: '12.1' },
];

const EVIDENCE_SOURCES = ['Cardholder', 'Merchant', 'Agent Investigation'];

const INELIGIBLE_REASONS = {
  Pending: "Pending transactions can't be disputed until they post.",
  Declined: 'Declined transactions were never charged and cannot be disputed.',
  Refunded: 'This transaction has already been refunded.',
  Reversed: 'This transaction has already been reversed.',
};

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function isoToUS(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function addDaysUS(iso, days) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}

function nextDisputeNumber() {
  const nums = AppData.disputes
    .map(d => parseInt(String(d.case || '').replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n));
  return (nums.length ? Math.max(...nums) : 2000) + 1;
}

export default function CreateDisputeView({ navigate }) {
  const [step, setStep]           = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [toast, showToast]        = useState(null);

  // Step 1
  const [search, setSearch]           = useState('');
  const [selectedTxnId, setSelectedTxnId] = useState('');
  const [ineligibleTxnId, setIneligibleTxnId] = useState('');

  // Step 2
  const [reason, setReason]         = useState('');
  const [amount, setAmount]         = useState('');
  const [amountReason, setAmountReason] = useState('');
  const [filingDate, setFilingDate] = useState(todayISO());
  const [reasonCode, setReasonCode] = useState('');

  // Step 3
  const [cardholderStatement, setCardholderStatement] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Step 4
  const [evidence, setEvidence] = useState([]);

  function flashToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  const selectedTxn = selectedTxnId ? AppData.transactions.find(t => t.id === selectedTxnId) : null;
  const originalAmount = selectedTxn ? selectedTxn.amount : 0;
  const amountChanged = selectedTxn && Number(amount) !== originalAmount;

  function goStep(n) { setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function goCancel() { navigate('disputes'); }

  const searchResults = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return AppData.transactions
      .filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.holder.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.date.includes(q) ||
        String(t.amount).includes(q)
      )
      .slice(0, 12);
  })();

  function selectTransaction(t) {
    if (t.status !== 'Posted') {
      setIneligibleTxnId(t.id);
      setSubmitError(INELIGIBLE_REASONS[t.status] || 'This transaction is not eligible for dispute.');
      return;
    }
    setIneligibleTxnId('');
    setSubmitError('');
    setSelectedTxnId(t.id);
    setAmount(String(t.amount));
  }

  function validateStep1() {
    if (!selectedTxn) { setSubmitError('Select a posted transaction to continue.'); return false; }
    if (selectedTxn.status !== 'Posted') { setSubmitError(INELIGIBLE_REASONS[selectedTxn.status] || 'This transaction is not eligible for dispute.'); return false; }
    setSubmitError(''); return true;
  }

  function validateStep2() {
    if (!reason) { setSubmitError('Dispute Reason is required.'); return false; }
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setSubmitError('Dispute Amount must be greater than 0.'); return false; }
    if (amountChanged && !amountReason.trim()) { setSubmitError('A reason is required when the dispute amount differs from the transaction amount.'); return false; }
    if (!filingDate) { setSubmitError('Filing Date is required.'); return false; }
    setSubmitError(''); return true;
  }

  function validateStep3() {
    if (!cardholderStatement.trim()) { setSubmitError('Cardholder statement is required.'); return false; }
    setSubmitError(''); return true;
  }

  function handleReasonChange(value) {
    setReason(value);
    const match = DISPUTE_REASONS.find(r => r.value === value);
    setReasonCode(match ? match.code : '');
  }

  function handleFilesChosen(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const today = isoToUS(todayISO());
    setEvidence(prev => [
      ...prev,
      ...files.map((f, i) => ({
        id: `EV-${Date.now()}-${i}`,
        fileName: f.name,
        source: 'Agent Investigation',
        uploadedDate: today,
      })),
    ]);
  }

  function updateEvidenceSource(id, source) {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, source } : e));
  }

  function removeEvidence(id) {
    setEvidence(prev => prev.filter(e => e.id !== id));
  }

  function buildDisputeRecord(status) {
    const num = nextDisputeNumber();
    const filed = isoToUS(filingDate);
    return {
      id: `D-${num}`,
      caseId: `CASE-${num}`,
      case: `CASE-${num}`,
      cardholder: selectedTxn.holder,
      holder: selectedTxn.holder,
      transactionId: selectedTxn.id,
      merchant: selectedTxn.merchant,
      card: `**** ${selectedTxn.last4}`,
      network: selectedTxn.network,
      amount: Number(amount),
      reason,
      reasonCode,
      status,
      step: 0,
      filed,
      createdDate: filed,
      createdBy: 'Admin User',
      assignee: null,
      customerComment: cardholderStatement.trim(),
      evidence,
      notes: adminNotes.trim() ? [{ id: 'N-1', author: 'Admin User', date: filed, text: adminNotes.trim() }] : [],
      auditLog: [
        { id: 'A-1', actor: 'Admin User', action: status === 'Draft' ? 'Draft Saved' : 'Case Created', date: filed, detail: `Dispute ${status === 'Draft' ? 'drafted' : 'created'} from transaction ${selectedTxn.id}` },
      ],
    };
  }

  function handleCreate() {
    if (!validateStep1() || !validateStep2() || !validateStep3()) { goStep(!selectedTxn ? 1 : !reason || !amount ? 2 : 3); return; }
    const newDispute = buildDisputeRecord('Received');
    AppData.disputes.unshift(newDispute);
    navigate('dispute-detail', newDispute.id);
  }

  function handleSaveDraft() {
    flashToast('Draft saved (not persisted in this prototype).');
  }

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Disputes', route: 'disputes' }, { label: 'Create Dispute' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Create Dispute</h1>
          <div className="page-subtitle">File a new dispute case on behalf of a cardholder</div>
        </div>
        <button className="btn btn-ghost" onClick={goCancel}>Cancel</button>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: step sidebar */}
        <div className="card" style={{ width: 220, flexShrink: 0, padding: '20px 18px' }}>
          <div className="stepper">
            {STEPS.map((s, i) => {
              const n        = i + 1;
              const done     = n < step;
              const current  = n === step;
              const upcoming = n > step;
              return (
                <div key={s} className={`step${upcoming ? ' --upcoming' : ''}`}>
                  <div className={`step-dot${current ? ' --current' : upcoming ? ' --upcoming' : ''}`}>
                    {upcoming ? <div className="inner" /> : done ? <Icon name="check" size={12} strokeWidth={3} /> : n}
                  </div>
                  <div className="step-title">{s}</div>
                  <div className="step-meta">{STEP_META[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: step content */}
        <div className="card" style={{ flex: 1 }}>

          {/* ═══ STEP 1: Select Transaction ═══ */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Select Transaction</div>

              <FormField label="Search Transaction" style={{ marginBottom: 6 }}>
                <div className="input">
                  <Icon name="search" className="ico" />
                  <input
                    type="text"
                    placeholder="Search by Transaction ID, cardholder name, merchant, amount, or date"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </FormField>
              <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginBottom: 18 }}>
                Only posted transactions can be disputed.
              </div>

              {search.trim() && (
                <div style={{ border: '1px solid var(--fta-line-3)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ width: 32 }}></th>
                        <th>Transaction ID</th>
                        <th>Cardholder</th>
                        <th>Merchant</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.length === 0 && (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--fta-text-3)' }}>No transactions match your search.</td></tr>
                      )}
                      {searchResults.map(t => {
                        const eligible = t.status === 'Posted';
                        const selected = t.id === selectedTxnId;
                        return (
                          <tr
                            key={t.id}
                            onClick={() => selectTransaction(t)}
                            style={{ cursor: 'pointer', opacity: eligible ? 1 : 0.55, background: selected ? 'var(--fta-primary-1)' : undefined }}
                          >
                            <td>
                              <input type="radio" checked={selected} disabled={!eligible} readOnly style={{ accentColor: 'var(--fta-primary-6)' }} />
                            </td>
                            <td className="mono muted">{t.id}</td>
                            <td>{t.holder}</td>
                            <td>{t.merchant}</td>
                            <td style={{ textAlign: 'right', fontWeight: 500 }}>${t.amount.toFixed(2)}</td>
                            <td className="muted">{t.date}</td>
                            <td>
                              <StatusPill status={t.status} />
                              {!eligible && t.id === ineligibleTxnId && (
                                <div style={{ fontSize: 11, color: 'var(--fta-error)', marginTop: 3 }}>{INELIGIBLE_REASONS[t.status]}</div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedTxn && (
                <div className="card" style={{ background: 'var(--fta-fill-2)', marginBottom: 4 }}>
                  <div className="card-section-title">Transaction</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 24px' }}>
                    {[
                      ['Merchant', selectedTxn.merchant],
                      ['Amount', `$${selectedTxn.amount.toFixed(2)}`],
                      ['Transaction Date', selectedTxn.date],
                      ['Cardholder', selectedTxn.holder],
                      ['Card ending', `•••• ${selectedTxn.last4}`],
                      ['MCC', selectedTxn.mcc],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-5)' }}>{value}</div>
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>Status</div>
                      <StatusPill status={selectedTxn.status} />
                    </div>
                  </div>
                </div>
              )}

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button className="btn btn-primary" onClick={() => { if (validateStep1()) goStep(2); }}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 2: Dispute Details ═══ */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Dispute Details</div>

              <FormField label="Dispute Reason" required style={{ marginBottom: 18 }}>
                <div className="select">
                  <select value={reason} onChange={e => handleReasonChange(e.target.value)}>
                    <option value="">— Select a Reason —</option>
                    {DISPUTE_REASONS.map(r => <option key={r.value} value={r.value}>{r.value}</option>)}
                  </select>
                </div>
              </FormField>

              <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                <FormField label="Dispute Amount" required>
                  <div className="input">
                    <span style={{ fontSize: 13, color: 'var(--fta-text-3)', paddingLeft: 10, paddingRight: 4 }}>$</span>
                    <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                  {selectedTxn && <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 4 }}>Transaction amount: ${originalAmount.toFixed(2)}</div>}
                </FormField>
                <FormField label="Filing Date" required>
                  <div className="input" style={{ position: 'relative' }}>
                    <EnDateInput value={filingDate} onChange={e => setFilingDate(e.target.value)} />
                  </div>
                </FormField>
              </div>

              {amountChanged && (
                <FormField label="Reason for amount adjustment" required style={{ marginBottom: 18 }}>
                  <div className="input">
                    <input type="text" placeholder="Explain why the dispute amount differs from the transaction amount" value={amountReason} onChange={e => setAmountReason(e.target.value)} />
                  </div>
                </FormField>
              )}

              <FormField label="Reason Code" style={{ marginBottom: 6 }}>
                <div className="input">
                  <input type="text" placeholder="Auto-suggested from reason" value={reasonCode} onChange={e => setReasonCode(e.target.value)} />
                </div>
              </FormField>
              <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginBottom: 18 }}>
                Recommended automatically based on the dispute reason. Adjust if needed.
              </div>

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => goStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => { if (validateStep2()) goStep(3); }}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 3: Cardholder Statement ═══ */}
          {step === 3 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Cardholder Statement</div>

              <FormField label="Describe the reason for dispute" required style={{ marginBottom: 18 }}>
                <textarea
                  placeholder="Cardholder narrative — what happened, and why this transaction is being disputed"
                  rows={5}
                  value={cardholderStatement}
                  onChange={e => setCardholderStatement(e.target.value)}
                  style={textareaStyle}
                />
              </FormField>

              <FormField label="Internal Admin Notes" style={{ marginBottom: 6 }}>
                <textarea
                  placeholder="Optional — additional context for the case file, not shown to the cardholder"
                  rows={3}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  style={textareaStyle}
                />
              </FormField>

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => goStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={() => { if (validateStep3()) goStep(4); }}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 4: Evidence Upload ═══ */}
          {step === 4 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Evidence Upload</div>

              <div className="field-label" style={{ marginBottom: 8 }}>Upload Evidences</div>
              <label style={{ display: 'block', border: '1.5px dashed var(--fta-line-3)', borderRadius: 8, padding: 32, textAlign: 'center', color: 'var(--fta-text-3)', cursor: 'pointer' }}>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => { handleFilesChosen(e.target.files); e.target.value = ''; }}
                />
                <Icon name="upload" size={28} />
                <div style={{ marginTop: 8, fontSize: 14, color: 'var(--fta-text-5)' }}>Click or drag the file here to upload</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>PDF, images, and documents (10 MB max)</div>
              </label>

              {evidence.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div className="field-label" style={{ marginBottom: 8 }}>Evidence Timeline</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {evidence.map(e => (
                      <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--fta-line-3)', borderRadius: 8, padding: '10px 14px' }}>
                        <Icon name="file" size={18} style={{ color: 'var(--fta-text-3)', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.fileName}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)' }}>{e.uploadedDate} · Uploaded by {e.source}</div>
                        </div>
                        <div className="select" style={{ width: 170, flexShrink: 0 }}>
                          <select value={e.source} onChange={ev => updateEvidenceSource(e.id, ev.target.value)}>
                            {EVIDENCE_SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
                          </select>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '0 6px', flexShrink: 0 }}
                          aria-label="Remove evidence"
                          onClick={() => removeEvidence(e.id)}
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => goStep(3)}>Back</button>
                <button className="btn btn-primary" onClick={() => goStep(5)}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 5: Review & Submit ═══ */}
          {step === 5 && selectedTxn && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Review Dispute</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-3)', marginBottom: 20 }}>Please review that the information below is correct before creating the case.</div>

              <ReviewSection title="Transaction">
                <ReviewRow label="Merchant" value={selectedTxn.merchant} />
                <ReviewRow label="Amount" value={`$${selectedTxn.amount.toFixed(2)}`} />
                <ReviewRow label="Date" value={selectedTxn.date} />
                <ReviewRow label="Cardholder" value={selectedTxn.holder} valueNode={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ColorAvatar name={selectedTxn.holder} size="sm" />{selectedTxn.holder}</span>} />
                <ReviewRow label="Card ending" value={`•••• ${selectedTxn.last4}`} />
              </ReviewSection>

              <ReviewSection title="Dispute Details">
                <ReviewRow label="Reason" value={reason} />
                <ReviewRow label="Dispute Amount" value={`$${Number(amount).toFixed(2)}`} />
                <ReviewRow label="Reason Code" value={reasonCode || '—'} />
                <ReviewRow label="Filing Date" value={isoToUS(filingDate)} />
              </ReviewSection>

              <ReviewSection title="Cardholder Statement">
                <div style={{ fontSize: 13, color: 'var(--fta-text-5)', lineHeight: 1.6 }}>{cardholderStatement}</div>
              </ReviewSection>

              <ReviewSection title="Evidence">
                <div style={{ fontSize: 13 }}>{evidence.length} file{evidence.length === 1 ? '' : 's'} attached</div>
              </ReviewSection>

              <ReviewSection title="SLA" last>
                <ReviewRow label="Acknowledgement deadline" value={`${addDaysUS(filingDate, 30)} (30 days)`} />
                <ReviewRow label="Resolution deadline" value={`${addDaysUS(filingDate, 90)} (90 days)`} />
              </ReviewSection>

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => goStep(4)}>Back</button>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-ghost" onClick={handleSaveDraft}>Save Draft</button>
                  <button className="btn btn-primary" onClick={handleCreate}>Create Dispute</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastBanner message={toast} />
    </div>
  );
}

const textareaStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid var(--fta-line-2)',
  borderRadius: 6, fontSize: 13, resize: 'vertical', fontFamily: 'inherit', outline: 'none',
};

function ErrorMsg({ children }) {
  return (
    <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, fontSize: 13, color: '#c53030' }}>
      {children}
    </div>
  );
}

function ReviewSection({ title, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 20 }}>
      <div className="card-section-title">{title}</div>
      <div style={{ background: 'var(--fta-fill-2)', border: '1px solid var(--fta-line-2)', borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, valueNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-5)', textAlign: 'right' }}>{valueNode ?? value}</span>
    </div>
  );
}

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
