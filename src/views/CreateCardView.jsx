import React, { useState } from 'react';
import { Icon } from '../components/Shell';
import AppData from '../data/AppData';

const STEPS = ['General Information', 'Card Configuration', 'Review & Create'];

const CARD_MATERIAL_PRICES = {
  'Standard PVC': 1.25,
  'Recycled PVC': 1.65,
  'Metal': 8.50,
  'Premium Metal': 12.00,
  'Eco Composite': 2.10,
};

export default function CreateCardView({ navigate, navParam }) {
  const subprogramId = navParam?.subprogramId;
  const sub          = AppData.subPrograms.find(s => s.id === subprogramId);
  const program      = sub?.programId ? AppData.programs.find(p => p.id === sub.programId) : null;
  const binPrefix    = sub?.bin || '';

  const [step, setStep]               = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Step 1 — General Information
  const [cardName, setCardName]       = useState('');
  const [cardCode, setCardCode]       = useState('');
  const [description, setDescription] = useState('');

  // Step 2 — accordion states
  const [openAcc, setOpenAcc] = useState({ card: true, service: false, style: false, legal: false });
  const [accDone, setAccDone] = useState({ card: false, service: false, style: false, legal: false });

  // Card Information
  const [cardType, setCardType]               = useState('credit');
  const [physicalEnabled, setPhysicalEnabled] = useState(true);
  const [virtualEnabled, setVirtualEnabled]   = useState(false);
  const [network, setNetwork]                 = useState('');
  const [usageType, setUsageType]             = useState('');
  const [classification, setClassification]   = useState('Consumer');
  const [validPeriod, setValidPeriod]         = useState('');

  // Customer Service
  const [svcName, setSvcName]   = useState('');
  const [svcPhone, setSvcPhone] = useState('');
  const [svcEmail, setSvcEmail] = useState('');
  const [svcHours, setSvcHours] = useState('');

  // Artwork
  const [cardFrontArtwork, setCardFrontArtwork] = useState(null);
  const [cardBackArtwork, setCardBackArtwork]   = useState(null);
  const [cardFrontError, setCardFrontError]     = useState('');
  const [cardBackError, setCardBackError]       = useState('');

  // Production
  const [cardMaterial, setCardMaterial] = useState('');
  const [cardQuantity, setCardQuantity] = useState('');

  // Legal
  const [legalPkgId, setLegalPkgId] = useState('');

  // Derived
  const selectedLegalPkg = legalPkgId ? AppData.approvedLegalTermsPackages.find(p => p.id === legalPkgId) : null;
  const unitPrice        = cardMaterial ? (CARD_MATERIAL_PRICES[cardMaterial] ?? null) : null;
  const cardQtyNum       = parseInt(cardQuantity, 10);
  const totalPrice       = (unitPrice !== null && cardQuantity && !isNaN(cardQtyNum) && cardQtyNum > 0) ? unitPrice * cardQtyNum : null;

  // ── Guard: sub not found ──
  if (!sub) {
    return (
      <div className="content-inner fade-in">
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--fta-text-3)' }}>
          Sub-program not found. Cannot create card.
        </div>
      </div>
    );
  }

  // ── Guard: BIN Prefix missing on parent subprogram ──
  if (!binPrefix) {
    return (
      <div className="content-inner fade-in">
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#fff5f5', color: 'var(--fta-error)' }}>
            <Icon name="alert-triangle" size={24} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fta-error)', marginBottom: 8 }}>BIN Prefix is required on the parent subprogram.</div>
          <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20 }}>
            Please configure the BIN Prefix on <strong>{sub.name}</strong> before creating a card product.
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('subprogram-detail', { id: subprogramId, from: 'program', tab: 'cards' })}>
            Back to Sub-program
          </button>
        </div>
      </div>
    );
  }

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
    if (!cardName.trim()) { setSubmitError('Card Name is required.'); return; }

    const nameConflict = AppData.cards.some(
      c => c.subprogramId === subprogramId && c.cardName.trim().toLowerCase() === cardName.trim().toLowerCase()
    );
    if (nameConflict) { setSubmitError('A card with this name already exists in this sub-program.'); return; }

    if (!physicalEnabled && !virtualEnabled) { setSubmitError('Select at least one form factor (Physical Card or Virtual Card).'); return; }
    if (!/^\d{6,8}$/.test(binPrefix.trim())) { setSubmitError('BIN Prefix on the parent subprogram must be 6–8 digits.'); return; }
    if (!network)     { setSubmitError('Select a network.'); return; }
    if (!usageType)   { setSubmitError('Select a usage type.'); return; }
    if (!validPeriod) { setSubmitError('Select a valid period.'); return; }
    if (!svcName.trim()) { setSubmitError('Customer Service Name is required.'); return; }
    if (!svcPhone.trim()) { setSubmitError('Customer Service Phone is required.'); return; }
    if (!/^\+?[\d\s\-(). ]{7,20}$/.test(svcPhone.trim())) { setSubmitError('Enter a valid Customer Service Phone number.'); return; }
    if (!svcEmail.trim()) { setSubmitError('Customer Service Email is required.'); return; }
    if (!svcEmail.includes('@') || !svcEmail.split('@')[1]?.includes('.')) {
      setSubmitError('Enter a valid Customer Service Email address.'); return;
    }
    if (!cardFrontArtwork) { setSubmitError('Card Front Artwork is required.'); return; }
    if (!cardBackArtwork)  { setSubmitError('Card Back Artwork is required.'); return; }
    if (!cardMaterial) { setSubmitError('Select a card material.'); return; }

    const qtyNum = parseInt(cardQuantity, 10);
    if (!cardQuantity || isNaN(qtyNum) || !Number.isInteger(qtyNum) || qtyNum < 1 || qtyNum > 9999999) {
      setSubmitError('Card Quantity must be a whole number between 1 and 9,999,999.'); return;
    }
    if (!legalPkgId) { setSubmitError('Select an approved legal terms package.'); return; }

    setSubmitError('');

    const formFactors = [
      ...(physicalEnabled ? ['physical'] : []),
      ...(virtualEnabled  ? ['virtual']  : []),
    ];
    const uPrice = CARD_MATERIAL_PRICES[cardMaterial] ?? null;
    const tPrice = uPrice !== null ? uPrice * qtyNum : null;

    const newCard = {
      id:                   'CARD-' + String(Math.floor(Math.random() * 900000) + 100000),
      programId:            sub.programId,
      subprogramId,
      cardName:             cardName.trim(),
      cardCode:             cardCode.trim(),
      description:          description.trim(),
      cardStatus:           'Under Review',
      cardType,
      formFactors,
      type:                 formFactors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(' / '),
      binPrefix:            binPrefix.trim(),
      network,
      usageType,
      classificationType:   classification,
      validPeriod,
      cardFrontArtwork,
      cardBackArtwork,
      cardMaterial,
      cardMaterialUnitPrice: uPrice,
      cardQuantity:          qtyNum,
      cardTotalPrice:        tPrice,
      customerServiceName:   svcName.trim(),
      customerServicePhone:  svcPhone.trim(),
      customerServiceEmail:  svcEmail.trim(),
      customerServiceHours:  svcHours.trim(),
      legalTermsPackageId:   legalPkgId,
      legalTermsSnapshot:    selectedLegalPkg ? { ...selectedLegalPkg } : null,
      createdAt:             new Date().toISOString(),
    };

    AppData.cards.push(newCard);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('subprogram-detail', { id: subprogramId, from: 'create-card', tab: 'cards' });
    }, 1800);
  }

  const goBackToSub = () => navigate('subprogram-detail', { id: subprogramId, from: 'program', tab: 'cards' });

  function fillDemoData() {
    setCardName(`Test Card ${Date.now()}`);
    setNetwork('Visa');
    setUsageType('Multi-use');
    setValidPeriod('3 Years');
    setSvcName('Demo Card Service');
    setSvcPhone('+1 (555) 000-9999');
    setSvcEmail('support@demo.com');
    setCardFrontArtwork({ fileName: 'demo-card-front.png', fileType: 'image/png', width: 1012, height: 638, previewUrl: '', isDemo: true });
    setCardBackArtwork({ fileName: 'demo-card-back.png', fileType: 'image/png', width: 1012, height: 638, previewUrl: '', isDemo: true });
    setCardFrontError('');
    setCardBackError('');
    setCardMaterial('Standard PVC');
    setCardQuantity('5000');
    setLegalPkgId(AppData.approvedLegalTermsPackages[0]?.id || '');
    setOpenAcc({ card: true, service: true, style: true, legal: true });
  }

  return (
    <div className="content-inner fade-in">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 16 }}>
        <button onClick={() => navigate('subprograms')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', fontSize: 13, padding: 0 }}>
          Sub-Programs
        </button>
        <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
        <button onClick={goBackToSub} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fta-text-3)', fontSize: 13, padding: 0 }}>
          {sub.name}
        </button>
        <Icon name="chev-right" size={12} style={{ opacity: 0.4 }} />
        <span style={{ color: 'var(--fta-text-1)' }}>Create Card</span>
      </div>

      {/* Page header */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 54, height: 54, border: '1.5px solid var(--fta-line-2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fta-fill-2)' }}>
            <Icon name="card" size={28} style={{ color: 'var(--fta-primary-6)' }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Create Card under {sub.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginTop: 3 }}>Define a card product for this sub-program</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {import.meta.env.DEV && (
            <button type="button" className="btn btn-ghost" onClick={fillDemoData} style={{ fontSize: 12, opacity: 0.75 }}>Fill Demo Data</button>
          )}
          <button className="btn btn-ghost" onClick={goBackToSub}>Cancel</button>
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
            const done   = n < step;
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

          {/* ═══ STEP 1: General Information ═══ */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>General Information</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginBottom: 22 }}>Provide the card product identity and confirm the parent context.</div>

              {/* Parent Program — readonly */}
              <FormField label="Parent Program" style={{ marginBottom: 18 }}>
                <div style={{ background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fta-text-1)' }}>{program?.name || sub.programId}</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 2, fontFamily: 'monospace' }}>{sub.programId}</div>
                  </div>
                  {program && (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: program.status === 'Active' ? '#c6f6d5' : 'var(--fta-fill-3)', color: program.status === 'Active' ? '#276749' : 'var(--fta-text-3)' }}>{program.status}</span>
                  )}
                </div>
              </FormField>

              {/* Parent Sub-program — readonly */}
              <FormField label="Parent Sub-program" style={{ marginBottom: 18 }}>
                <div style={{ background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fta-text-1)' }}>{sub.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 2, fontFamily: 'monospace' }}>{sub.id} · BIN {binPrefix}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: sub.status === 'Active' ? '#c6f6d5' : 'var(--fta-fill-3)', color: sub.status === 'Active' ? '#276749' : 'var(--fta-text-3)' }}>{sub.status}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginTop: 6 }}>This card will be created under the selected sub-program and cannot be changed.</div>
              </FormField>

              <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                <FormField label="Card Name" required>
                  <div className="input"><input type="text" placeholder="e.g. Platinum Signature Card" value={cardName} onChange={e => setCardName(e.target.value)} /></div>
                </FormField>
                <FormField label="Card Code">
                  <div className="input"><input type="text" placeholder="e.g. PLAT-SIG-2024" value={cardCode} onChange={e => setCardCode(e.target.value)} /></div>
                </FormField>
              </div>

              <FormField label="Description" style={{ marginBottom: 6 }}>
                <textarea className="fld" placeholder="Optional – brief description of this card product" rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 100))}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, fontSize: 13, resize: 'vertical', fontFamily: 'inherit', outline: 'none' }} />
              </FormField>
              <div style={{ fontSize: 11, color: 'var(--fta-text-3)', textAlign: 'right', marginBottom: 4 }}>{description.length} / 100</div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                <button className="btn btn-primary" onClick={() => goStep(2)}>Next</button>
              </div>
            </>
          )}

          {/* ═══ STEP 2: Card Configuration ═══ */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Card Configuration</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginBottom: 22 }}>Configure the card product settings, artwork, and legal terms.</div>

              {/* Card Information */}
              <Accordion title="Card Information" sub="Set card type, form factors, network, and usage parameters."
                open={openAcc.card} done={accDone.card} onToggle={() => toggleAcc('card')}>
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="Card Type">
                    <RadioGroup name="cardType"
                      options={[{ value: 'credit', label: 'Credit Card' }, { value: 'debit', label: 'Debit Card' }]}
                      value={cardType} onChange={setCardType} />
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

                {/* BIN Prefix — readonly, inherited */}
                <div style={{ marginBottom: 18 }}>
                  <FormField label="BIN Prefix">
                    <div style={{ background: 'var(--fta-fill-2)', border: '1.5px solid var(--fta-line-2)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, color: 'var(--fta-text-1)' }}>{binPrefix}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--fta-text-3)', background: 'var(--fta-fill-3)', padding: '2px 8px', borderRadius: 10 }}>Inherited from sub-program · read-only</span>
                    </div>
                  </FormField>
                </div>

                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                  <FormField label="Network" required>
                    <div className="select"><select value={network} onChange={e => setNetwork(e.target.value)}>
                      <option value="">Please Select</option>
                      <option>Visa</option><option>Mastercard</option><option>UnionPay</option><option>American Express</option>
                    </select></div>
                  </FormField>
                  <FormField label="Usage Type" required>
                    <div className="select"><select value={usageType} onChange={e => setUsageType(e.target.value)}>
                      <option value="">Please select</option>
                      <option>Single-use</option><option>Multi-use</option>
                    </select></div>
                  </FormField>
                </div>

                <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
                  <FormField label="Classification Type" required>
                    <div className="select"><select value={classification} onChange={e => setClassification(e.target.value)}>
                      <option>Consumer</option><option>Commercial</option><option>Corporate</option>
                    </select></div>
                  </FormField>
                  <FormField label="Valid Period" required>
                    <div className="select"><select value={validPeriod} onChange={e => setValidPeriod(e.target.value)}>
                      <option value="">Please select</option>
                      <option>1 Year</option><option>2 Years</option><option>3 Years</option><option>5 Years</option>
                    </select></div>
                  </FormField>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => saveAcc('card')}>Save</button>
              </Accordion>

              {/* Customer Service */}
              <Accordion title="Customer Service" sub="Provide the customer service contact details for this card product."
                open={openAcc.service} done={accDone.service} onToggle={() => toggleAcc('service')}>
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

              {/* Card Artwork & Production */}
              <Accordion title="Card Artwork & Production" sub="Upload card artwork and configure production settings."
                open={openAcc.style} done={accDone.style} onToggle={() => toggleAcc('style')}>

                <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                  {/* Front artwork */}
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

                  {/* Back artwork */}
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

              {/* Approved Legal Terms */}
              <Accordion
                title="Approved Legal Terms"
                sub="Select an approved legal terms package for this card product."
                open={openAcc.legal} done={accDone.legal} onToggle={() => toggleAcc('legal')}>
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
                        ['Terms & Conditions',   selectedLegalPkg.documents?.termsAndConditionsUrl],
                        ['Privacy Policy',        selectedLegalPkg.documents?.privacyPolicyUrl],
                        ['Cardholder Agreement',  selectedLegalPkg.documents?.cardholderAgreementUrl],
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
                <button className="btn btn-primary" onClick={() => goStep(3)}>Next: Review</button>
              </div>
            </>
          )}

          {/* ═══ STEP 3: Review & Create ═══ */}
          {step === 3 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Review & Create</div>
              <div style={{ fontSize: 12.5, color: 'var(--fta-text-4)', marginBottom: 22 }}>Review the card product details before submitting.</div>

              {/* General Information */}
              <ReviewSection title="General Information">
                <div className="grid-2" style={{ marginBottom: 0 }}>
                  <ReviewRow label="Parent Program" value={program?.name || sub.programId} />
                  <ReviewRow label="Parent Sub-program" value={sub.name} />
                  <ReviewRow label="BIN Prefix" value={binPrefix} mono />
                  <ReviewRow label="Card Name" value={cardName || '—'} />
                  <ReviewRow label="Card Code" value={cardCode || '—'} />
                  <ReviewRow label="Description" value={description || '—'} />
                </div>
              </ReviewSection>

              {/* Card Information */}
              <ReviewSection title="Card Information">
                <div className="grid-2" style={{ marginBottom: 0 }}>
                  <ReviewRow label="Card Type" value={cardType === 'credit' ? 'Credit Card' : 'Debit Card'} />
                  <ReviewRow label="Form Factors" value={[physicalEnabled && 'Physical', virtualEnabled && 'Virtual'].filter(Boolean).join(', ') || '—'} />
                  <ReviewRow label="Network" value={network || '—'} />
                  <ReviewRow label="Usage Type" value={usageType || '—'} />
                  <ReviewRow label="Classification Type" value={classification || '—'} />
                  <ReviewRow label="Valid Period" value={validPeriod || '—'} />
                </div>
              </ReviewSection>

              {/* Customer Service */}
              <ReviewSection title="Customer Service">
                <div className="grid-2" style={{ marginBottom: 0 }}>
                  <ReviewRow label="Service Name" value={svcName || '—'} />
                  <ReviewRow label="Phone" value={svcPhone || '—'} />
                  <ReviewRow label="Email" value={svcEmail || '—'} />
                  <ReviewRow label="Service Hours" value={svcHours || '—'} />
                </div>
              </ReviewSection>

              {/* Artwork & Production */}
              <ReviewSection title="Card Artwork & Production">
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>Card Front Artwork</div>
                    {cardFrontArtwork?.previewUrl && cardFrontArtwork.fileType !== 'image/svg+xml'
                      ? <img src={cardFrontArtwork.previewUrl} alt="front" style={{ maxHeight: 72, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--fta-line-2)' }} />
                      : <div style={{ fontSize: 13, color: cardFrontArtwork ? 'var(--fta-text-1)' : 'var(--fta-text-3)', fontStyle: cardFrontArtwork ? 'normal' : 'italic', fontWeight: cardFrontArtwork ? 500 : 400 }}>
                          {cardFrontArtwork ? cardFrontArtwork.fileName : 'Not uploaded'}
                        </div>
                    }
                    {cardFrontArtwork?.width && <div style={{ fontSize: 11.5, color: 'var(--fta-text-4)', marginTop: 4 }}>{cardFrontArtwork.width} × {cardFrontArtwork.height} px</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>Card Back Artwork</div>
                    {cardBackArtwork?.previewUrl && cardBackArtwork.fileType !== 'image/svg+xml'
                      ? <img src={cardBackArtwork.previewUrl} alt="back" style={{ maxHeight: 72, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--fta-line-2)' }} />
                      : <div style={{ fontSize: 13, color: cardBackArtwork ? 'var(--fta-text-1)' : 'var(--fta-text-3)', fontStyle: cardBackArtwork ? 'normal' : 'italic', fontWeight: cardBackArtwork ? 500 : 400 }}>
                          {cardBackArtwork ? cardBackArtwork.fileName : 'Not uploaded'}
                        </div>
                    }
                    {cardBackArtwork?.width && <div style={{ fontSize: 11.5, color: 'var(--fta-text-4)', marginTop: 4 }}>{cardBackArtwork.width} × {cardBackArtwork.height} px</div>}
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: 0 }}>
                  <ReviewRow label="Card Material" value={cardMaterial || '—'} />
                  <ReviewRow label="Unit Price (USD)" value={unitPrice !== null ? `$${unitPrice.toFixed(2)} / card` : '—'} />
                  <ReviewRow label="Card Quantity" value={cardQuantity ? Number(cardQuantity).toLocaleString() : '—'} />
                  <ReviewRow label="Estimated Total" value={totalPrice !== null ? `$${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'} />
                </div>
              </ReviewSection>

              {/* Legal Terms */}
              <ReviewSection title="Approved Legal Terms">
                {selectedLegalPkg ? (
                  <div className="grid-2" style={{ marginBottom: 0 }}>
                    <ReviewRow label="Package Name" value={selectedLegalPkg.name} />
                    <ReviewRow label="Version" value={selectedLegalPkg.version} />
                    <ReviewRow label="Issuer" value={selectedLegalPkg.issuer} />
                    <ReviewRow label="Market" value={selectedLegalPkg.market} />
                    <ReviewRow label="Effective Date" value={selectedLegalPkg.effectiveDate} />
                    <ReviewRow label="Approved By" value={selectedLegalPkg.approvedBy} />
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--fta-text-3)', fontStyle: 'italic' }}>No package selected</div>
                )}
              </ReviewSection>

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

      {/* Success toast */}
      {showSuccess && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: '#fff', border: '1px solid #c6f6d5', borderRadius: 12, padding: '14px 20px 14px 16px', boxShadow: '0 8px 32px rgba(0,0,0,.14)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 300 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c6f6d5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e' }}>Card created successfully.</div>
            <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>Redirecting to Cards tab…</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Local UI helpers ────────────────────────────────────────────

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

function Accordion({ title, sub, open, done, onToggle, children }) {
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
        <span style={{ fontSize: 12, fontWeight: 500, color: done ? 'var(--fta-success)' : 'var(--fta-warning)' }}>
          {done ? 'Complete' : 'Incomplete'}
        </span>
      </div>
      {open && (
        <div style={{ padding: '20px', borderTop: '1px solid var(--fta-line-2)', background: '#fff' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--fta-line-3)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fta-text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value, mono }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-1)', fontFamily: mono ? 'monospace' : 'inherit' }}>{value || '—'}</div>
    </div>
  );
}
