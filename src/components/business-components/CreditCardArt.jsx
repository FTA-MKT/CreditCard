import React from 'react';

const CARD_THEMES = {
  'Neo Bank':       'linear-gradient(138deg, #0c1640 0%, #1a2d6e 50%, #0f4d6b 100%)',
  'Allegra Travel': 'linear-gradient(138deg, #0a2540 0%, #1a4a6e 50%, #0e3d5c 100%)',
  'SMB Cashback':   'linear-gradient(138deg, #1a0c40 0%, #2d1a6e 50%, #4d0f6b 100%)',
};

export function CreditCardArt({ card }) {
  const bg = CARD_THEMES[card.brand] || CARD_THEMES['Neo Bank'];
  return (
    <div className="credit-card" style={{ background: bg }}>
      <div className="cc-decor" />
      <div className="cc-decor-2" />
      <div className="credit-card-top">
        <span className={"credit-card-pill" + (card.type === 'Virtual' ? ' --virtual' : '')}>{card.type}</span>
        <span className="credit-card-brand">{card.brand}</span>
      </div>
      <div className="credit-card-middle">
        <div className="cc-chip" />
        <div className="credit-card-number">
          ****  ****  ****  <span style={{ opacity: 1 }}>{card.last4}</span>
        </div>
      </div>
      <div className="credit-card-bot">
        <div>
          <div className="val">{card.holder}</div>
          <div className="lbl">Card Holder</div>
        </div>
        <div>
          <div className="val">{card.exp}</div>
          <div className="lbl">Expires</div>
        </div>
        <div className="credit-card-network">
          {card.network === 'Visa' ? 'VISA' : 'MC'}
          <span className="vstate">{card.status === 'Active' ? 'Active' : card.status}</span>
        </div>
      </div>
    </div>
  );
}

export function buildCardsForCustomer(c) {
  const baseSeed = parseInt(c.id.replace(/\D/g, '')) || 1;
  const types = ['Physical', 'Virtual', 'Virtual', 'Virtual'];
  const nets  = ['Visa', 'Visa', 'Mastercard'];
  const last4s = ['4142', '8211', '6190', '3022', '7711', '0048', '1955', '6624'];
  const count = Math.max(1, c.cards || 1);
  return Array.from({ length: count }).map((_, i) => ({
    id: c.id + '-' + i,
    brand: i === 0 ? 'Neo Bank' : ['Neo Bank', 'Allegra Travel', 'SMB Cashback'][(i + baseSeed) % 3],
    last4: last4s[(i + baseSeed) % last4s.length],
    exp: '06/25',
    type: types[(i + baseSeed) % types.length],
    network: nets[(i + baseSeed) % nets.length],
    holder: c.name,
    status: c.status === 'Active' ? 'Active' : c.status,
  }));
}
