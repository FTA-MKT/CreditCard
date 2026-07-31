import React, { useState } from 'react';
import { Icon } from '../components/Shell';
import AppData from '../data/AppData';
import { FormField } from '../components/forms/FormField';
import { AccordionSection as Accordion } from '../components/forms/AccordionSection';
import { RadioGroup } from '../components/forms/RadioGroup';
import { CARD_MATERIAL_PRICES } from '../components/forms/constants';
import { ArtworkPreview } from '../components/forms/ArtworkPreview';


const STEPS = ['General Information', 'Card Setting', 'Spending Limit Setting'];

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
  const [financialProductId, setFinancialProductId] = useState('');
  const selectedFinancialProduct = financialProductId
    ? AppData.financialProducts.find(a => a.id === financialProductId) ?? null
    : null;

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
  const [rewardsProgramName, setRewardsProgramName] = useState('');
  const [baseMultiplier, setBaseMultiplier] = useState('1');
  const [accrualBasis, setAccrualBasis] = useState('purchase_based');
  const [bonusCategories, setBonusCategories] = useState([
    { key: 'Travel',    enabled: false, multiplier: '3', mccCodes: ['4511','4722','7011'], mccInput: '4511, 4722, 7011' },
    { key: 'Dining',    enabled: false, multiplier: '2', mccCodes: ['5812','5813','5814'], mccInput: '5812, 5813, 5814' },
    { key: 'Groceries', enabled: false, multiplier: '2', mccCodes: ['5411','5422','5912'], mccInput: '5411, 5422, 5912' },
  ]);
  const [postingTiming, setPostingTiming] = useState('after_clearing');
  const [conversionPoints, setConversionPoints] = useState('1000');
  const [conversionAmount, setConversionAmount] = useState('10.00');
  const [minimumRedemptionIncrement, setMinimumRedemptionIncrement] = useState('1000');
  const [rewardFieldErrors, setRewardFieldErrors] = useState({});
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
  const [rewardError, setRewardError] = useState('');

  function goStep(n) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleAcc(key) {
    setOpenAcc(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function validateRewardsSection() {
    if (!rewardEnabled) return { errors: {}, count: 0 };
    const errors = {};
    const name = rewardsProgramName.trim();
    if (!name) {
      errors.programName = 'Enter a rewards program name.';
    } else if (name.length < 2 || name.length > 80) {
      errors.programName = 'Enter a rewards program name between 2 and 80 characters.';
    } else if (/[<>{}]/.test(name)) {
      errors.programName = 'Program name cannot contain < > { } characters.';
    }
    const bm = parseFloat(baseMultiplier);
    if (baseMultiplier === '' || isNaN(bm) || bm < 0 || bm > 10) {
      errors.baseMultiplier = 'Enter a base earning rate between 0 and 10.';
    }
    bonusCategories.forEach((cat, idx) => {
      if (!cat.enabled) return;
      const bcat = parseFloat(cat.multiplier);
      if (isNaN(bcat) || bcat < 0.01 || bcat > 20) errors[`bonusMult_${idx}`] = 'Enter a bonus multiplier between 0.01 and 20.';
      if (cat.mccInput?.trim()) {
        const codes = cat.mccInput.split(',').map(s => s.trim()).filter(Boolean);
        for (const code of codes) {
          if (code.includes('-')) {
            const parts = code.split('-');
            if (parts.length !== 2 || !/^\d{4}$/.test(parts[0]) || !/^\d{4}$/.test(parts[1]) || parseInt(parts[0]) >= parseInt(parts[1])) {
              errors[`mcc_${idx}`] = 'Enter valid 4-digit MCC codes or ranges, such as 5812 or 3000-3999.'; break;
            }
          } else if (!/^\d{4}$/.test(code)) {
            errors[`mcc_${idx}`] = 'Enter valid 4-digit MCC codes or ranges, such as 5812 or 3000-3999.'; break;
          }
        }
      }
    });
    const cp = parseInt(conversionPoints, 10);
    if (!conversionPoints || isNaN(cp) || cp < 1 || cp > 1000000 || String(cp) !== conversionPoints.trim()) {
      errors.conversionPoints = 'Enter a whole number of points between 1 and 1,000,000.';
    }
    const ca = parseFloat(conversionAmount);
    if (!conversionAmount || isNaN(ca) || ca < 0.01 || ca > 10000) {
      errors.conversionAmount = 'Enter a valid amount between $0.01 and $10,000.00.';
    }
    const mi = parseInt(minimumRedemptionIncrement, 10);
    if (!minimumRedemptionIncrement || isNaN(mi) || mi < 1 || String(mi) !== minimumRedemptionIncrement.trim()) {
      errors.minimumRedemption = 'Enter a valid whole number of points.';
    }
    return { errors, count: Object.keys(errors).length };
  }

  function saveAcc(key) {
    if (key === 'reward') {
      const { errors, count } = validateRewardsSection();
      if (count > 0) { setRewardFieldErrors(errors); return; }
      setRewardFieldErrors({});
      setRewardError('');
    }
    setAccDone(prev => ({ ...prev, [key]: true }));
    setOpenAcc(prev => ({ ...prev, [key]: false }));
  }

  function fillDemoData() {
    if (!programObj) setProgram(AppData.programs[0]?.id || '');
    setSubName(`Test Subprogram ${Date.now()}`);
    setBizName('Demo Business Corp.');
    setDesc('Demo sub-program for testing card product configuration.');
    setPhysicalEnabled(true);
    setVirtualEnabled(false);
    setBinPrefix('441299');
    setNetwork('Visa');
    setUsageType('Multi-use');
    setValidPeriod('3 Years');
    setFinancialProductId(AppData.financialProducts[0]?.id || '');
    setSvcName('Demo Card Service');
    setSvcPhone('+1 (555) 000-9999');
    setSvcEmail('support@demo.com');
    setSvcHours('Mon–Fri 9:00 AM–6:00 PM EST');
    setCardFrontArtwork({ fileName: 'demo-card-front.png', fileType: 'image/png', width: 1012, height: 638, previewUrl: '', isDemo: true });
    setCardBackArtwork({ fileName: 'demo-card-back.png', fileType: 'image/png', width: 1012, height: 638, previewUrl: '', isDemo: true });
    setCardFrontError('');
    setCardBackError('');
    setCardMaterial('Standard PVC');
    setCardQuantity('5000');
    setLegalPkgId(AppData.approvedLegalTermsPackages[0]?.id || '');
    setRewardEnabled(true);
    setRewardsProgramName('Demo Rewards Program');
    setBaseMultiplier('1');
    setAccrualBasis('purchase_based');
    setBonusCategories([
      { key: 'Travel',    enabled: true,  multiplier: '3', mccCodes: ['4511','4722','7011'], mccInput: '4511, 4722, 7011' },
      { key: 'Dining',    enabled: true,  multiplier: '2', mccCodes: ['5812','5813','5814'], mccInput: '5812, 5813, 5814' },
      { key: 'Groceries', enabled: false, multiplier: '2', mccCodes: ['5411','5422','5912'], mccInput: '5411, 5422, 5912' },
    ]);
    setPostingTiming('after_clearing');
    setConversionPoints('1000');
    setConversionAmount('10.00');
    setMinimumRedemptionIncrement('1000');
    setRewardFieldErrors({});
    setOpenAcc({ card: true, reward: true, service: true, style: true, legal: true });
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

    if (!financialProductId) { setSubmitError('Select a financial product.'); return; }

    const fa = selectedFinancialProduct;
    if (!fa || fa.creditMin == null || fa.creditMax == null || !fa.purchaseApr || !fa.billingCycle || fa.gracePeriod == null) {
      setSubmitError('Selected financial product is missing required credit terms.'); return;
    }

    const faMinNum = Number(fa.creditMin);
    const faMaxNum = Number(fa.creditMax);
    if (faMaxNum <= faMinNum) { setSubmitError('Selected financial product has an invalid credit limit range (Max must be greater than Min).'); return; }

    const faAprNum = parseFloat(fa.purchaseApr);
    if (isNaN(faAprNum) || faAprNum < 0.01 || faAprNum > 99.99) {
      setSubmitError('Selected financial product has an invalid Purchase APR.'); return;
    }

    const faGpNum = Number(fa.gracePeriod);
    if (isNaN(faGpNum) || !Number.isInteger(faGpNum) || faGpNum < 1 || faGpNum > 90) {
      setSubmitError('Selected financial product has an invalid Grace Period.'); return;
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

    if (rewardEnabled) {
      const { errors, count } = validateRewardsSection();
      if (count > 0) {
        setRewardFieldErrors(errors);
        setSubmitError(`Please fix ${count} field${count > 1 ? 's' : ''} in the Rewards Program section.`);
        return;
      }
    }

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
      financialProductId: fa.id,
      financialProductSnapshot: {
        id: fa.id,
        name: fa.name,
        productType: fa.productType,
        currency: fa.currency,
        creditMin: fa.creditMin,
        creditMax: fa.creditMax,
        purchaseApr: fa.purchaseApr,
        billingCycle: fa.billingCycle,
        gracePeriod: fa.gracePeriod,
      },
      creditMin: fa.creditMin,
      creditMax: fa.creditMax,
      purchaseApr: fa.purchaseApr,
      billingCycle: fa.billingCycle,
      gracePeriod: fa.gracePeriod,
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
      rewardsEnabled: rewardEnabled,
      rewardsProgram: rewardEnabled ? {
        programName: rewardsProgramName.trim(),
        accrualBasis,
        postingTiming,
        baseEarningRate: { value: parseFloat(baseMultiplier) || 1, unit: 'points_per_dollar' },
        earningRules: bonusCategories.filter(c => c.enabled).map(c => ({
          id: 'RULE-' + c.key.toUpperCase(),
          name: `${c.key} Bonus`,
          multiplier: parseFloat(c.multiplier) || 2,
          unit: 'points_per_dollar',
          mccCodes: (c.mccInput || '').split(',').map(s => s.trim()).filter(Boolean),
          status: 'active',
          startDate: null,
          endDate: null,
        })),
        redemptionMethods: [
          {
            type: 'statement_credit',
            enabled: true,
            conversion: {
              points: parseInt(conversionPoints, 10) || 1000,
              amount: parseFloat(conversionAmount) || 10,
              currency: 'USD',
            },
            minimumIncrement: parseInt(minimumRedemptionIncrement, 10) || 1000,
          },
          { type: 'external', enabled: false, status: 'coming_soon' },
        ],
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
            <span style={{ color: 'var(--fta-text-5)', fontWeight: 500 }}>Creating sub-program under {programObj.name}</span>
          </>
        ) : (
          <>
            <button onClick={() => navigate('subprograms')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
              <Icon name="chev-left" size={13} /> Sub-program
            </button>
            <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
            <span style={{ color: 'var(--fta-text-5)', fontWeight: 500 }}>Create New Sub-program</span>
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
        <div style={{ display: 'flex', gap: 10 }}>
          {import.meta.env.DEV && (
            <button type="button" className="btn btn-ghost" onClick={fillDemoData} style={{ fontSize: 12, opacity: 0.75 }}>Fill Demo Data</button>
          )}
          <button className="btn btn-ghost" onClick={() => programObj ? navigate('program-detail', programId) : navigate('subprograms')}>Cancel</button>
        </div>
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
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--foreground)' }}>{programObj.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--fta-text-4)', marginTop: 2, fontFamily: 'monospace' }}>{programObj.id}</div>
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
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Financial Product</div>
                <FormField label="Financial Product" required style={{ marginBottom: selectedFinancialProduct ? 16 : 6 }}>
                  <div className="select">
                    <select value={financialProductId} onChange={e => setFinancialProductId(e.target.value)}>
                      <option value="">— Select Financial Product —</option>
                      {AppData.financialProducts.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                      ))}
                    </select>
                  </div>
                  {!financialProductId && (
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 6 }}>
                      Select a financial product to load credit limit, APR, billing cycle, and grace period settings.
                    </div>
                  )}
                </FormField>

                {selectedFinancialProduct && (
                  <div style={{ background: 'var(--fta-fill-2)', border: '1px solid var(--fta-line-2)', borderRadius: 8, padding: '16px 18px', marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>Financial Product Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 24px', marginBottom: 18 }}>
                      {[
                        ['Product Name', selectedFinancialProduct.name],
                        ['Product Type', selectedFinancialProduct.productType],
                        ['Currency',     selectedFinancialProduct.currency],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#333333' }}>{val || '—'}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>Credit Terms</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
                      {[
                        ['Credit Limit Range (Min, USD)', selectedFinancialProduct.creditMin ? `$ ${Number(selectedFinancialProduct.creditMin).toLocaleString()}` : '—'],
                        ['Credit Limit Range (Max, USD)', selectedFinancialProduct.creditMax ? `$ ${Number(selectedFinancialProduct.creditMax).toLocaleString()}` : '—'],
                        ['Purchase APR (%)',              selectedFinancialProduct.purchaseApr ? `${selectedFinancialProduct.purchaseApr}%` : '—'],
                        ['Billing Cycle',                 selectedFinancialProduct.billingCycle || '—'],
                        ['Grace Period (days)',           selectedFinancialProduct.gracePeriod ? `${selectedFinancialProduct.gracePeriod} days` : '—'],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#333333' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('card')}>Save</button>
              </Accordion>

              {/* Rewards Program accordion */}
              <Accordion
                title="Rewards Program"
                sub="Configure how cardholders earn, accrue, and redeem rewards for this subprogram. These rules apply to all accounts issued under this subprogram."
                open={openAcc.reward}
                done={!rewardEnabled || !!(rewardsProgramName.trim().length >= 2 && parseFloat(baseMultiplier) >= 0 && parseFloat(baseMultiplier) <= 10 && parseInt(conversionPoints, 10) >= 1 && parseFloat(conversionAmount) >= 0.01 && parseInt(minimumRedemptionIncrement, 10) >= 1)}
                onToggle={() => toggleAcc('reward')}
              >
                {/* Toggle switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '14px 16px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                  <div
                    style={{ width: 38, height: 22, borderRadius: 11, cursor: 'pointer', background: rewardEnabled ? 'var(--fta-primary-6)' : '#CBD5E0', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
                    onClick={() => { setRewardEnabled(v => !v); setRewardFieldErrors({}); setRewardError(''); }}
                  >
                    <div style={{ position: 'absolute', top: 3, left: rewardEnabled ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: rewardEnabled ? 'var(--fta-text-5)' : 'var(--fta-text-3)' }}>Enable Rewards Program</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>Enable rewards for all accounts issued under this subprogram.</div>
                  </div>
                </div>

                {!rewardEnabled && (
                  <div style={{ padding: '24px 0 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 10, opacity: 0.3 }}>✦</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fta-text-3)', marginBottom: 6 }}>Rewards are not enabled</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-4)', maxWidth: 340, margin: '0 auto', lineHeight: 1.6 }}>Turn on rewards to configure earning rules, posting timing, and redemption options for this subprogram.</div>
                  </div>
                )}

                {rewardEnabled && (
                  <>
                    {/* Error summary */}
                    {Object.keys(rewardFieldErrors).length > 0 && (
                      <div style={{ marginBottom: 16, padding: '12px 14px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 8, fontSize: 13, color: '#c53030' }}>
                        Please fix {Object.keys(rewardFieldErrors).length} field{Object.keys(rewardFieldErrors).length > 1 ? 's' : ''} before saving this rewards program.
                      </div>
                    )}

                    {/* Program Name */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', fontWeight: 600, marginBottom: 4 }}>
                        Rewards Program Name <span style={{ color: '#e53e3e' }}>*</span>
                      </div>
                      <div className="input" style={{ borderColor: rewardFieldErrors.programName ? '#fc8181' : undefined }}>
                        <input type="text" placeholder="e.g. Travel Rewards Program" maxLength={80} value={rewardsProgramName}
                          onChange={e => setRewardsProgramName(e.target.value.replace(/[<>{}]/g, ''))} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        {rewardFieldErrors.programName
                          ? <div style={{ fontSize: 11.5, color: '#c53030' }}>{rewardFieldErrors.programName}</div>
                          : <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)' }}>2–80 characters. Visible to cardholders.</div>
                        }
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', flexShrink: 0, marginLeft: 8 }}>{rewardsProgramName.length}/80</div>
                      </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '4px 0 18px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Earning Rules</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 14 }}>Define how cardholders earn points on purchases.</div>

                    {/* Base earning rate */}
                    <div style={{ marginBottom: 14, padding: '14px 16px', background: 'var(--fta-fill-2)', border: `1.5px solid ${rewardFieldErrors.baseMultiplier ? '#fc8181' : 'var(--fta-line-2)'}`, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 8, fontWeight: 600 }}>
                        Base Earning Rate <span style={{ color: '#e53e3e' }}>*</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div className="input" style={{ width: 80 }}>
                          <input type="number" min="0" max="10" step="0.01" placeholder="1" value={baseMultiplier}
                            onChange={e => setBaseMultiplier(e.target.value)} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>x points per $1</span>
                        <span style={{ fontSize: 11.5, color: 'var(--fta-text-3)' }}>on all eligible purchases</span>
                      </div>
                      {rewardFieldErrors.baseMultiplier
                        ? <div style={{ fontSize: 11.5, color: '#c53030', marginTop: 6 }}>{rewardFieldErrors.baseMultiplier}</div>
                        : <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 6 }}>Range: 0–10. 0x means no base rewards. Up to 2 decimal places (e.g. 1.5).</div>
                      }
                    </div>

                    {/* Bonus categories */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: 'var(--fta-text-3)', fontWeight: 600 }}>Bonus Categories</div>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-4)' }}>Optional — enable to override base rate</div>
                      </div>
                      {bonusCategories.map((cat, idx) => (
                        <div key={cat.key} style={{
                          marginBottom: 8, padding: '12px 14px',
                          background: cat.enabled ? '#fff' : 'var(--fta-fill-2)',
                          border: `1.5px solid ${cat.enabled ? 'var(--fta-primary-3)' : 'var(--fta-line-2)'}`,
                          borderRadius: 8,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: cat.enabled ? 10 : 0 }}>
                            <input type="checkbox" checked={cat.enabled}
                              onChange={e => setBonusCategories(prev => prev.map((c, i) => i === idx ? { ...c, enabled: e.target.checked } : c))}
                              style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 80 }}>{cat.key}</span>
                            {cat.enabled ? (
                              <>
                                <div className="input" style={{ width: 72, borderColor: rewardFieldErrors[`bonusMult_${idx}`] ? '#fc8181' : undefined }}>
                                  <input type="number" min="0.01" max="20" step="0.01" value={cat.multiplier}
                                    onChange={e => setBonusCategories(prev => prev.map((c, i) => i === idx ? { ...c, multiplier: e.target.value } : c))} />
                                </div>
                                <span style={{ fontSize: 12.5, fontWeight: 500 }}>x points per $1</span>
                              </>
                            ) : (
                              <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>Not enabled</span>
                            )}
                          </div>
                          {cat.enabled && (
                            <>
                              {rewardFieldErrors[`bonusMult_${idx}`] && (
                                <div style={{ fontSize: 11.5, color: '#c53030', marginBottom: 8 }}>{rewardFieldErrors[`bonusMult_${idx}`]}</div>
                              )}
                              <div>
                                <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginBottom: 4 }}>
                                  MCC codes <span style={{ color: 'var(--fta-text-4)' }}>(4-digit, comma-separated)</span>
                                </div>
                                <div className="input" style={{ borderColor: rewardFieldErrors[`mcc_${idx}`] ? '#fc8181' : undefined }}>
                                  <input type="text" placeholder="e.g. 3000-3999, 5812" value={cat.mccInput}
                                    onChange={e => setBonusCategories(prev => prev.map((c, i) => i === idx ? { ...c, mccInput: e.target.value.replace(/[a-zA-Z]/g, '') } : c))} />
                                </div>
                                {rewardFieldErrors[`mcc_${idx}`]
                                  ? <div style={{ fontSize: 11.5, color: '#c53030', marginTop: 4 }}>{rewardFieldErrors[`mcc_${idx}`]}</div>
                                  : <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginTop: 4 }}>Enter 4-digit codes or ranges (e.g. 3000-3999). Commas separate multiple values.</div>
                                }
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {!bonusCategories.some(c => c.enabled) && (
                        <div style={{ fontSize: 12, color: 'var(--fta-text-4)', paddingLeft: 4 }}>No bonus categories added. Enable categories above to reward specific merchant types.</div>
                      )}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '4px 0 18px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Accrual Basis</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 10 }}>Choose how earning events are triggered.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="accrualBasis" value="purchase_based" checked={accrualBasis === 'purchase_based'} onChange={() => setAccrualBasis('purchase_based')} style={{ accentColor: 'var(--fta-primary-6)', marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>Purchase based</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>Rewards are earned from eligible cleared transactions.</div>
                        </div>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="accrualBasis" value="payment_based" checked={accrualBasis === 'payment_based'} onChange={() => setAccrualBasis('payment_based')} style={{ accentColor: 'var(--fta-primary-6)', marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>Payment based</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>Rewards are earned from completed payments.</div>
                        </div>
                      </label>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '4px 0 18px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Reward Posting Timing</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 10 }}>Choose when earned rewards become available to the cardholder.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="postingTiming" value="after_clearing" checked={postingTiming === 'after_clearing'} onChange={() => setPostingTiming('after_clearing')} style={{ accentColor: 'var(--fta-primary-6)', marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>After transaction clearing</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>Points are posted when the transaction clears. They may initially appear as pending.</div>
                        </div>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="postingTiming" value="after_statement" checked={postingTiming === 'after_statement'} onChange={() => setPostingTiming('after_statement')} style={{ accentColor: 'var(--fta-primary-6)', marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>After statement generation</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>Points are batched and posted at the end of each billing cycle.</div>
                        </div>
                      </label>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '4px 0 18px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Redemption</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 14 }}>Choose how cardholders can redeem their rewards.</div>

                    {/* Redemption Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-primary-3)', borderRadius: 8 }}>
                        <input type="checkbox" checked readOnly style={{ accentColor: 'var(--fta-primary-6)', width: 15, height: 15 }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>Statement Credit</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-success)' }}>Enabled</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 8, opacity: 0.55 }}>
                        <input type="checkbox" disabled style={{ width: 15, height: 15, marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-3)' }}>External Redemption</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>External partner redemption is not available in this MVP.</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--fta-fill-3)', color: 'var(--fta-text-3)', padding: '2px 8px', borderRadius: 10, flexShrink: 0 }}>Coming soon</span>
                      </div>
                    </div>

                    {/* Conversion Rate — dual input */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', fontWeight: 600, marginBottom: 4 }}>
                        Conversion Rate <span style={{ color: '#e53e3e' }}>*</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <div className="input" style={{ width: 88, borderColor: rewardFieldErrors.conversionPoints ? '#fc8181' : undefined }}>
                          <input type="number" min="1" max="1000000" step="1" placeholder="1000" value={conversionPoints}
                            onChange={e => setConversionPoints(e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '') || '')} />
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>points =</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fta-text-2)' }}>$</span>
                        <div className="input" style={{ width: 88, borderColor: rewardFieldErrors.conversionAmount ? '#fc8181' : undefined }}>
                          <input type="number" min="0.01" max="10000" step="0.01" placeholder="10.00" value={conversionAmount}
                            onChange={e => setConversionAmount(e.target.value)} />
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>USD</span>
                      </div>
                      {(rewardFieldErrors.conversionPoints || rewardFieldErrors.conversionAmount)
                        ? <div style={{ fontSize: 11.5, color: '#c53030', marginTop: 4 }}>{rewardFieldErrors.conversionPoints || rewardFieldErrors.conversionAmount}</div>
                        : <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 4 }}>
                            Define how points convert to statement credit.
                            {conversionPoints && conversionAmount && !isNaN(parseFloat(conversionAmount)) && parseInt(conversionPoints, 10) > 0
                              ? ` Effective rate: 1 pt = $${(parseFloat(conversionAmount) / parseInt(conversionPoints, 10)).toFixed(4).replace(/\.?0+$/, '')} USD.`
                              : ''}
                          </div>
                      }
                    </div>

                    {/* Minimum redemption increment */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', fontWeight: 600, marginBottom: 4 }}>
                        Minimum Redemption Increment <span style={{ color: '#e53e3e' }}>*</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="input" style={{ width: 100, borderColor: rewardFieldErrors.minimumRedemption ? '#fc8181' : undefined }}>
                          <input type="number" min="1" step="1" placeholder="1000" value={minimumRedemptionIncrement}
                            onChange={e => setMinimumRedemptionIncrement(e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '') || '')} />
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>points</span>
                      </div>
                      {rewardFieldErrors.minimumRedemption
                        ? <div style={{ fontSize: 11.5, color: '#c53030', marginTop: 4 }}>{rewardFieldErrors.minimumRedemption}</div>
                        : <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 4 }}>Cardholders can only redeem in multiples of this increment. Must be a whole number.</div>
                      }
                    </div>
                  </>
                )}

                {rewardError && (
                  <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, fontSize: 13, color: '#c53030' }}>
                    {rewardError}
                  </div>
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
                          <ArtworkPreview artwork={cardFrontArtwork} alt="front preview" />
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fta-text-5)', textAlign: 'center', padding: '0 8px' }}>{cardFrontArtwork.fileName}</div>
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
                          <ArtworkPreview artwork={cardBackArtwork} alt="back preview" />
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fta-text-5)', textAlign: 'center', padding: '0 8px' }}>{cardBackArtwork.fileName}</div>
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

