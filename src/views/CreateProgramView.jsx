import React, { useState } from 'react'
import { Icon } from '../components/Shell'
import AppData from '../data/AppData'

export default function CreateCreditCardProgramView({ navigate }) {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [progName, setProgName] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAccount, setBusinessAccount] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerAddress, setManagerAddress] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const total = 2;

  function goStep(n) {
    setStep(n);
    setTimeout(() => { const el = document.querySelector('.content'); if (el) el.scrollTop = 0; }, 0);
  }

  function fillDemoData() {
    setProgName(`Test Program ${Date.now()}`);
    setBusinessName('Demo Business Corp.');
    setBusinessAccount('Finbank Credit Account 8888');
    setIndustry('Financial Services');
    setContactName('Jane Demo');
    setContactPhone('+1 (555) 000-1234');
    setManagerName('John Demo');
    setManagerPhone('+1 (555) 000-5678');
  }

  function handleSubmit() {
    if (!progName.trim()) { setSubmitError('Program Name is required. Please go back to Step 1.'); return; }
    setSubmitError('');
    const maxNum = AppData.programs.reduce((m, p) => {
      const n = parseInt((p.id || '').replace('P-', ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const newId = 'P-' + String(maxNum + 1).padStart(3, '0');
    AppData.programs.unshift({
      id: newId,
      name: progName.trim(),
      description: description.trim(),
      businessName: businessName.trim(),
      businessAccount: businessAccount.trim(),
      industry,
      companySize,
      contact: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      contactAddress: contactAddress.trim(),
      manager: managerName.trim(),
      managerPhone: managerPhone.trim(),
      managerEmail: managerEmail.trim(),
      managerAddress: managerAddress.trim(),
      subs: 0,
      cards: 0,
      status: 'Under Review',
      updated: mm + '/' + dd + '/' + today.getFullYear(),
    });
    setShowSuccess(true);
    setTimeout(() => navigate('program-detail', newId), 1800);
  }

  const stepLabels = ['General Information', 'Business Information'];

  return (
    <div className="content-inner fade-in">
      <style>{`
        .cp-breadcrumb{display:flex;align-items:center;gap:6px;font-size:13px;color:#718096;padding:4px 0 12px}
        .cp-breadcrumb button{background:none;border:none;color:#718096;cursor:pointer;font-size:13px;padding:0}
        .cp-breadcrumb button:hover{color:#1a3c8f}
        .cp-page-header{background:#fff;border:1px solid #e8eaed;border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
        .cp-header-left{display:flex;align-items:center;gap:12px}
        .cp-header-icon{width:52px;height:52px;background:#f0f2f5;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#4a5568;flex-shrink:0}
        .cp-layout{display:flex;gap:24px;align-items:flex-start}
        .cp-step-sidebar{width:220px;flex-shrink:0}
        .cp-step-num{font-size:13px;color:#718096;margin-bottom:16px}
        .cp-step-num strong{color:#1a1a2e;font-size:20px}
        .cp-step-list{display:flex;flex-direction:column;gap:4px}
        .cp-step-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:13.5px;color:#4a5568;transition:background .15s}
        .cp-step-item:hover{background:#f7f8fc}
        .cp-step-item.act{background:#ebf0fb;color:#1a3c8f;font-weight:500}
        .cp-step-item.done{color:#48bb78}
        .cp-bullet{width:28px;height:28px;border-radius:50%;border:2px solid #cbd5e0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#718096;flex-shrink:0}
        .cp-step-item.act .cp-bullet{border-color:#1a3c8f;color:#1a3c8f}
        .cp-step-item.done .cp-bullet{border-color:#48bb78;background:#48bb78;color:#fff}
        .cp-form{flex:1;background:#fff;border-radius:12px;border:1px solid #e8eaed;padding:28px 32px;max-width:760px}
        .cp-sec-title{font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:4px}
        .cp-sec-sub{font-size:13px;color:#718096;margin-bottom:24px}
        .cp-group-title{font-size:13.5px;font-weight:700;color:#2d3748;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f0f2f5}
        .cp-row{display:flex;gap:16px;margin-bottom:16px}
        .cp-row.s{flex-direction:column}
        .cp-field{display:flex;flex-direction:column;gap:5px;flex:1}
        .cp-field label{font-size:13px;color:#4a5568;font-weight:500}
        .cp-field input,.cp-field select,.cp-field textarea{height:36px;border:1px solid #dde1e8;border-radius:7px;padding:0 12px;font-size:13.5px;color:#2d3748;background:#fff;outline:none;transition:border .15s,box-shadow .15s;width:100%;font-family:inherit}
        .cp-field input:focus,.cp-field select:focus,.cp-field textarea:focus{border-color:#1a3c8f;box-shadow:0 0 0 3px rgba(26,60,143,.08)}
        .cp-field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        .cp-field textarea{height:80px;padding:10px 12px;resize:vertical}
        .cp-field input::placeholder,.cp-field textarea::placeholder{color:#a0aec0}
        .cp-char-count{font-size:11px;color:#a0aec0;text-align:right;margin-top:2px}
        .cp-logo-area{display:flex;align-items:flex-end;gap:14px;margin-bottom:20px}
        .cp-logo-preview{width:88px;height:88px;border:1.5px dashed #dde1e8;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#f7f8fc;flex-shrink:0;color:#a0aec0}
        .cp-divider{height:1px;background:#f0f2f5;margin:22px 0}
        .cp-hint{background:#fffbeb;border:1px solid #f6e05e;border-radius:8px;padding:10px 14px;font-size:12.5px;color:#744210;margin-bottom:18px;display:flex;gap:8px;align-items:flex-start}
        .cp-confirm-row{display:flex;align-items:flex-start;gap:10px;padding:14px;background:#f0f5ff;border:1.5px solid #c3d3f7;border-radius:8px;margin-top:16px;cursor:pointer}
        .cp-confirm-row input[type=checkbox]{accent-color:#1a3c8f;width:16px;height:16px;margin-top:2px;flex-shrink:0;cursor:pointer}
        .cp-confirm-text{font-size:13px;color:#2d3748;line-height:1.5}
        .cp-confirm-text strong{color:#1a3c8f}
        .cp-btn-row{display:flex;justify-content:flex-end;gap:10px;margin-top:28px}
        .cp-req{color:#e53e3e;margin-left:2px}
      `}</style>

      <div className="cp-breadcrumb">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        <button onClick={() => navigate('programs')}>Program</button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{color:'#4a5568'}}>Create Program</span>
      </div>

      <div className="cp-page-header">
        <div className="cp-header-left">
          <div className="cp-header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="3"/><path d="M1 10h22"/><path d="M5 15h4M15 15h4"/></svg>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:'#1a1a2e'}}>Create Credit Card Program</div>
            <div style={{fontSize:13,color:'#718096',marginTop:2}}>Set up the program branding and business information.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {import.meta.env.DEV && (
            <button type="button" className="btn btn-ghost" onClick={fillDemoData} style={{ fontSize: 12, opacity: 0.75 }}>Fill Demo Data</button>
          )}
          <button className="btn btn-ghost" onClick={() => navigate('programs')}>Cancel</button>
        </div>
      </div>

      <div className="cp-layout">
        <div className="cp-step-sidebar">
          <div className="cp-step-num">Step <strong>{step}</strong> / {total}</div>
          <div className="cp-step-list">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const isDone = n < step;
              const isAct = n === step;
              return (
                <div key={n} className={'cp-step-item' + (isAct ? ' act' : '') + (isDone ? ' done' : '')} onClick={() => goStep(n)}>
                  <div className="cp-bullet">
                    {isDone ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : n}
                  </div>
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {step === 1 && (
          <div className="cp-form">
            <div className="cp-sec-title">General Information</div>
            <div className="cp-sec-sub">Set the program identity — logo, name, and description.</div>

            <label style={{fontSize:13,color:'#4a5568',fontWeight:500,display:'block',marginBottom:8}}>Program Logo</label>
            <div className="cp-logo-area">
              <div className="cp-logo-preview">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <div>
                <button className="btn btn-primary" style={{fontSize:13}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:5}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload Logo
                </button>
                <div style={{fontSize:12,color:'#a0aec0',marginTop:6}}>PNG or SVG, recommended 200x200px</div>
              </div>
            </div>

            <div className="cp-row s">
              <div className="cp-field">
                <label>Program Name <span className="cp-req">*</span></label>
                <input type="text" placeholder="e.g. Platinum Rewards Credit Program" value={progName} onChange={e => setProgName(e.target.value)} />
              </div>
            </div>
            <div className="cp-row s">
              <div className="cp-field">
                <label>Description</label>
                <textarea placeholder="Briefly describe the program's purpose and target audience..." maxLength={200} value={description} onChange={e => setDescription(e.target.value)} />
                <div className="cp-char-count">{description.length} / 200</div>
              </div>
            </div>

            <div className="cp-btn-row">
              <button className="btn btn-primary" onClick={() => goStep(2)}>Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="cp-form">
            <div className="cp-sec-title">Business Information</div>
            <div className="cp-sec-sub">Provide business details and contact information.</div>

            <div className="cp-group-title">Business Information</div>
            <div className="cp-row">
              <div className="cp-field">
                <label>Business Name <span className="cp-req">*</span></label>
                <input type="text" placeholder="Legal entity name" value={businessName} onChange={e => setBusinessName(e.target.value)} />
              </div>
              <div className="cp-field">
                <label>Business Account <span className="cp-req">*</span></label>
                <input type="text" placeholder="e.g. Finbank Credit Account 8888" value={businessAccount} onChange={e => setBusinessAccount(e.target.value)} />
              </div>
            </div>
            <div className="cp-row">
              <div className="cp-field">
                <label>Industry <span className="cp-req">*</span></label>
                <select value={industry} onChange={e => setIndustry(e.target.value)}><option value="">Please Select</option><option>Financial Services</option><option>Retail and E-Commerce</option><option>Travel and Hospitality</option><option>Healthcare</option><option>Technology</option><option>Education</option><option>Other</option></select>
              </div>
              <div className="cp-field">
                <label>Company Size</label>
                <select value={companySize} onChange={e => setCompanySize(e.target.value)}><option value="">Please Select</option><option>1-50 employees</option><option>51-200 employees</option><option>201-1,000 employees</option><option>1,000+ employees</option></select>
              </div>
            </div>

            <div className="cp-divider" />

            <div className="cp-group-title">Contact Information</div>
            <div className="cp-row">
              <div className="cp-field">
                <label>Contact Name <span className="cp-req">*</span></label>
                <input type="text" placeholder="Full name" value={contactName} onChange={e => setContactName(e.target.value)} />
              </div>
              <div className="cp-field">
                <label>Contact Phone <span className="cp-req">*</span></label>
                <input type="tel" placeholder="e.g. +1 (207) 555-0119" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>
            </div>
            <div className="cp-row">
              <div className="cp-field">
                <label>Contact Email</label>
                <input type="email" placeholder="contact@company.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              </div>
              <div className="cp-field">
                <label>Address</label>
                <input type="text" placeholder="Street, city, state, ZIP" value={contactAddress} onChange={e => setContactAddress(e.target.value)} />
              </div>
            </div>

            <div className="cp-divider" />

            <div className="cp-group-title">Account Manager Information</div>
            <div className="cp-row">
              <div className="cp-field">
                <label>Account Manager Name <span className="cp-req">*</span></label>
                <input type="text" placeholder="Full name" value={managerName} onChange={e => setManagerName(e.target.value)} />
              </div>
              <div className="cp-field">
                <label>Account Manager Phone <span className="cp-req">*</span></label>
                <input type="tel" placeholder="e.g. +1 (307) 555-0133" value={managerPhone} onChange={e => setManagerPhone(e.target.value)} />
              </div>
            </div>
            <div className="cp-row">
              <div className="cp-field">
                <label>Account Manager Email</label>
                <input type="email" placeholder="manager@company.com" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} />
              </div>
              <div className="cp-field">
                <label>Address</label>
                <input type="text" placeholder="Street, city, state, ZIP" value={managerAddress} onChange={e => setManagerAddress(e.target.value)} />
              </div>
            </div>


            {submitError && (
              <div style={{color:'#e53e3e',fontSize:13,background:'#fff5f5',border:'1px solid #fed7d7',borderRadius:7,padding:'9px 14px',marginTop:14}}>{submitError}</div>
            )}
            <div className="cp-btn-row">
              <button className="btn btn-ghost" onClick={() => goStep(1)}>Previous</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: '#fff', border: '1px solid #c6f6d5', borderRadius: 12, padding: '14px 20px 14px 16px', boxShadow: '0 8px 32px rgba(0,0,0,.14)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 300 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c6f6d5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e' }}>Program created successfully</div>
            <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>Redirecting to Program Detail…</div>
          </div>
        </div>
      )}
    </div>
  );
}
