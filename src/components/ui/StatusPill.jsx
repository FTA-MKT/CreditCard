import React from 'react';

const TONE_MAP = {
  'Active':'success', 'Case Won':'success', 'Posted':'success', 'Verified':'success', 'Published':'success',
  'Inactive':'inactive', 'Case Closed':'inactive', 'Closed':'inactive',
  'Under Review':'warning', 'Arbitration':'warning', 'Prearbitration':'warning', 'Frozen':'warning', 'Processing':'warning', 'Held':'warning', 'Unverified':'warning',
  'Pending Customer':'info', 'Submitted':'info', 'Representment':'info', 'Pending':'info', 'Scheduled':'info', 'Regenerated':'info',
  'Declined':'danger', 'Disputed':'danger', 'Failed':'danger', 'At-Risk':'danger',
};

export function StatusPill({ status }) {
  const tone = TONE_MAP[status] || 'inactive';
  return (
    <span className={`pill-status --${tone}`}>
      <span className="dot" />
      {status}
    </span>
  );
}
