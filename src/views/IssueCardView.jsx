import React, { useState } from 'react';
import { Icon } from '../components/Shell';
import AppData from '../data/AppData';

const STEPS = ['Choose Card Context', 'Card Information', 'Spending Limit Settings'];
const STEP_META = ['Select program & sub-program', 'Cardholder & card details', 'Spending controls'];

const SPENDING_CATEGORIES = [
  'Dining', 'Groceries', 'Online Retail', 'Travel', 'Fuel',
  'Entertainment', 'Health', 'Subscriptions', 'Electronics', 'Other',
];

const GEO_OPTIONS = [
  'United States', 'Canada', 'United Kingdom', 'European Union',
  'Japan', 'Australia', 'Singapore', 'Mexico', 'Brazil', 'South Korea',
];

export default function IssueCardView({ navigate, navParam }) {
  const isContextMode = !!navParam?.subprogramId;
  const fromParam     = navParam?.from || 'global-cards';

  const initSubId  = isContextMode ? (navParam.subprogramId || '') : '';
  const initProgId = isContextMode ? (navParam.programId || '') : '';

  // ── Navigation / global UI ──
  const [step, setStep]               = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCard, setCreatedCard] = useState(null);

  // ── Step 1: Card Context ──
  const [selectedSubId,  setSelectedSubId]  = useState(initSubId);
  const [selectedProgId, setSelectedProgId] = useState(initProgId);

  // ── Step 2: Card Information ──
  const [cardholderId,    setCardholderId]    = useState('');
  const [cardName,        setCardName]        = useState('');
  const [expirationDate,  setExpirationDate]  = useState('');
  const [reissueMonths,   setReissueMonths]   = useState('');
  const [physicalEnabled, setPhysicalEnabled] = useState(true);
  const [virtualEnabled,  setVirtualEnabled]  = useState(false);

  // ── Step 3: Spending Controls ──
  const [denyMccInput,  setDenyMccInput]  = useState('');
  const [denyMccList,   setDenyMccList]   = useState([]);
  const [allowMccInput, setAllowMccInput] = useState('');
  const [allowMccList,  setAllowMccList]  = useState([]);
  const [limitPeriod,   setLimitPeriod]   = useState('Calendar Day');

  const [freqDaily,   setFreqDaily]   = useState({ enabled: false, amount: '' });
  const [freqWeekly,  setFreqWeekly]  = useState({ enabled: false, amount: '' });
  const [freqMonthly, setFreqMonthly] = useState({ enabled: false, amount: '' });
  const [freqYearly,  setFreqYearly]  = useState({ enabled: false, amount: '' });

  const [amtPerAuth, setAmtPerAuth] = useState({ enabled: false, amount: '' });
  const [amtTotal,   setAmtTotal]   = useState({ enabled: false, amount: '' });

  const [txnDaily,  setTxnDaily]  = useState({ enabled: false, count: '' });
  const [txnWeekly, setTxnWeekly] = useState({ enabled: false, count: '' });

  const [categoryLimits, setCategoryLimits] = useState([{ category: 'Dining', amount: '' }]);
  const [geoLocations,   setGeoLocations]   = useState([]);

  // ── Derived values ──
  const selectedProg      = selectedProgId ? AppData.programs.find(p => p.id === selectedProgId) : null;
  const selectedSub       = selectedSubId  ? AppData.subPrograms.find(s => s.id === selectedSubId) : null;
  const subsByProg        = selectedProgId ? AppData.subPrograms.filter(s => s.programId === selectedProgId) : [];
  const derivedCardType   = selectedSub?.cardType || null;
  const cardTypeLabel     = derivedCardType === 'credit' ? 'Credit Card' : derivedCardType === 'debit' ? 'Debit Card' : null;
  const financialAccount  = selectedSub?.financialAccountId
    ? AppData.financialAccounts.find(a => a.id === selectedSub.financialAccountId) ?? null
    : null;
  const creditSettings    = financialAccount ?? selectedSub ?? null;
  const selectedCardholder = cardholderId ? AppData.customers.find(c => c.id === cardholderId) : null;

  // ── Navigation helpers ──
  function goStep(n) { setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function goCancel() {
    if (fromParam === 'subprogram-cards' && selectedSubId) {
      navigate('subprogram-detail', { id: selectedSubId, from: 'program', tab: 'cards' });
    } else {
      navigate('cards');
    }
  }

  // ── MCC tag helpers ──
  function addMccTag(side) {
    const raw = side === 'deny' ? denyMccInput : allowMccInput;
    const codes = raw.trim().split(/[\s,;]+/).filter(t => /^\d{4}$/.test(t));
    if (!codes.length) return;
    if (side === 'deny') { setDenyMccList(prev => [...new Set([...prev, ...codes])]); setDenyMccInput(''); }
    else                 { setAllowMccList(prev => [...new Set([...prev, ...codes])]); setAllowMccInput(''); }
  }

  function removeMccTag(side, tag) {
    if (side === 'deny') setDenyMccList(prev => prev.filter(t => t !== tag));
    else                 setAllowMccList(prev => prev.filter(t => t !== tag));
  }

  // ── Category limit helpers ──
  function addCategoryLimit()                    { setCategoryLimits(prev => [...prev, { category: 'Dining', amount: '' }]); }
  function updateCategoryLimit(i, field, value)  { setCategoryLimits(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r)); }
  function removeCategoryLimit(i)                { setCategoryLimits(prev => prev.filter((_, idx) => idx !== i)); }

  // ── Geo helper ──
  function toggleGeo(loc) {
    setGeoLocations(prev => prev.includes(loc) ? prev.filter(g => g !== loc) : [...prev, loc]);
  }

  // ── Fill Demo Data ──
  function fillDemoData() {
    if (!isContextMode) {
      const creditSub = AppData.subPrograms.find(s => s.cardType === 'credit') || AppData.subPrograms[0];
      if (creditSub) { setSelectedProgId(creditSub.programId); setSelectedSubId(creditSub.id); }
    }
    setCardholderId(AppData.customers[0]?.id || '');
    setCardName(`Demo Card ${Date.now()}`);
    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + 3);
    setExpirationDate(exp.toISOString().split('T')[0]);
    setReissueMonths('3');
    setPhysicalEnabled(true);
    setVirtualEnabled(false);
    setDenyMccList(['7995', '6051']);
    setAllowMccList([]);
    setLimitPeriod('Calendar Day');
    setFreqDaily({ enabled: true, amount: '500' });
    setFreqWeekly({ enabled: false, amount: '' });
    setFreqMonthly({ enabled: true, amount: '5000' });
    setFreqYearly({ enabled: false, amount: '' });
    setAmtPerAuth({ enabled: true, amount: '2000' });
    setAmtTotal({ enabled: false, amount: '' });
    setTxnDaily({ enabled: false, count: '' });
    setTxnWeekly({ enabled: false, count: '' });
    setCategoryLimits([{ category: 'Dining', amount: '500' }]);
    setGeoLocations(['United States', 'Canada']);
  }

  // ── Validation ──
  function validateStep1() {
    if (!selectedSubId)  { setSubmitError('Please select a sub-program.'); return false; }
    if (!selectedProgId) { setSubmitError('Please select a program.'); return false; }
    setSubmitError(''); return true;
  }

  function validateStep2() {
    if (!cardholderId)     { setSubmitError('Please select a Card Holder.'); return false; }
    if (!cardName.trim())  { setSubmitError('Card Name is required.'); return false; }
    if (!expirationDate)   { setSubmitError('Expiration Date is required.'); return false; }
    const rm = Number(reissueMonths);
    if (reissueMonths === '' || isNaN(rm) || rm < 0 || !Number.isInteger(rm)) {
      setSubmitError('Reissue Months must be a non-negative whole number.'); return false;
    }
    if (!physicalEnabled && !virtualEnabled) {
      setSubmitError('Select at least one Form Factor (Physical or Virtual).'); return false;
    }
    setSubmitError(''); return true;
  }

  // ── Submit ──
  function handleSubmit() {
    if (!validateStep2()) return;
    setSubmitError('');

    const sub  = selectedSub;
    const prog = selectedProg;
    const fa   = financialAccount;
    const cs   = creditSettings;

    const formFactors = [
      ...(physicalEnabled ? ['physical'] : []),
      ...(virtualEnabled  ? ['virtual']  : []),
    ];

    const last4 = String(Math.floor(Math.random() * 9000) + 1000);

    const newCard = {
      id:            'CARD-' + String(Math.floor(Math.random() * 900000) + 100000),
      cardType:      derivedCardType || 'credit',
      cardTypeLabel: cardTypeLabel   || 'Credit Card',
      programId:     sub.programId,
      subprogramId:  sub.id,

      cardholderId,
      cardholderSnapshot: selectedCardholder
        ? { name: selectedCardholder.name, email: selectedCardholder.email, phone: selectedCardholder.phone, state: selectedCardholder.state }
        : null,

      cardName:      cardName.trim(),
      cardStatus:    'Active',
      last4,
      maskedNumber:  '**** **** **** ' + last4,
      formFactors,
      type:          formFactors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(' / '),
      expirationDate,
      reissueMonths: Number(reissueMonths),

      inheritedSubprogramSnapshot: {
        id:          sub.id,
        name:        sub.name,
        programId:   sub.programId,
        programName: prog?.name || '',
        network:     sub.network,
        bin:         sub.bin,
        classification:       sub.classification,
        financialAccountId:   sub.financialAccountId || null,
        financialAccountSnapshot: fa ? { ...fa } : null,
        creditMin:    cs?.creditMin   || null,
        creditMax:    cs?.creditMax   || null,
        purchaseApr:  cs?.purchaseApr || null,
        billingCycle: cs?.billingCycle || null,
        gracePeriod:  cs?.gracePeriod  || null,
        legalTermsPackageId: sub.legalTermsPackageId || null,
        customerServiceSnapshot: (sub.svcName)
          ? { name: sub.svcName, phone: sub.svcPhone, email: sub.svcEmail }
          : null,
        artworkFront: sub.cardFrontArtwork || null,
        artworkBack:  sub.cardBackArtwork  || null,
      },

      spendingControls: {
        denyListMcc:  denyMccList,
        allowListMcc: allowMccList,
        limitPeriod,
        frequencyLimits: {
          daily:   freqDaily.enabled   ? Number(freqDaily.amount)   : null,
          weekly:  freqWeekly.enabled  ? Number(freqWeekly.amount)  : null,
          monthly: freqMonthly.enabled ? Number(freqMonthly.amount) : null,
          yearly:  freqYearly.enabled  ? Number(freqYearly.amount)  : null,
        },
        amountLimits: {
          perAuthorization: amtPerAuth.enabled ? Number(amtPerAuth.amount) : null,
          total:            amtTotal.enabled   ? Number(amtTotal.amount)   : null,
        },
        transactionLimits: {
          daily:  txnDaily.enabled  ? Number(txnDaily.count)  : null,
          weekly: txnWeekly.enabled ? Number(txnWeekly.count) : null,
        },
        categoryLimits: categoryLimits
          .filter(r => r.category && r.amount)
          .map(r => ({ category: r.category, limit: Number(r.amount) })),
        geographicalLocations: geoLocations,
      },

      binPrefix:  sub.bin || '',
      network:    sub.network,
      cardCode:   '',
      createdAt:  new Date().toISOString(),
    };

    AppData.cards.push(newCard);
    setCreatedCard(newCard);
    setShowSuccess(true);
  }

  // ── Success screen ──
  if (showSuccess && createdCard) {
    return (
      <SuccessScreen
        card={createdCard}
        navigate={navigate}
        fromParam={fromParam}
        selectedSubId={selectedSubId}
      />
    );
  }

  // ── Guard: context mode, sub not found ──
  if (isContextMode && !selectedSub) {
    return (
      <div className="content-inner fade-in">
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--fta-text-3)' }}>
          Sub-program not found. Cannot issue card.
        </div>
      </div>
    );
  }

  return (
    <div className="content-inner fade-in">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 8 }}>
        {isContextMode ? (
          <>
            <button onClick={() => navigate('subprograms')} style={navBtnStyle}>Sub-Programs</button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
            <button onClick={() => navigate('subprogram-detail', { id: selectedSubId, from: 'program', tab: 'cards' })} style={navBtnStyle}>{selectedSub?.name}</button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
          </>
        ) : (
          <>
            <button onClick={() => navigate('cards')} style={navBtnStyle}>Cards</button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
          </>
        )}
        <span style={{ color: 'var(--fta-text-1)' }}>Create Card</span>
      </div>

      {/* Page title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-title">Create Card</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {import.meta.env.DEV && (
            <button type="button" className="btn btn-ghost" onClick={fillDemoData} style={{ fontSize: 12, opacity: 0.75 }}>Fill Demo Data</button>
          )}
          <button className="btn btn-ghost" onClick={goCancel}>Cancel</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Left: step sidebar */}
        <div className="card" style={{ width: 210, flexShrink: 0, padding: '20px 18px' }}>
          <div className="stepper">
            {STEPS.map((s, i) => {
              const n        = i + 1;
              const done     = n < step;
              const current  = n === step;
              const upcoming = n > step;
              const isLast   = i === STEPS.length - 1;
              return (
                <div
                  key={s}
                  className={`step${upcoming ? ' --upcoming' : ''}`}
                  style={{ cursor: 'pointer', ...(isLast ? { paddingBottom: 0 } : {}) }}
                  onClick={() => goStep(n)}
                >
                  <div className={`step-dot${current ? ' --current' : upcoming ? ' --upcoming' : ''}`}>
                    {upcoming ? <div className="inner" /> : done ? '✓' : n}
                  </div>
                  <div className="step-title">{s}</div>
                  <div className="step-meta">{STEP_META[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: form card */}
        <div className="card" style={{ flex: 1 }}>

          {/* ═══ STEP 1: Choose Card Context ═══ */}
          {step === 1 && (
            <>
              {/* Card preview */}
              <div style={{ maxWidth: 280, margin: '0 auto 28px' }}>
                <div className="credit-card">
                  <div className="cc-decor" />
                  <div className="cc-decor-2" />
                  <div className="credit-card-top">
                    <div>
                      <div className="credit-card-pill">
                        {cardTypeLabel || (selectedSub ? 'Card' : 'Select Program')}
                      </div>
                      <div className="credit-card-brand" style={{ marginTop: 6 }}>
                        {selectedProg?.name || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="credit-card-number">•••• •••• •••• ••••</div>
                  <div className="credit-card-bot">
                    <div>
                      <div className="lbl">Sub-Program</div>
                      <div className="val">{selectedSub?.name || '—'}</div>
                    </div>
                    <div className="credit-card-network">{selectedSub?.network || '—'}</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fta-text-2)', marginBottom: 18 }}>Card Context</div>

              {/* Program */}
              <FormField label="Program" required style={{ marginBottom: 18 }}>
                {isContextMode ? (
                  <ReadonlyBox>{selectedProg?.name || selectedProgId}</ReadonlyBox>
                ) : (
                  <div className="select">
                    <select value={selectedProgId} onChange={e => { setSelectedProgId(e.target.value); setSelectedSubId(''); }}>
                      <option value="">— Select a Program —</option>
                      {AppData.programs.filter(p => p.status !== 'Inactive').map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </FormField>

              {/* Subprogram */}
              <FormField label="Sub-program" required style={{ marginBottom: 18 }}>
                {isContextMode ? (
                  <ReadonlyBox>{selectedSub?.name || selectedSubId} · BIN {selectedSub?.bin || '—'}</ReadonlyBox>
                ) : (
                  <div className="select">
                    <select value={selectedSubId} onChange={e => setSelectedSubId(e.target.value)} disabled={!selectedProgId}>
                      <option value="">— Select a Sub-program —</option>
                      {subsByProg.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (BIN {s.bin})</option>
                      ))}
                    </select>
                  </div>
                )}
              </FormField>

              {/* Card Type — derived, always readonly */}
              <FormField label="Card Type" style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 6 }}>
                  {cardTypeLabel ? (
                    <>
                      <span style={{
                        fontSize: 11.5, fontWeight: 600, padding: '2px 9px', borderRadius: 10,
                        background: derivedCardType === 'credit' ? '#eff6ff' : '#f0fff4',
                        color:      derivedCardType === 'credit' ? '#1e40af' : '#166534',
                      }}>{cardTypeLabel}</span>
                      <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>derived from sub-program · read-only</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--fta-text-3)', fontStyle: 'italic' }}>Waiting for sub-program selection</span>
                  )}
                </div>
              </FormField>

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                <button className="btn btn-primary" onClick={() => { if (validateStep1()) goStep(2); }}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 2: Card Information ═══ */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Card Information</div>

              {/* Compact inherited info box */}
              {selectedSub && (
                <div style={{ background: 'var(--fta-fill-2)', border: '1px solid var(--fta-line-2)', borderRadius: 8, padding: '12px 16px', marginBottom: 22, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 16px' }}>
                  {[
                    ['Network',           selectedSub.network],
                    ['BIN Prefix',        selectedSub.bin],
                    ['Classification',    selectedSub.classification],
                    ['Financial Account', financialAccount?.name || (selectedSub.financialAccountId ?? 'Not configured')],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-1)' }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Card Holder */}
              <FormField label="Card Holder" required style={{ marginBottom: selectedCardholder ? 10 : 18 }}>
                <div className="select">
                  <select value={cardholderId} onChange={e => setCardholderId(e.target.value)}>
                    <option value="">— Select a Cardholder —</option>
                    {AppData.customers.filter(c => c.status !== 'Closed').map(c => (
                      <option key={c.id} value={c.id}>{c.name} · {c.id}</option>
                    ))}
                  </select>
                </div>
              </FormField>

              {/* Cardholder snapshot */}
              {selectedCardholder && (
                <div style={{ background: 'var(--fta-fill-2)', border: '1px solid var(--fta-line-2)', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                    {[
                      ['Name',   selectedCardholder.name],
                      ['Email',  selectedCardholder.email],
                      ['Phone',  selectedCardholder.phone],
                      ['State',  selectedCardholder.state],
                      ['Status', selectedCardholder.status],
                      ['ID',     selectedCardholder.id],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-1)' }}>{value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Name */}
              <FormField label="Card Name" required style={{ marginBottom: 18 }}>
                <div className="input">
                  <input type="text" placeholder="e.g. Alice Platinum Visa" value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
              </FormField>

              <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                <FormField label="Expiration Date" required>
                  <div className="input">
                    <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} />
                  </div>
                </FormField>
                <FormField label="Reissue Months" required>
                  <div className="input">
                    <input type="number" placeholder="e.g. 3" min="0" max="36" step="1" value={reissueMonths} onChange={e => setReissueMonths(e.target.value)} />
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 4 }}>Months before expiry to trigger reissue</div>
                </FormField>
              </div>

              {/* Form Factor */}
              <FormField label="Form Factor" required style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 22, alignItems: 'center', padding: '6px 0' }}>
                  {[['Physical Card', physicalEnabled, setPhysicalEnabled], ['Virtual Card', virtualEnabled, setVirtualEnabled]].map(([label, val, set]) => (
                    <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
                      {label}
                    </label>
                  ))}
                </div>
              </FormField>

              {/* Card Status */}
              <FormField label="Card Status" style={{ marginBottom: 6 }}>
                <ReadonlyBox>Active</ReadonlyBox>
                <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 4 }}>Cards are set to Active by default upon issuance.</div>
              </FormField>

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                <button className="btn btn-ghost" onClick={() => goStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => { if (validateStep2()) goStep(3); }}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 3: Spending Limit Setting ═══ */}
          {step === 3 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Spending Limit Setting</div>

              {/* Lightweight credit limit notice */}
              <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 20, lineHeight: 1.5 }}>
                Card-level controls cannot exceed sub-program limits.
                {creditSettings?.creditMax && (
                  <> Credit max: <strong style={{ color: 'var(--fta-text-2)' }}>${Number(creditSettings.creditMax).toLocaleString()}</strong></>
                )}
              </div>

              {/* List MCCs */}
              <SpendSection title="List MCCs">
                <FormField label="Deny List MCC" style={{ marginBottom: 18 }}>
                  <MccTagInput
                    side="deny" tags={denyMccList} inputVal={denyMccInput}
                    onInputChange={setDenyMccInput}
                    onAdd={() => addMccTag('deny')}
                    onRemove={tag => removeMccTag('deny', tag)}
                  />
                </FormField>
                <FormField label="Allow List MCC" style={{ marginBottom: 0 }}>
                  <MccTagInput
                    side="allow" tags={allowMccList} inputVal={allowMccInput}
                    onInputChange={setAllowMccInput}
                    onAdd={() => addMccTag('allow')}
                    onRemove={tag => removeMccTag('allow', tag)}
                  />
                </FormField>
              </SpendSection>

              {/* Limit Period */}
              <SpendSection title="Limit Period">
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  {['Calendar Day', 'Activate Date'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
                      <input type="radio" name="limitPeriod" value={opt} checked={limitPeriod === opt} onChange={() => setLimitPeriod(opt)} style={{ accentColor: 'var(--fta-primary-6)' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </SpendSection>

              {/* Spending Limit by Frequency */}
              <SpendSection title="Spending Limit by Frequency" hint="Optional — leave amount blank to skip">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                  {[
                    ['Daily',   freqDaily,   setFreqDaily],
                    ['Weekly',  freqWeekly,  setFreqWeekly],
                    ['Monthly', freqMonthly, setFreqMonthly],
                    ['Yearly',  freqYearly,  setFreqYearly],
                  ].map(([label, state, setter]) => (
                    <AmountLimitRow key={label} label={label} state={state} onChange={setter} />
                  ))}
                </div>
              </SpendSection>

              {/* Spending Limit by Amount */}
              <SpendSection title="Spending Limit by Amount" hint="Optional">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                  {[
                    ['Per Authorization', amtPerAuth, setAmtPerAuth],
                    ['Total',             amtTotal,   setAmtTotal],
                  ].map(([label, state, setter]) => (
                    <AmountLimitRow key={label} label={label} state={state} onChange={setter} />
                  ))}
                </div>
              </SpendSection>

              {/* Max Number of Transactions */}
              <SpendSection title="Max Number of Transactions" hint="Optional">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                  {[
                    ['Daily',  txnDaily,  setTxnDaily],
                    ['Weekly', txnWeekly, setTxnWeekly],
                  ].map(([label, state, setter]) => (
                    <CountLimitRow key={label} label={label} state={state} onChange={setter} />
                  ))}
                </div>
              </SpendSection>

              {/* Spending Limit by Category */}
              <SpendSection title="Spending Limit by Category">
                {categoryLimits.map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <div className="select" style={{ flex: 1 }}>
                      <select value={row.category} onChange={e => updateCategoryLimit(i, 'category', e.target.value)}>
                        {SPENDING_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="input" style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: 'var(--fta-text-3)', paddingLeft: 10, paddingRight: 4 }}>$</span>
                      <input type="number" placeholder="0.00" min="0" step="0.01" value={row.amount}
                        onChange={e => updateCategoryLimit(i, 'amount', e.target.value)} />
                    </div>
                    <button type="button" onClick={() => removeCategoryLimit(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', fontSize: 20, lineHeight: 1, padding: '0 4px', flexShrink: 0 }}>×</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 4 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addCategoryLimit} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="plus" size={12} />Add Limit
                  </button>
                  {categoryLimits.length > 0 && (
                    <button type="button" onClick={() => setCategoryLimits([])}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 12.5, fontWeight: 500 }}>
                      Remove All
                    </button>
                  )}
                </div>
              </SpendSection>

              {/* Geographical Location */}
              <SpendSection title="Spending Limit by Geographical Location">
                <div className="select" style={{ marginBottom: geoLocations.length ? 10 : 0 }}>
                  <select onChange={e => { if (e.target.value) { toggleGeo(e.target.value); e.target.value = ''; } }}>
                    <option value="">Please select</option>
                    {GEO_OPTIONS.filter(g => !geoLocations.includes(g)).map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                {geoLocations.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {geoLocations.map(g => (
                      <span key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, padding: '3px 10px', background: 'var(--fta-primary-1)', border: '1px solid var(--fta-primary-2)', borderRadius: 20, color: 'var(--fta-primary-6)' }}>
                        {g}
                        <button type="button" onClick={() => toggleGeo(g)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-primary-6)', fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </SpendSection>

              {/* IVR notice */}
              <div style={{ background: 'var(--fta-fill-2)', border: '1px solid var(--fta-line-2)', borderRadius: 6, padding: '12px 14px', marginBottom: 24, fontSize: 12, color: 'var(--fta-text-3)', lineHeight: 1.6 }}>
                By proceeding with the issuance of this {(cardTypeLabel || 'card').toLowerCase()}, please be advised that our Interactive Voice Response (IVR) system for card activation and customer service is operated by SHAZAM®. All services provided via the IVR system comply with our privacy and security standards. Should you have any questions or concerns, please feel free to contact us directly.
              </div>

              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => goStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Success screen ──────────────────────────────────────────────

function SuccessScreen({ card, navigate, fromParam, selectedSubId }) {
  function handleComplete() {
    if (fromParam === 'subprogram-cards') {
      navigate('subprogram-detail', { id: selectedSubId, from: 'issue-card', tab: 'cards' });
    } else {
      navigate('cards');
    }
  }

  const last4 = (card.binPrefix || '').slice(-4).padStart(4, '0');
  const expDisplay = card.expirationDate
    ? new Date(card.expirationDate + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
    : '—';

  return (
    <div className="content-inner fade-in">
      <div className="card" style={{ textAlign: 'center', padding: '56px 40px' }}>
        {/* Green check */}
        <div style={{ width: 72, height: 72, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#f0fff4', border: '3px solid var(--fta-success)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--fta-success)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Card created successfully!</div>
        <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 36 }}>
          The card has been issued to <strong>{card.cardholderSnapshot?.name || 'cardholder'}</strong> and added to the sub-program.
        </div>

        {/* Card art */}
        <div style={{ maxWidth: 320, margin: '0 auto 36px' }}>
          <div className="credit-card">
            <div className="cc-decor" />
            <div className="cc-decor-2" />
            <div className="credit-card-top">
              <div>
                <div className="credit-card-pill">{card.cardTypeLabel || 'Credit Card'}</div>
                <div className="credit-card-brand" style={{ marginTop: 6 }}>{card.cardName}</div>
              </div>
            </div>
            <div className="credit-card-number">•••• •••• •••• {last4}</div>
            <div className="credit-card-bot">
              <div>
                <div className="lbl">Thru</div>
                <div className="val">{expDisplay}</div>
              </div>
              <div className="credit-card-network">{card.network || 'VISA'}</div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleComplete}>Complete</button>
      </div>
    </div>
  );
}

// ── Local UI helpers ────────────────────────────────────────────

const navBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', fontSize: 13, padding: 0 };

function FormField({ label, required, style, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-4)', marginBottom: 5 }}>
        {label}{required && <span style={{ color: 'var(--fta-error)', marginLeft: 2 }}>*</span>}
      </div>
      {children}
    </div>
  );
}

function ReadonlyBox({ children }) {
  return (
    <div style={{ background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: 'var(--fta-text-1)', fontWeight: 500 }}>
      {children || '—'}
    </div>
  );
}

function ErrorMsg({ children }) {
  return (
    <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, fontSize: 13, color: '#c53030' }}>
      {children}
    </div>
  );
}

function SpendSection({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fta-text-2)' }}>{title}</div>
        {hint && <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)' }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function MccTagInput({ side, tags, inputVal, onInputChange, onAdd, onRemove }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="input" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Enter 4-digit MCC code (e.g. 5411) and press Enter"
            value={inputVal}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          />
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onAdd}>Add</button>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 4 }}>
        Enter MCC codes and press Enter to add. Leave empty if no MCC restriction applies.
      </div>
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {tags.map(tag => (
            <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontFamily: 'monospace', padding: '3px 10px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 20, color: '#c53030' }}>
              {tag}
              <button type="button" onClick={() => onRemove(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AmountLimitRow({ label, state, onChange }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, marginBottom: 6 }}>
        <input type="checkbox" checked={state.enabled} onChange={e => onChange(prev => ({ ...prev, enabled: e.target.checked }))} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
        {label}
      </label>
      <div className="input">
        <span style={{ fontSize: 13, color: 'var(--fta-text-3)', paddingLeft: 10, paddingRight: 4 }}>$</span>
        <input type="number" placeholder="0.00" min="0" step="0.01" value={state.amount}
          onChange={e => onChange(prev => ({ ...prev, amount: e.target.value, enabled: e.target.value !== '' ? true : prev.enabled }))} />
      </div>
    </div>
  );
}

function CountLimitRow({ label, state, onChange }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, marginBottom: 6 }}>
        <input type="checkbox" checked={state.enabled} onChange={e => onChange(prev => ({ ...prev, enabled: e.target.checked }))} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
        {label}
      </label>
      <div className="input">
        <input type="number" placeholder="0" min="0" step="1" value={state.count}
          onChange={e => onChange(prev => ({ ...prev, count: e.target.value, enabled: e.target.value !== '' ? true : prev.enabled }))} />
      </div>
    </div>
  );
}
