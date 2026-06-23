import React, { useState } from 'react';
import { Icon } from '../components/Shell';
import AppData from '../data/AppData';

const STEPS = ['General Information', 'Card Setting', 'Spending Limit Setting'];

const CARD_MATERIAL_PRICES = {
  'Standard PVC': 1.25,
  'Recycled PVC': 1.65,
  'Metal': 8.50,
  'Premium Metal': 12.00,
  'Eco Composite': 2.10,
};

export default function CreateSubProgramView({ navigate, programId }) {
  const programObj = programId ? AppData.programs.find(p => p.id === programId) : null;

  const [step, setStep] = useState(1);

  // Step 1
  const [program, setProgram] = useState(programId || '');
  const [subName, setSubName] = useState('');
  const [bizName, setBizName] = useState('');
  const [desc, setDesc] = useState('');

  // Step 2 – accordion open states
  const [openAcc, setOpenAcc] = useState({ card: true, reward: false, service: false, style: false, legal: false });
  const [accDone, setAccDone] = useState({ card: false, reward: false, service: false, style: false, legal: false });

  // Card Information
  const [cardType, setCardType] = useState('credit');
  const [physicalEnabled, setPhysicalEnabled] = useState(true);
  const [virtualEnabled, setVirtualEnabled] = useState(false);
  const [binPrefix, setBinPrefix] = useState('');
  const [network, setNetwork] = useState('');
  const [usageType, setUsageType] = useState('');
  const [classification, setClassification] = useState('Consumer');
  const [validPeriod, setValidPeriod] = useState('');
  const [creditMin, setCreditMin] = useState('');
  const [creditMax, setCreditMax] = useState('');
  const [purchaseApr, setPurchaseApr] = useState('');
  const [billingCycle, setBillingCycle] = useState('');
  const [gracePeriod, setGracePeriod] = useState('');

  // Customer Service
  const [svcName, setSvcName] = useState('');
  const [svcPhone, setSvcPhone] = useState('');
  const [svcEmail, setSvcEmail] = useState('');
  const [svcHours, setSvcHours] = useState('');

  // Card Artwork & Production
  const [cardMaterial, setCardMaterial] = useState('');
  const [cardQuantity, setCardQuantity] = useState('');
  const [cardFrontArtwork, setCardFrontArtwork] = useState(null);
  const [cardBackArtwork, setCardBackArtwork] = useState(null);
  const [cardFrontError, setCardFrontError] = useState('');
  const [cardBackError, setCardBackError] = useState('');

  // Approved Legal Terms
  const [legalPkgId, setLegalPkgId] = useState('');

  // Rewards Program
  const [rewardEnabled, setRewardEnabled] = useState(false);
  const [rewardName, setRewardName] = useState('');
  const [rewardType, setRewardType] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [earnRate, setEarnRate] = useState('');
  const [spendRule, setSpendRule] = useState('');
  const [spendMin, setSpendMin] = useState('');
  const [spendMax, setSpendMax] = useState('');
  const [mccTags, setMccTags] = useState([]);
  const [mccInput, setMccInput] = useState('');
  const [rewardPeriod, setRewardPeriod] = useState('');
  const [eventRule, setEventRule] = useState('');
  const [redemptionOptions, setRedemptionOptions] = useState([]);
  const [pointsExpiry, setPointsExpiry] = useState('');
  const [redemptionThreshold, setRedemptionThreshold] = useState('');
  const selectedLegalPkg = legalPkgId ? AppData.approvedLegalTermsPackages.find(p => p.id === legalPkgId) : null;
  const unitPrice = cardMaterial ? (CARD_MATERIAL_PRICES[cardMaterial] ?? null) : null;
  const cardQtyNum = parseInt(cardQuantity, 10);
  const totalPrice = (unitPrice !== null && cardQuantity && !isNaN(cardQtyNum) && cardQtyNum > 0) ? unitPrice * cardQtyNum : null;

  // Step 3 – spending limits
  const LIMIT_TYPES = [
    { key: 'perTxn', label: 'Per Transaction', defaultEnabled: true },
    { key: 'daily', label: 'Daily', defaultEnabled: true },
    { key: 'weekly', label: 'Weekly', defaultEnabled: false },
    { key: 'monthly', label: 'Monthly', defaultEnabled: true },
    { key: 'atm', label: 'ATM Withdrawal', defaultEnabled: false },
  ];
  const [limits, setLimits] = useState(() =>
    Object.fromEntries(LIMIT_TYPES.map(t => [t.key, { enabled: t.defaultEnabled, amount: '', currency: 'USD' }]))
  );
  const [limitMin, setLimitMin] = useState('');
  const [limitMax, setLimitMax] = useState('');
  const [limitDefault, setLimitDefault] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function goStep(n) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleAcc(key) {
    setOpenAcc(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function saveAcc(key) {
    setAccDone(prev => ({ ...prev, [key]: true }));
    setOpenAcc(prev => ({ ...prev, [key]: false }));
  }

  function setLimit(key, field, value) {
    setLimits(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  function handleArtworkUpload(file, side) {
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      const msg = 'Artwork must be a PNG, JPG, or SVG file.';
      side === 'front' ? setCardFrontError(msg) : setCardBackError(msg);
      return;
    }
    const url = URL.createObjectURL(file);
    if (file.type === 'image/svg+xml') {
      const art = { fileName: file.name, fileType: file.type, width: null, height: null, previewUrl: url };
      if (side === 'front') { setCardFrontArtwork(art); setCardFrontError(''); }
      else { setCardBackArtwork(art); setCardBackError(''); }
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.width < 1012 || img.height < 638) {
        const msg = `Minimum size is 1012 × 638 px. Uploaded: ${img.width} × ${img.height} px.`;
        if (side === 'front') { setCardFrontError(msg); } else { setCardBackError(msg); }
        URL.revokeObjectURL(url);
      } else {
        const art = { fileName: file.name, fileType: file.type, width: img.width, height: img.height, previewUrl: url };
        if (side === 'front') { setCardFrontArtwork(art); setCardFrontError(''); }
        else { setCardBackArtwork(art); setCardBackError(''); }
      }
    };
    img.onerror = () => {
      const msg = 'Could not load the artwork file.';
      if (side === 'front') { setCardFrontError(msg); } else { setCardBackError(msg); }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleSubmit() {
    if (!program) { setSubmitError('Please select a Program before submitting.'); return; }
    if (!subName.trim()) { setSubmitError('Sub-program Name is required.'); return; }

    const nameConflict = AppData.subPrograms.some(
      s => s.programId === program && s.name.trim().toLowerCase() === subName.trim().toLowerCase()
    );
    if (nameConflict) { setSubmitError('A sub-program with this name already exists in the selected program.'); return; }

    if (!physicalEnabled && !virtualEnabled) { setSubmitError('Select at least one form factor (Physical Card or Virtual Card).'); return; }
    if (!/^\d{6,8}$/.test(binPrefix.trim())) { setSubmitError('BIN Prefix must be 6 to 8 digits (digits only).'); return; }
    if (!network) { setSubmitError('Select a network.'); return; }
    if (!usageType) { setSubmitError('Select a usage type.'); return; }
    if (!validPeriod) { setSubmitError('Select a valid period.'); return; }

    const minNum = Number(creditMin);
    const maxNum = Number(creditMax);
    if (!creditMin || isNaN(minNum) || minNum < 0 || !Number.isInteger(minNum)) {
      setSubmitError('Credit Limit (Min) must be a non-negative whole number.'); return;
    }
    if (!creditMax || isNaN(maxNum) || maxNum < 0 || !Number.isInteger(maxNum)) {
      setSubmitError('Credit Limit (Max) must be a non-negative whole number.'); return;
    }
    if (maxNum <= minNum) { setSubmitError('Credit Limit (Max) must be greater than Credit Limit (Min).'); return; }

    const aprNum = parseFloat(purchaseApr);
    if (!purchaseApr || isNaN(aprNum) || aprNum < 0.01 || aprNum > 99.99) {
      setSubmitError('Purchase APR must be between 0.01% and 99.99%.'); return;
    }
    if (!billingCycle) { setSubmitError('Select a billing cycle.'); return; }

    const gpNum = Number(gracePeriod);
    if (!gracePeriod || isNaN(gpNum) || !Number.isInteger(gpNum) || gpNum < 1 || gpNum > 90) {
      setSubmitError('Grace Period must be a whole number between 1 and 90 days.'); return;
    }

    if (!svcName.trim()) { setSubmitError('Customer Service Name is required.'); return; }
    if (!svcPhone.trim()) { setSubmitError('Customer Service Phone is required.'); return; }
    if (!/^\+?[\d\s\-(). ]{7,20}$/.test(svcPhone.trim())) { setSubmitError('Enter a valid Customer Service Phone number.'); return; }
    if (!svcEmail.trim()) { setSubmitError('Customer Service Email is required.'); return; }
    if (!svcEmail.includes('@') || !svcEmail.split('@')[1]?.includes('.')) {
      setSubmitError('Enter a valid Customer Service Email address.'); return;
    }

    if (!cardFrontArtwork) { setSubmitError('Card Front Artwork is required.'); return; }
    if (!cardBackArtwork) { setSubmitError('Card Back Artwork is required.'); return; }
    if (!cardMaterial) { setSubmitError('Select a card material.'); return; }

    const qtyNum = Number(cardQuantity);
    if (!cardQuantity || isNaN(qtyNum) || !Number.isInteger(qtyNum) || qtyNum < 1 || qtyNum > 9999999) {
      setSubmitError('Card Quantity must be a whole number between 1 and 9,999,999.'); return;
    }

    if (!legalPkgId) { setSubmitError('Select an approved legal terms package.'); return; }

    setSubmitError('');

    const formFactors = [
      ...(physicalEnabled ? ['physical'] : []),
      ...(virtualEnabled ? ['virtual'] : []),
    ];
    const uPrice = CARD_MATERIAL_PRICES[cardMaterial] ?? null;
    const tPrice = uPrice !== null ? uPrice * qtyNum : null;

    const newSub = {
      id: 'SUB-' + String(Math.floor(Math.random() * 90000) + 10000),
      programId: program,
      name: subName.trim(),
      description: desc.trim(),
      bizName: bizName.trim(),
      bin: binPrefix.trim(),
      network,
      cardType,
      formFactors,
      type: formFactors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(' / '),
      usageType,
      classification,
      validPeriod,
      creditMin,
      creditMax,
      purchaseApr,
      billingCycle,
      gracePeriod,
      svcName: svcName.trim(),
      svcPhone: svcPhone.trim(),
      svcEmail: svcEmail.trim(),
      svcHours: svcHours.trim(),
      cardFrontArtwork,
      cardBackArtwork,
      cardMaterial,
      cardMaterialUnitPrice: uPrice,
      cardQuantity: qtyNum,
      cardTotalPrice: tPrice,
      legalTermsPackageId: legalPkgId,
      legalTermsSnapshot: selectedLegalPkg ? { ...selectedLegalPkg } : null,
      rewardsProgram: rewardEnabled ? {
        name: rewardName.trim(),
        type: rewardType,
        description: rewardDescription.trim(),
        earnRate: earnRate.trim(),
        spendRule,
        spendMin: spendMin ? Number(spendMin) : null,
        spendMax: spendMax ? Number(spendMax) : null,
        mccRules: mccTags,
        period: rewardPeriod,
        eventRule,
        redemptionOptions,
        pointsExpiry,
        redemptionThreshold: redemptionThreshold.trim(),
      } : null,
      limitMin,
      limitMax,
      limitDefault,
      limits,
      cards: 0,
      status: 'Under Review',
    };
    AppData.subPrograms.push(newSub);
    setShowSuccess(true);
    setTimeout(() => {
      if (programObj) {
        navigate('program-detail-subs', newSub.programId);
      } else {
        navigate('subprograms');
      }
    }, 1800);
  }

  return (
    <div className="content-inner fade-in">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 16 }}>
        {programObj ? (
          <>
            <button onClick={() => navigate('programs')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', fontSize: 13, padding: 0 }}>Program</button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
            <button onClick={() => navigate('program-detail', programId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', fontSize: 13, padding: 0 }}>{programObj.name}</button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
            <span style={{ color: 'var(--fta-text-1)' }}>Creating sub-program under {programObj.name}</span>
          </>
        ) : (
          <>
            <button onClick={() => navigate('subprograms')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
              <Icon name="chev-left" size={13} /> Sub-program
            </button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
            <span style={{ color: 'var(--fta-text-1)' }}>Create New Sub-program</span>
          </>
        )}
      </div>

      {/* Page header */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 54, height: 54, border: '1.5px solid var(--fta-line-2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fta-fill-2)' }}>
            <Icon name="card" size={28} style={{ color: 'var(--fta-primary-6)' }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>
              {programObj ? `Create Sub-program under ${programObj.name}` : "Create Sub-program"}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginTop: 3 }}>Set the General Information, Card Setting, and Spending Limit Setting for the Sub-program</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => programObj ? navigate('program-detail', programId) : navigate('subprograms')}>Cancel</button>
      </div>

      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        {/* Step sidebar */}
        <div style={{ width: 210, flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--fta-text-4)', fontWeight: 500, marginBottom: 14 }}>
            Step <strong style={{ color: 'var(--fta-primary-6)' }}>{step}</strong> / {STEPS.length}
          </div>
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={s} onClick={() => goStep(n)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 8, cursor: 'pointer', marginBottom: 4,
                background: active ? 'var(--fta-primary-1)' : 'transparent',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${done ? 'var(--fta-success)' : active ? 'var(--fta-primary-6)' : 'var(--fta-line-2)'}`,
                  background: done ? 'var(--fta-success)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: done ? '#fff' : active ? 'var(--fta-primary-6)' : 'var(--fta-text-3)',
                }}>
                  {done ? '✓' : n}
                </div>
                <span style={{ fontSize: 13, color: active ? 'var(--fta-primary-6)' : 'var(--fta-text-4)', fontWeight: active ? 600 : 400 }}>{s}</span>
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="card" style={{ flex: 1 }}>

          {/* ═══ STEP 1 ═══ */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>General Information</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginBottom: 22 }}>Please fill in the following information accurately.</div>

              <FormField label="Program" required style={{ marginBottom: 18 }}>
                {programObj ? (
                  <>
                    <div style={{ background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fta-text-1)' }}>{programObj.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 2, fontFamily: 'monospace' }}>{programObj.id}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: programObj.status === 'Active' ? '#c6f6d5' : 'var(--fta-fill-3)', color: programObj.status === 'Active' ? '#276749' : 'var(--fta-text-3)' }}>{programObj.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 6 }}>This subprogram will be created under the selected program and cannot be changed in this flow.</div>
                  </>
                ) : (
                  <div className="select"><select value={program} onChange={e => setProgram(e.target.value)}>
                    {AppData.programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select></div>
                )}
              </FormField>

              <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                <FormField label="Sub-program Name" required>
                  <div className="input"><input type="text" placeholder="Please enter" value={subName} onChange={e => setSubName(e.target.value)} /></div>
                </FormField>
                <FormField label="Business Name">
                  <div className="input"><input type="text" placeholder="Please enter" value={bizName} onChange={e => setBizName(e.target.value)} /></div>
                </FormField>
              </div>

              <FormField label="Description" style={{ marginBottom: 6 }}>
                <textarea className="fld" placeholder="Please Enter" rows={3} value={desc} onChange={e => setDesc(e.target.value.slice(0, 100))} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, fontSize: 13, resize: 'vertical', fontFamily: 'inherit', outline: 'none' }} />
              </FormField>
              <div style={{ fontSize: 11, color: 'var(--fta-text-3)', textAlign: 'right', marginBottom: 4 }}>{desc.length} / 100</div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                <button className="btn btn-primary" onClick={() => goStep(2)}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 2 ═══ */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Enter relevant information to make the Sub-program identifiable.</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginBottom: 22 }}>This is a brief introduction and explanation</div>

              {/* Card Information accordion */}
              <Accordion
                title="Card Information"
                sub="Please review the information for accuracy and provide any other required details."
                open={openAcc.card} done={accDone.card}
                onToggle={() => toggleAcc('card')}
              >
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="Card Type">
                    <RadioGroup name="cardType" options={[{ value: 'debit', label: 'Debit Card' }, { value: 'credit', label: 'Credit Card' }]} value={cardType} onChange={setCardType} />
                  </FormField>
                  <FormField label="Form Factor" required>
                    <div style={{ display: 'flex', gap: 22, alignItems: 'center', padding: '6px 0', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
                        <input type="checkbox" checked={physicalEnabled} onChange={e => setPhysicalEnabled(e.target.checked)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
                        Physical Card
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
                        <input type="checkbox" checked={virtualEnabled} onChange={e => setVirtualEnabled(e.target.checked)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
                        Virtual Card
                      </label>
                    </div>
                  </FormField>
                </div>
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="BIN Prefix" required>
                    <div className="input"><input type="text" placeholder="6–8 digits" maxLength={8} value={binPrefix} onChange={e => setBinPrefix(e.target.value.replace(/\D/g, '').slice(0, 8))} /></div>
                  </FormField>
                  <FormField label="Network" required>
                    <div className="select"><select value={network} onChange={e => setNetwork(e.target.value)}>
                      <option value="">Please Select</option>
                      <option>Visa</option><option>Mastercard</option><option>UnionPay</option><option>American Express</option>
                    </select></div>
                  </FormField>
                </div>
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="Usage Type" required>
                    <div className="select"><select value={usageType} onChange={e => setUsageType(e.target.value)}>
                      <option value="">Please select</option>
                      <option>Single-use</option><option>Multi-use</option>
                    </select></div>
                  </FormField>
                  <FormField label="Classification Type" required>
                    <div className="select"><select value={classification} onChange={e => setClassification(e.target.value)}>
                      <option>Consumer</option><option>Commercial</option><option>Corporate</option>
                    </select></div>
                  </FormField>
                </div>
                <div style={{ maxWidth: 260, marginBottom: 18 }}>
                  <FormField label="Valid Period" required>
                    <div className="select"><select value={validPeriod} onChange={e => setValidPeriod(e.target.value)}>
                      <option value="">Please select</option>
                      <option>1 Year</option><option>2 Years</option><option>3 Years</option><option>5 Years</option>
                    </select></div>
                  </FormField>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '20px 0 16px' }} />
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Credit Card Settings</div>
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="Credit Limit Range (Min, USD)" required>
                    <div className="input"><input type="number" placeholder="e.g. 500" min="0" step="1" value={creditMin} onChange={e => setCreditMin(e.target.value)} /></div>
                  </FormField>
                  <FormField label="Credit Limit Range (Max, USD)" required>
                    <div className="input"><input type="number" placeholder="e.g. 20000" min="0" step="1" value={creditMax} onChange={e => setCreditMax(e.target.value)} /></div>
                  </FormField>
                </div>
                <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
                  <FormField label="Purchase APR (%)" required>
                    <div className="input"><input type="number" placeholder="e.g. 19.99" step="0.01" min="0.01" max="99.99" value={purchaseApr} onChange={e => setPurchaseApr(e.target.value)} /></div>
                  </FormField>
                  <FormField label="Billing Cycle" required>
                    <div className="select"><select value={billingCycle} onChange={e => setBillingCycle(e.target.value)}>
                      <option value="">Please Select</option>
                      <option>Monthly – 1st</option><option>Monthly – 15th</option><option>Monthly – Last day</option>
                    </select></div>
                  </FormField>
                  <FormField label="Grace Period (days)" required>
                    <div className="input"><input type="number" placeholder="1–90" min="1" max="90" value={gracePeriod} onChange={e => setGracePeriod(e.target.value)} /></div>
                  </FormField>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('card')}>Save</button>
              </Accordion>

              {/* Rewards Program accordion */}
              <Accordion
                title="Rewards Program"
                sub="Configure reward policies for this sub-program, including earn rates, spend rules, and redemption settings."
                open={openAcc.reward} done={accDone.reward}
                onToggle={() => toggleAcc('reward')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={rewardEnabled} onChange={e => setRewardEnabled(e.target.checked)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Enable Rewards Program for this Sub-Program</span>
                  </label>
                </div>

                {rewardEnabled && (
                  <>
                    <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                      <FormField label="Reward Name" required>
                        <div className="input"><input type="text" placeholder="e.g. Cashback Rewards" value={rewardName} onChange={e => setRewardName(e.target.value)} /></div>
                      </FormField>
                      <FormField label="Reward Type" required>
                        <div className="select"><select value={rewardType} onChange={e => setRewardType(e.target.value)}>
                          <option value="">Please Select</option>
                          <option>Cashback</option>
                          <option>Points</option>
                          <option>Miles</option>
                          <option>Tiered Points</option>
                        </select></div>
                      </FormField>
                    </div>
                    <FormField label="Reward Description" style={{ marginBottom: 18 }}>
                      <div className="input" style={{ padding: 0 }}>
                        <textarea
                          placeholder="Brief description of the reward program..."
                          rows={2}
                          value={rewardDescription}
                          onChange={e => setRewardDescription(e.target.value)}
                          style={{ width: '100%', resize: 'vertical', minHeight: 56, fontFamily: 'inherit', fontSize: 13, padding: '8px 10px', border: 'none', background: 'transparent', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </FormField>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '4px 0 18px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Earn Rules</div>

                    <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                      <FormField label="Earn Rate" required>
                        <div className="input"><input type="text" placeholder="e.g. 1.5% or 2x points" value={earnRate} onChange={e => setEarnRate(e.target.value)} /></div>
                      </FormField>
                      <FormField label="Spend Rule" required>
                        <div className="select"><select value={spendRule} onChange={e => setSpendRule(e.target.value)}>
                          <option value="">Please Select</option>
                          <option>All Spend</option>
                          <option>Greater than</option>
                          <option>Less than</option>
                          <option>Between</option>
                        </select></div>
                      </FormField>
                    </div>

                    {(spendRule === 'Greater than' || spendRule === 'Less than' || spendRule === 'Between') && (
                      <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                        <FormField label={spendRule === 'Less than' ? 'Maximum Amount (USD)' : 'Minimum Amount (USD)'}>
                          <div className="input"><input type="number" placeholder="e.g. 10" min="0" value={spendMin} onChange={e => setSpendMin(e.target.value)} /></div>
                        </FormField>
                        {spendRule === 'Between' && (
                          <FormField label="Maximum Amount (USD)">
                            <div className="input"><input type="number" placeholder="e.g. 1000" min="0" value={spendMax} onChange={e => setSpendMax(e.target.value)} /></div>
                          </FormField>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                      <FormField label="Reward Period" required>
                        <div className="select"><select value={rewardPeriod} onChange={e => setRewardPeriod(e.target.value)}>
                          <option value="">Please Select</option>
                          <option>Per Transaction</option>
                          <option>Per Billing Cycle</option>
                          <option>Calendar Year</option>
                        </select></div>
                      </FormField>
                      <FormField label="Event Rule" required>
                        <div className="select"><select value={eventRule} onChange={e => setEventRule(e.target.value)}>
                          <option value="">Please Select</option>
                          <option>Transaction Settlement</option>
                          <option>Billing Cycle</option>
                          <option>Statement</option>
                        </select></div>
                      </FormField>
                    </div>

                    <FormField label="MCC Rules" style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', padding: '6px 10px', border: '1px solid var(--fta-line-2)', borderRadius: 6, background: 'var(--fta-fill-1)', minHeight: 38 }}>
                        {mccTags.map(tag => (
                          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--fta-primary-1)', color: 'var(--fta-primary-7)', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
                            {tag}
                            <button onClick={() => setMccTags(prev => prev.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder={mccTags.length === 0 ? 'Type MCC code and press Enter…' : ''}
                          value={mccInput}
                          onChange={e => setMccInput(e.target.value)}
                          onKeyDown={e => {
                            if ((e.key === 'Enter' || e.key === ',') && mccInput.trim()) {
                              e.preventDefault();
                              const val = mccInput.trim().replace(/,/g, '');
                              if (val && !mccTags.includes(val)) setMccTags(prev => [...prev, val]);
                              setMccInput('');
                            } else if (e.key === 'Backspace' && !mccInput && mccTags.length) {
                              setMccTags(prev => prev.slice(0, -1));
                            }
                          }}
                          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, minWidth: 120, flex: 1 }}
                        />
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--fta-text-4)', marginTop: 4 }}>Enter MCC codes (e.g. 5411) and press Enter to add. Leave empty to apply to all categories.</div>
                    </FormField>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '4px 0 18px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Redemption Settings</div>

                    <FormField label="Redemption Options" style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '6px 0' }}>
                        {['Statement Credit', 'Bank Transfer', 'Gift Cards', 'Travel Booking', 'Merchandise'].map(opt => (
                          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
                            <input
                              type="checkbox"
                              checked={redemptionOptions.includes(opt)}
                              onChange={e => setRedemptionOptions(prev => e.target.checked ? [...prev, opt] : prev.filter(o => o !== opt))}
                              style={{ accentColor: 'var(--fta-primary-6)', width: 14, height: 14 }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </FormField>

                    <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
                      <FormField label="Points Expiry">
                        <div className="select"><select value={pointsExpiry} onChange={e => setPointsExpiry(e.target.value)}>
                          <option value="">No Expiry</option>
                          <option>12 Months</option>
                          <option>24 Months</option>
                          <option>36 Months</option>
                          <option>End of Calendar Year</option>
                        </select></div>
                      </FormField>
                      <FormField label="Redemption Threshold">
                        <div className="input"><input type="text" placeholder="e.g. 500 points or $5" value={redemptionThreshold} onChange={e => setRedemptionThreshold(e.target.value)} /></div>
                      </FormField>
                    </div>
                  </>
                )}

                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('reward')}>Save</button>
              </Accordion>

              {/* Customer Service accordion */}
              <Accordion title="Customer Service" sub="Please review the information for accuracy and provide any other required details." open={openAcc.service} done={accDone.service} onToggle={() => toggleAcc('service')}>
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="Customer Service Name" required>
                    <div className="input"><input type="text" placeholder="Please enter" value={svcName} onChange={e => setSvcName(e.target.value)} /></div>
                  </FormField>
                  <FormField label="Customer Service Phone" required>
                    <div className="input"><input type="text" placeholder="Please enter" value={svcPhone} onChange={e => setSvcPhone(e.target.value)} /></div>
                  </FormField>
                </div>
                <FormField label="Customer Service Email" required style={{ marginBottom: 14 }}>
                  <div className="input"><input type="email" placeholder="Please enter" value={svcEmail} onChange={e => setSvcEmail(e.target.value)} /></div>
                </FormField>
                <FormField label="Customer Service Hours" style={{ marginBottom: 14 }}>
                  <div className="input"><input type="text" placeholder="e.g. Mon–Fri 9:00 AM–6:00 PM EST" value={svcHours} onChange={e => setSvcHours(e.target.value)} /></div>
                </FormField>
                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('service')}>Save</button>
              </Accordion>

              {/* Card Artwork & Production accordion */}
              <Accordion title="Card Artwork & Production" sub="Upload card artwork and configure production settings." open={openAcc.style} done={accDone.style} onToggle={() => toggleAcc('style')}>
                {/* Front + Back artwork — side by side, card aspect ratio */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                  {/* Front */}
                  <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-4)', marginBottom: 6 }}>
                      Card Front Artwork<span style={{ color: 'var(--fta-error)', marginLeft: 2 }}>*</span>
                    </div>
                    <div style={{
                      aspectRatio: '1.586 / 1',
                      border: `2px dashed ${cardFrontArtwork ? 'var(--fta-success)' : 'var(--fta-line-2)'}`,
                      borderRadius: 10,
                      background: cardFrontArtwork ? '#f0fff4' : 'var(--fta-fill-2)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', gap: 6,
                    }}>
                      {cardFrontArtwork ? (
                        <>
                          {cardFrontArtwork.fileType !== 'image/svg+xml' && cardFrontArtwork.previewUrl && (
                            <img src={cardFrontArtwork.previewUrl} alt="front preview" style={{ maxWidth: '90%', maxHeight: '55%', objectFit: 'contain', borderRadius: 4 }} />
                          )}
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fta-text-1)', textAlign: 'center', padding: '0 8px' }}>{cardFrontArtwork.fileName}</div>
                          {cardFrontArtwork.width && <div style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>{cardFrontArtwork.width} × {cardFrontArtwork.height} px</div>}
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCardFrontArtwork(null)}>Remove</button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', textAlign: 'center', lineHeight: 1.5, padding: '0 12px' }}>PNG, JPG, or SVG<br />Min 1012 × 638 px</div>
                          <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
                            Choose File
                            <input type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" style={{ display: 'none' }}
                              onChange={e => handleArtworkUpload(e.target.files[0], 'front')} />
                          </label>
                        </>
                      )}
                    </div>
                    {cardFrontError && <div style={{ fontSize: 12, color: 'var(--fta-error)', marginTop: 5 }}>{cardFrontError}</div>}
                    <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 5 }}>Must meet the selected network's brand-mark requirements.</div>
                  </div>

                  {/* Back */}
                  <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-4)', marginBottom: 6 }}>
                      Card Back Artwork<span style={{ color: 'var(--fta-error)', marginLeft: 2 }}>*</span>
                    </div>
                    <div style={{
                      aspectRatio: '1.586 / 1',
                      border: `2px dashed ${cardBackArtwork ? 'var(--fta-success)' : 'var(--fta-line-2)'}`,
                      borderRadius: 10,
                      background: cardBackArtwork ? '#f0fff4' : 'var(--fta-fill-2)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', gap: 6,
                    }}>
                      {cardBackArtwork ? (
                        <>
                          {cardBackArtwork.fileType !== 'image/svg+xml' && cardBackArtwork.previewUrl && (
                            <img src={cardBackArtwork.previewUrl} alt="back preview" style={{ maxWidth: '90%', maxHeight: '55%', objectFit: 'contain', borderRadius: 4 }} />
                          )}
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fta-text-1)', textAlign: 'center', padding: '0 8px' }}>{cardBackArtwork.fileName}</div>
                          {cardBackArtwork.width && <div style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>{cardBackArtwork.width} × {cardBackArtwork.height} px</div>}
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCardBackArtwork(null)}>Remove</button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 12, color: 'var(--fta-text-3)', textAlign: 'center', lineHeight: 1.5, padding: '0 12px' }}>PNG, JPG, or SVG<br />Min 1012 × 638 px</div>
                          <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
                            Choose File
                            <input type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" style={{ display: 'none' }}
                              onChange={e => handleArtworkUpload(e.target.files[0], 'back')} />
                          </label>
                        </>
                      )}
                    </div>
                    {cardBackError && <div style={{ fontSize: 12, color: 'var(--fta-error)', marginTop: 5 }}>{cardBackError}</div>}
                    <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 5 }}>Must meet the selected network's brand-mark requirements.</div>
                  </div>
                </div>

                {/* Material + pricing */}
                <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
                  <FormField label="Card Material" required>
                    <div className="select"><select value={cardMaterial} onChange={e => setCardMaterial(e.target.value)}>
                      <option value="">Please Select</option>
                      {Object.keys(CARD_MATERIAL_PRICES).map(m => <option key={m}>{m}</option>)}
                    </select></div>
                  </FormField>
                  <FormField label="Unit Price (USD)">
                    <div className="input"><input type="text" readOnly value={unitPrice !== null ? `$${unitPrice.toFixed(2)} / card` : '—'} style={{ color: 'var(--fta-text-3)', background: 'var(--fta-fill-2)' }} /></div>
                  </FormField>
                </div>
                <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
                  <FormField label="Card Quantity" required>
                    <div className="input"><input type="number" placeholder="e.g. 5000" min="1" max="9999999" step="1" value={cardQuantity} onChange={e => setCardQuantity(e.target.value)} /></div>
                  </FormField>
                  <FormField label="Total Price (USD)">
                    <div className="input"><input type="text" readOnly value={totalPrice !== null ? `$${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'} style={{ color: 'var(--fta-text-3)', background: 'var(--fta-fill-2)' }} /></div>
                  </FormField>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('style')}>Save</button>
              </Accordion>

              {/* Approved Legal Terms accordion */}
              <Accordion
                title="Approved Legal Terms"
                sub="Select an approved legal terms package for this card product. Legal terms are drafted and approved by the issuer's Legal and Compliance teams and maintained in the Legal Terms Library."
                open={openAcc.legal}
                done={accDone.legal}
                onToggle={() => toggleAcc('legal')}
              >
                <FormField label="Legal Terms Package" required style={{ marginBottom: selectedLegalPkg ? 18 : 6 }}>
                  <div className="select">
                    <select value={legalPkgId} onChange={e => setLegalPkgId(e.target.value)}>
                      <option value="">— Select a package —</option>
                      {AppData.approvedLegalTermsPackages.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.version})</option>
                      ))}
                    </select>
                  </div>
                </FormField>

                {selectedLegalPkg && (
                  <div style={{ background: 'var(--fta-fill-2)', border: '1px solid var(--fta-line-2)', borderRadius: 8, padding: '16px 18px', marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>Package Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 16 }}>
                      {[
                        ['Version',        selectedLegalPkg.version],
                        ['Issuer',         selectedLegalPkg.issuer],
                        ['Market',         selectedLegalPkg.market],
                        ['Network',        selectedLegalPkg.network],
                        ['Product Type',   selectedLegalPkg.productType],
                        ['Effective Date', selectedLegalPkg.effectiveDate],
                        ['Approved By',    selectedLegalPkg.approvedBy],
                        ['Last Updated',   selectedLegalPkg.lastUpdated],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{val || '—'}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Documents</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {[
                        ['Terms & Conditions',   selectedLegalPkg.documents.termsAndConditionsUrl],
                        ['Privacy Policy',        selectedLegalPkg.documents.privacyPolicyUrl],
                        ['Cardholder Agreement',  selectedLegalPkg.documents.cardholderAgreementUrl],
                      ].map(([label, url]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                          <span style={{ color: 'var(--fta-text-3)', minWidth: 170, flexShrink: 0 }}>{label}</span>
                          {url
                            ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fta-primary-6)', wordBreak: 'break-all', lineHeight: 1.4 }}>{url}</a>
                            : <span style={{ color: 'var(--fta-text-3)' }}>Not configured</span>
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('legal')}>Save</button>
              </Accordion>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                <button className="btn btn-ghost" onClick={() => goStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => goStep(3)}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 3 ═══ */}
          {step === 3 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Spending Limit Setting</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginBottom: 22 }}>Set the spending limits for cardholders in this sub-program. These limits override the parent program defaults.</div>

              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>Credit Limit Override</div>
              <div style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
                <FormField label="Minimum Credit Limit">
                  <div className="input"><input type="number" placeholder="Inherit from program" value={limitMin} onChange={e => setLimitMin(e.target.value)} /></div>
                </FormField>
                <FormField label="Maximum Credit Limit">
                  <div className="input"><input type="number" placeholder="Inherit from program" value={limitMax} onChange={e => setLimitMax(e.target.value)} /></div>
                </FormField>
                <FormField label="Default Credit Limit">
                  <div className="input"><input type="number" placeholder="e.g. 5,000" value={limitDefault} onChange={e => setLimitDefault(e.target.value)} /></div>
                </FormField>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '0 0 20px' }} />
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>Transaction Limits</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 20 }}>
                <thead>
                  <tr>
                    {['Limit Type', 'Enabled', 'Amount', 'Currency'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '9px 12px', background: 'var(--fta-fill-2)', color: 'var(--fta-text-4)', fontWeight: 600, borderBottom: '1.5px solid var(--fta-line-2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LIMIT_TYPES.map(t => {
                    const lim = limits[t.key];
                    return (
                      <tr key={t.key}>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--fta-line-3)' }}>{t.label}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--fta-line-3)' }}>
                          <input type="checkbox" checked={lim.enabled} onChange={e => setLimit(t.key, 'enabled', e.target.checked)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--fta-line-3)' }}>
                          <div className="input" style={{ maxWidth: 140 }}>
                            <input type="number" disabled={!lim.enabled} placeholder={lim.enabled ? 'e.g. 5,000' : 'Disabled'} value={lim.amount} onChange={e => setLimit(t.key, 'amount', e.target.value)} />
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--fta-line-3)' }}>
                          <div className="select" style={{ maxWidth: 100 }}>
                            <select disabled={!lim.enabled} value={lim.currency} onChange={e => setLimit(t.key, 'currency', e.target.value)}>
                              <option>USD</option><option>EUR</option><option>GBP</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {submitError && (
                <div style={{ marginTop: 16, padding: '10px 14px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, fontSize: 13, color: '#c53030' }}>
                  {submitError}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                <button className="btn btn-ghost" onClick={() => goStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </div>
            </>
          )}
        </div>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: '#fff', border: '1px solid #c6f6d5', borderRadius: 12, padding: '14px 20px 14px 16px', boxShadow: '0 8px 32px rgba(0,0,0,.14)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 300 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c6f6d5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e' }}>Sub-program created successfully</div>
            <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>Redirecting to Subprogram Detail…</div>
          </div>
        </div>
      )}
    </div>
  );
}

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

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 22, alignItems: 'center', padding: '6px 0', flexWrap: 'wrap' }}>
      {options.map(o => (
        <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function Accordion({ title, sub, open, done, onToggle, children, badge }) {
  return (
    <div style={{ border: '1.5px solid var(--fta-line-2)', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: 'var(--fta-fill-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--fta-text-3)', transform: open ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform .2s' }}>▶</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2 }}>{sub}</div>}
          </div>
        </div>
        {badge || (
          <span style={{ fontSize: 12, fontWeight: 500, color: done ? 'var(--fta-success)' : 'var(--fta-warning)' }}>
            {done ? 'Complete' : 'Incomplete'}
          </span>
        )}
      </div>
      {open && (
        <div style={{ padding: '20px', borderTop: '1px solid var(--fta-line-2)', background: '#fff' }}>
          {children}
        </div>
      )}
    </div>
  );
}

