import React, { useState } from 'react';
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

function getConversionRate(rp) {
  if (Array.isArray(rp?.redemptionMethods)) {
    const sc = rp.redemptionMethods.find(m => m.type === 'statement_credit' && m.enabled);
    if (sc?.conversion) return sc.conversion.amount / sc.conversion.points;
  }
  return rp?.conversionRate ?? 0.01;
}
function getMinPts(rp) {
  if (Array.isArray(rp?.redemptionMethods)) {
    const sc = rp.redemptionMethods.find(m => m.type === 'statement_credit' && m.enabled);
    if (sc?.minimumIncrement) return sc.minimumIncrement;
  }
  return rp?.minimumRedemptionIncrement ?? 500;
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
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

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

  const linkedSub = AppData.subPrograms.find(s => s.id === (card.subprogramId || snap.id));
  const rewardsProgram = snap.rewardsProgram ?? linkedSub?.rewardsProgram ?? null;
  const rewardsEnabled = snap.rewardsEnabled ?? linkedSub?.rewardsEnabled ?? !!rewardsProgram;

  return (
    <div className="content-inner fade-in">
      {(() => {
        if (navParam?.from === 'customer-cardholder-cards') {
          const customerId   = navParam.customerId;
          const customerName = navParam.customerName
            || AppData.customers.find(c => c.id === card.cardholderId)?.name
            || 'Card Holder';
          const backParam = { id: customerId, activeTab: 'cards' };
          return (
            <Breadcrumb navigate={navigate} items={[
              { label: 'Customers',  route: 'customers' },
              { label: customerName, route: 'customer-detail', param: backParam },
              { label: 'Cards',      route: 'customer-detail', param: backParam },
              { label: `Card ···· ${last4}` },
            ]} />
          );
        }
        return (
          <Breadcrumb navigate={navigate} items={[
            { label: 'Cards', route: 'cards' },
            { label: `Card ···· ${last4}` },
          ]} />
        );
      })()}

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

          {/* Rewards Account */}
          {(() => {
            const ra = AppData.rewardAccounts?.find(r => r.cardId === card.id);
            const cfg = AppData.rewardsConfigurations?.find(c => c.subprogramId === card.subprogramId);
            const linkedSubRp = AppData.subPrograms.find(s => s.id === card.subprogramId);
            const rp = cfg || (linkedSubRp?.rewardsProgram?.programName ? linkedSubRp.rewardsProgram : null);

            if (!ra && !rp) {
              return (
                <DetailSection title="Rewards Account">
                  <div style={{ fontSize: 13, color: 'var(--fta-text-3)' }}>No rewards program configured on the parent sub-program.</div>
                </DetailSection>
              );
            }

            const activities = (AppData.rewardActivities || [])
              .filter(a => a.rewardAccountId === ra?.id)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5);

            const minPts = getMinPts(rp);

            return (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: '#1D2129' }}>Rewards Account</h3>

                {/* Program name + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 2 }}>Program</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{rp?.programName || '—'}</div>
                  </div>
                  {ra?.status && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10,
                      background: ra.status === 'active' ? '#c6f6d5' : 'var(--fta-fill-3)',
                      color: ra.status === 'active' ? '#276749' : 'var(--fta-text-3)',
                    }}>
                      {ra.status.charAt(0).toUpperCase() + ra.status.slice(1)}
                    </span>
                  )}
                </div>

                {ra && (
                  <>
                    {/* Balance grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div style={{ padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 4 }}>Total Points</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{ra.totalPoints.toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginTop: 2 }}>posted balance</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 4 }}>Est. Credit Value</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>${ra.estimatedCreditValue.toFixed(2)}</div>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginTop: 2 }}>@ ${getConversionRate(rp).toFixed(2)} / pt</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 4 }}>Pending</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{ra.pendingPoints.toLocaleString()} pts</div>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginTop: 2 }}>awaiting settlement</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginBottom: 4 }}>Cycle Earned</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{ra.cycleEarnedPoints.toLocaleString()} pts</div>
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', marginTop: 2 }}>current cycle</div>
                      </div>
                    </div>

                    {/* Billing cycle */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12 }}>
                      <span><span style={{ color: 'var(--fta-text-3)' }}>Cycle: </span><span style={{ fontWeight: 500 }}>{ra.billingCycleOpen}</span><span style={{ color: 'var(--fta-text-3)' }}> – </span><span style={{ fontWeight: 500 }}>{ra.billingCycleClose}</span></span>
                    </div>

                    {/* Recent activity */}
                    {activities.length > 0 && (
                      <>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '0 0 14px' }} />
                        <div style={{ fontSize: 11, color: 'var(--fta-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Recent Activity</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                          {activities.map(act => {
                            const isRedeemed = act.type === 'redeemed';
                            const isAdjusted = act.type === 'adjusted';
                            const ptsStr = (act.points > 0 ? '+' : '') + act.points.toLocaleString() + ' pts';
                            const ptColor = isRedeemed ? '#ef4444' : isAdjusted ? '#f97316' : '#16a34a';
                            const iconBg   = isRedeemed ? '#fef2f2' : isAdjusted ? '#fff7ed' : '#f0fdf4';
                            const iconChar = isRedeemed ? '↩' : isAdjusted ? '⚡' : '★';
                            return (
                              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12 }}>
                                  {iconChar}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{act.description}</span>
                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: ptColor, marginLeft: 8, flexShrink: 0 }}>{ptsStr}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>{act.date}</span>
                                    <span style={{ fontSize: 11, color: 'var(--fta-text-3)' }}>{act.ruleName}</span>
                                    <span style={{
                                      fontSize: 10, padding: '1px 6px', borderRadius: 6, fontWeight: 600,
                                      background: act.status === 'pending' ? '#fff7ed' : 'var(--fta-fill-3)',
                                      color: act.status === 'pending' ? '#c05621' : 'var(--fta-text-3)',
                                    }}>{act.status}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Redemption */}
                    <hr style={{ border: 'none', borderTop: '1px solid var(--fta-line-3)', margin: '0 0 14px' }} />
                    <div style={{ fontSize: 11, color: 'var(--fta-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Redemption</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Statement Credit */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--fta-fill-2)', borderRadius: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>Statement Credit</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>
                            {ra.totalPoints >= minPts
                              ? `${ra.totalPoints.toLocaleString()} pts ≈ $${ra.estimatedCreditValue.toFixed(2)}`
                              : `Minimum ${minPts.toLocaleString()} pts required`}
                          </div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={ra.totalPoints < minPts}
                          onClick={() => setShowRedeemModal(true)}
                        >
                          Redeem
                        </button>
                      </div>
                      {/* External — coming soon */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--fta-fill-2)', borderRadius: 8, opacity: 0.55 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fta-text-3)' }}>External Redemption</div>
                          <div style={{ fontSize: 11.5, color: 'var(--fta-text-3)', marginTop: 2 }}>Transfer to bank or partner accounts</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: 'var(--fta-fill-3)', color: 'var(--fta-text-3)' }}>Coming soon</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

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

      {/* Redemption confirmation modal */}
      {showRedeemModal && (() => {
        const ra = AppData.rewardAccounts?.find(r => r.cardId === card.id);
        const cfg = AppData.rewardsConfigurations?.find(c => c.subprogramId === card.subprogramId);
        const linkedSubRp2 = AppData.subPrograms.find(s => s.id === card.subprogramId);
        const rp2 = cfg || (linkedSubRp2?.rewardsProgram?.programName ? linkedSubRp2.rewardsProgram : null);
        const rate = getConversionRate(rp2);
        const creditVal = ra ? (ra.totalPoints * rate).toFixed(2) : '0.00';

        function handleConfirmRedeem() {
          if (!ra) return;
          const pts = ra.totalPoints;
          AppData.redemptions.push({
            id: 'RDMP-' + String(AppData.redemptions.length + 2).padStart(3, '0'),
            rewardAccountId: ra.id,
            cardholderId: card.cardholderId,
            type: 'statement_credit',
            pointsRedeemed: pts,
            creditValue: parseFloat(creditVal),
            requestedAt: new Date().toISOString(),
            appliedAt: null,
            status: 'pending',
          });
          AppData.rewardActivities.push({
            id: 'RACT-' + String(AppData.rewardActivities.length + 1).padStart(3, '0'),
            rewardAccountId: ra.id,
            type: 'redeemed',
            ruleId: null,
            ruleName: 'Statement Credit Redemption',
            points: -pts,
            status: 'pending',
            date: new Date().toISOString().slice(0, 10),
            description: 'Statement credit redemption',
            transactionAmount: null,
          });
          ra.totalPoints = 0;
          ra.estimatedCreditValue = 0;
          setShowRedeemModal(false);
          setRedeemSuccess(true);
          setTimeout(() => setRedeemSuccess(false), 4000);
        }

        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 28, maxWidth: 440, width: '90%', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#1D2129' }}>Confirm Redemption</div>
              <div style={{ fontSize: 13, color: 'var(--fta-text-3)', marginBottom: 20, lineHeight: 1.65 }}>
                You are about to redeem <strong style={{ color: '#1D2129' }}>{ra?.totalPoints.toLocaleString()} points</strong> for a statement credit of <strong style={{ color: '#1D2129' }}>${creditVal}</strong>.
              </div>
              <div style={{ padding: '12px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12.5, color: '#92400e', marginBottom: 20, lineHeight: 1.55 }}>
                This redemption will be applied as a statement credit and cannot be undone.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setShowRedeemModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleConfirmRedeem}>Confirm Redemption</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Success toast */}
      {redeemSuccess && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: '#fff', border: '1px solid #c6f6d5', borderRadius: 12, padding: '14px 20px 14px 16px', boxShadow: '0 8px 32px rgba(0,0,0,.14)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 300 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c6f6d5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e' }}>Redemption submitted</div>
            <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>Statement credit will appear in the next billing cycle.</div>
          </div>
        </div>
      )}
    </div>
  );
}
