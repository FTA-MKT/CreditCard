import React from 'react';
import { Icon, StatusPill, Breadcrumb } from '../components/Shell';
import { ColorAvatar, Field, NetworkMark } from '../components/shared';
import AppData from '../data/AppData';

const _CREDIT_GRADIENTS = [
  'linear-gradient(135deg, #294A60 0%, #0B1744 100%)',
  'linear-gradient(135deg, #3A3F46 0%, #1F2933 100%)',
  'linear-gradient(135deg, #5B5A55 0%, #2F3437 100%)',
  'linear-gradient(135deg, #526678 0%, #26384A 100%)',
];

function getCardDetailVisual(card) {
  const snap       = card.inheritedSubprogramSnapshot || {};
  const artwork    = snap.artworkFront;
  const hasArtwork = !!(artwork?.previewUrl && artwork.previewUrl !== '');
  const isCredit   = !String(card.cardType || '').toLowerCase().includes('debit');
  let h = 0;
  const s = String(card.id || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return {
    hasArtwork,
    artworkUrl:  hasArtwork ? artwork.previewUrl : null,
    isCredit,
    background:  isCredit ? _CREDIT_GRADIENTS[h % _CREDIT_GRADIENTS.length] : 'linear-gradient(135deg, #E7E7E7 0%, #CFCFCF 100%)',
    textColor:   isCredit || hasArtwork ? '#FFFFFF' : '#1D2129',
    decoAlpha1:  isCredit || hasArtwork ? 'rgba(255,255,255,0.07)' : 'rgba(29,33,41,0.05)',
    decoAlpha2:  isCredit || hasArtwork ? 'rgba(255,255,255,0.05)' : 'rgba(29,33,41,0.04)',
    badgeBg:     hasArtwork ? 'rgba(0,0,0,0.35)' : (isCredit ? 'rgba(255,255,255,0.2)' : 'rgba(29,33,41,0.1)'),
  };
}

function DetailSection({ title, children }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: '#1D2129', letterSpacing: '.01em' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function SpendingControlsSummary({ sc }) {
  if (!sc) return <Field label="Spending Controls" value="—" />;

  const rows = [];

  const fl = sc.frequencyLimits || {};
  if (fl.daily)   rows.push(['Daily Frequency Limit',   `$${Number(fl.daily).toLocaleString()}`]);
  if (fl.weekly)  rows.push(['Weekly Frequency Limit',  `$${Number(fl.weekly).toLocaleString()}`]);
  if (fl.monthly) rows.push(['Monthly Frequency Limit', `$${Number(fl.monthly).toLocaleString()}`]);
  if (fl.yearly)  rows.push(['Yearly Frequency Limit',  `$${Number(fl.yearly).toLocaleString()}`]);

  const al = sc.amountLimits || {};
  if (al.perAuthorization) rows.push(['Per-Auth Limit',  `$${Number(al.perAuthorization).toLocaleString()}`]);
  if (al.total)            rows.push(['Total Limit',     `$${Number(al.total).toLocaleString()}`]);

  const tl = sc.transactionLimits || {};
  if (tl.daily)  rows.push(['Daily Txn Count',  String(tl.daily)]);
  if (tl.weekly) rows.push(['Weekly Txn Count', String(tl.weekly)]);

  if (sc.denyListMcc?.length)  rows.push(['Blocked MCC', sc.denyListMcc.join(', ')]);
  if (sc.allowListMcc?.length) rows.push(['Allowed MCC', sc.allowListMcc.join(', ')]);
  if (sc.geographicalLocations?.length) rows.push(['Geo Restrictions', sc.geographicalLocations.join(', ')]);

  if (rows.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>No spending controls configured.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map(([label, value]) => (
        <Field key={label} label={label} value={value} />
      ))}
    </div>
  );
}

export default function CardDetailView({ navigate, navParam }) {
  const card = AppData.cards.find(c => c.id === navParam?.cardId);

  if (!card) {
    return (
      <div className="content-inner fade-in">
        <Breadcrumb navigate={navigate} items={[{ label: 'Cards', route: 'cards' }, { label: 'Card Detail' }]} />
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: 'var(--fta-fill-2)', color: 'var(--fta-text-3)' }}>
            <Icon name="card" size={22} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Card not found</div>
          <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20 }}>The requested card could not be found.</div>
          <button className="btn btn-primary" onClick={() => navigate('cards')}>Back to Cards</button>
        </div>
      </div>
    );
  }

  const snap    = card.inheritedSubprogramSnapshot || {};
  const last4   = card.last4 || (card.binPrefix || '').slice(-4).padStart(4, '0') || '0000';
  const cardVis = getCardDetailVisual(card);

  const statusDot = card.cardStatus === 'Active'  ? '#4ade80'
    : card.cardStatus === 'Frozen' ? '#f97316' : '#9ca3af';

  const expDate = card.expirationDate
    ? (() => { const d = new Date(card.expirationDate); return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`; })()
    : '—';

  const createdDate = card.createdAt
    ? new Date(card.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    : '—';

  const ff = card.formFactors || [];
  const formText = ff.length >= 2 ? 'Physical & Virtual'
    : ff[0] === 'physical' ? 'Physical' : ff[0] === 'virtual' ? 'Virtual' : '—';

  const programName = snap.programName || '—';
  const subName     = snap.name        || '—';

  return (
    <div className="content-inner fade-in">
      <Breadcrumb navigate={navigate} items={[{ label: 'Cards', route: 'cards' }, { label: `Card ···· ${last4}` }]} />

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left panel ── */}
        <div className="card" style={{ padding: 22 }}>

          {/* Card visual */}
          <div style={{
            ...(cardVis.hasArtwork
              ? { backgroundImage: `url(${cardVis.artworkUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: cardVis.background }),
            borderRadius: 14, padding: '16px 18px 14px', color: cardVis.textColor,
            aspectRatio: '1.586 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', overflow: 'hidden', marginBottom: 20,
          }}>
            {cardVis.hasArtwork && (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none', zIndex: 0 }} />
            )}
            <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: '50%', background: cardVis.decoAlpha1, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 28, top: 44, width: 72, height: 72, borderRadius: '50%', background: cardVis.decoAlpha2, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: cardVis.badgeBg, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                {cardVis.isCredit ? 'Credit Card' : 'Debit Card'}
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.85, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {programName}
              </span>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 28, height: 20, borderRadius: 4, background: 'linear-gradient(135deg, #c9a227, #f0c040)', opacity: 0.9 }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 13.5, letterSpacing: '2px', fontWeight: 500 }}>**** **** **** {last4}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 3, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.cardholderSnapshot?.name || '—'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: 8.5, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>Valid Thru</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{expDate}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, justifyContent: 'flex-end' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot }} />
                  <span style={{ fontSize: 9.5, fontWeight: 600, opacity: 0.9 }}>{card.cardStatus}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-.3px', opacity: 0.95 }}>
                  {card.network === 'Visa' ? 'VISA' : card.network === 'Mastercard' ? 'MC' : (card.network || '')}
                </div>
              </div>
            </div>
          </div>

          {/* Cardholder summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--fta-line-2)' }}>
            <ColorAvatar name={card.cardholderSnapshot?.name || '?'} size="sm" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 1 }}>{card.cardholderSnapshot?.name || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--fta-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.cardholderSnapshot?.email || '—'}</div>
            </div>
          </div>

          {/* Status row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>Status</span>
            <StatusPill status={card.cardStatus} />
          </div>

          {/* Network row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: 'var(--fta-text-3)' }}>Network</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
              <NetworkMark network={card.network} />{card.network}
            </span>
          </div>

          {/* Primary action */}
          {card.cardStatus === 'Active' && (
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="shield" size={14} />Freeze Card
            </button>
          )}
          {card.cardStatus === 'Frozen' && (
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="circle" size={14} />Activate Card
            </button>
          )}
          {card.cardStatus === 'Inactive' && (
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} disabled>
              Card Inactive
            </button>
          )}
        </div>

        {/* ── Right detail panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <DetailSection title="Card Information">
            <div className="grid-2">
              <Field label="Card ID" value={card.id} />
              <Field label="Card Name" value={card.cardName || '—'} />
            </div>
            <div className="grid-2">
              <Field label="Masked Card Number" value={card.maskedNumber || `**** **** **** ${last4}`} />
              <Field label="Card Status" valueNode={<StatusPill status={card.cardStatus} />} />
            </div>
            <div className="grid-2">
              <Field label="Card Type" value={card.cardTypeLabel || (card.cardType === 'credit' ? 'Credit Card' : 'Debit Card')} />
              <Field label="Form Factor" value={formText} />
            </div>
            <div className="grid-2">
              <Field label="Network" valueNode={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><NetworkMark network={card.network} />{card.network}</span>} />
              <Field label="BIN Prefix" value={card.binPrefix || '—'} />
            </div>
            <div className="grid-2">
              <Field label="Created Date" value={createdDate} />
              <Field label="Expiration Date" value={card.expirationDate || '—'} />
            </div>
          </DetailSection>

          <DetailSection title="Cardholder Information">
            <div className="grid-2">
              <Field label="Cardholder Name" value={card.cardholderSnapshot?.name  || '—'} />
              <Field label="Email"           value={card.cardholderSnapshot?.email || '—'} />
            </div>
            <div className="grid-2">
              <Field label="Phone" value={card.cardholderSnapshot?.phone || '—'} />
              <Field label="State" value={card.cardholderSnapshot?.state || '—'} />
            </div>
          </DetailSection>

          <DetailSection title="Program / Sub-program Information">
            <div className="grid-2">
              <Field label="Program"     value={programName} />
              <Field label="Sub-program" value={subName} />
            </div>
            <div className="grid-2">
              <Field label="Classification" value={snap.classification || '—'} />
              <Field label="Billing Cycle"  value={snap.billingCycle  || '—'} />
            </div>
            {(snap.creditMin || snap.creditMax) && (
              <div className="grid-2">
                <Field label="Credit Limit (Min)" value={snap.creditMin ? `$${parseInt(snap.creditMin).toLocaleString()}` : '—'} />
                <Field label="Credit Limit (Max)" value={snap.creditMax ? `$${parseInt(snap.creditMax).toLocaleString()}` : '—'} />
              </div>
            )}
            {snap.purchaseApr && (
              <div className="grid-2">
                <Field label="Purchase APR"  value={`${snap.purchaseApr}%`} />
                <Field label="Grace Period"  value={snap.gracePeriod ? `${snap.gracePeriod} days` : '—'} />
              </div>
            )}
          </DetailSection>

          <DetailSection title="Spending Controls">
            <SpendingControlsSummary sc={card.spendingControls} />
          </DetailSection>

          {snap.customerServiceSnapshot && (
            <DetailSection title="Customer Service">
              <div className="grid-2">
                <Field label="Service Name"  value={snap.customerServiceSnapshot.name  || '—'} />
                <Field label="Service Phone" value={snap.customerServiceSnapshot.phone || '—'} />
              </div>
              <div className="grid-2">
                <Field label="Service Email" value={snap.customerServiceSnapshot.email || '—'} />
              </div>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
}
