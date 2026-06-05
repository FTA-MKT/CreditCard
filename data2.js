// data2.js — Extends AppData with PRD-grounded data for Autopay (Flow 4),
// Statements & Billing (Flow 6), and Spend Controls (Flow 7).

(() => {
  const D = window.AppData;

  // ── Autopay (Flow 4) ────────────────────────────────────────
  D.autopay = {
    policy: {
      modes: [
        { id: 'min', label: 'Minimum Payment Due', enabled: true, locked: true, note: 'Safety floor — always enabled, cannot be disabled' },
        { id: 'stmt', label: 'Statement Balance', enabled: true, locked: false, note: 'Pays the full statement balance each cycle' },
        { id: 'fixed', label: 'Fixed Amount', enabled: false, locked: false, note: 'Cardholder sets a fixed dollar amount, capped at balance' },
      ],
      timing: 'due', // 'due' | 'before'
      offsetDays: 3,
      cutoff: '11:59 PM',
      timezone: 'America/New_York (ET)',
      nonBusinessDay: 'Shift to next business day',
      retry: 'No automatic retries (immutable)',
      reminder: true,
      reminderDays: 3,
      channels: { email: true, sms: true, push: false },
    },
    enrollment: {
      totalEnrolled: 6841,
      totalAccounts: 8421,
      modeDist: [
        { mode: 'Minimum Payment Due', count: 2189, pct: 32, color: 'var(--fta-chart-9)' },
        { mode: 'Statement Balance', count: 3762, pct: 55, color: 'var(--fta-chart-1)' },
        { mode: 'Fixed Amount', count: 890, pct: 13, color: 'var(--fta-chart-2)' },
      ],
      fundingHealth: [
        { label: 'Verified', count: 6402, pct: 93.6, tone: 'success' },
        { label: 'Unverified', count: 287, pct: 4.2, tone: 'warning' },
        { label: 'At-Risk', count: 152, pct: 2.2, tone: 'danger' },
      ],
      accounts: [
        { acct: 'C-100001', name: 'Brian Willian Jensen', mode: 'Statement Balance', fixed: '—', funding: 'Chase ••4021', verify: 'Verified', next: '06/14/2026', projected: 2184.55, last: 'Posted', days: 412 },
        { acct: 'C-100002', name: 'Annette Black', mode: 'Minimum Payment Due', fixed: '—', funding: 'BofA ••8830', verify: 'Verified', next: '06/12/2026', projected: 35.00, last: 'Posted', days: 108 },
        { acct: 'C-100005', name: 'Cameron Williamson', mode: 'Fixed Amount', fixed: '$ 500.00', funding: 'Wells Fargo ••1190', verify: 'Unverified', next: '06/18/2026', projected: 500.00, last: 'Failed', days: 122 },
        { acct: 'C-100006', name: 'Kathryn Murphy', mode: 'Statement Balance', fixed: '—', funding: 'Citi ••2245', verify: 'Verified', next: '06/15/2026', projected: 1043.18, last: 'Posted', days: 96 },
        { acct: 'C-100008', name: 'Darrell Steward', mode: 'Statement Balance', fixed: '—', funding: 'US Bank ••7711', verify: 'At-Risk', next: '06/20/2026', projected: 612.40, last: 'Scheduled', days: 146 },
        { acct: 'C-100009', name: 'Floyd Miles', mode: 'Minimum Payment Due', fixed: '—', funding: 'PNC ••0048', verify: 'Verified', next: '06/11/2026', projected: 35.00, last: 'Posted', days: 230 },
      ],
    },
    monitoring: {
      today: { scheduled: 1284, processing: 38, posted: 1192, failed: 54 },
      failBreakdown: [
        { reason: 'Insufficient funds', count: 31, code: 'NSF' },
        { reason: 'ACH return', count: 12, code: 'R01–R29' },
        { reason: 'Invalid funding source', count: 8, code: 'INVALID_SRC' },
        { reason: 'Processing error', count: 3, code: 'PROC_ERR' },
      ],
      runs: [
        { acct: 'C-100002', name: 'Annette Black', amount: 35.00, funding: 'BofA ••8830', status: 'Posted', sched: '08:00', done: '08:01' },
        { acct: 'C-100005', name: 'Cameron Williamson', amount: 500.00, funding: 'Wells Fargo ••1190', status: 'Failed', sched: '08:00', done: '08:02', reason: 'Insufficient funds' },
        { acct: 'C-100006', name: 'Kathryn Murphy', amount: 1043.18, funding: 'Citi ••2245', status: 'Posted', sched: '08:00', done: '08:01' },
        { acct: 'C-100001', name: 'Brian Willian Jensen', amount: 2184.55, funding: 'Chase ••4021', status: 'Processing', sched: '08:00', done: '—' },
        { acct: 'C-100008', name: 'Darrell Steward', amount: 612.40, funding: 'US Bank ••7711', status: 'Failed', sched: '08:00', done: '08:03', reason: 'ACH return' },
        { acct: 'C-100009', name: 'Floyd Miles', amount: 35.00, funding: 'PNC ••0048', status: 'Posted', sched: '08:00', done: '08:01' },
        { acct: 'C-100003', name: 'Marvin McKinney', amount: 218.90, funding: 'TD ••3320', status: 'Scheduled', sched: '14:00', done: '—' },
      ],
      alerts: [
        { kind: 'danger', title: 'Failure rate above threshold', body: 'Today\u2019s failure rate is 4.2% — issuer threshold is 3.0%. Review NSF cluster on Wells Fargo funding sources.' },
        { kind: 'warning', title: 'ACH return anomaly', body: '12 ACH returns in the last hour vs. a 7-day average of 4. Monitoring for processor issue.' },
        { kind: 'info', title: 'Funding verification expiring', body: '287 funding sources have verification expiring within 14 days.' },
      ],
    },
  };

  // ── Statements & Billing (Flow 6) ───────────────────────────
  D.billing = {
    summary: {
      outstanding: '$ 41,208,663.20',
      billedThisCycle: '$ 8,442,019.55',
      paymentsReceived: '$ 7,918,440.12',
      failedRate: '1.8%',
      lateRate: '3.4%',
      interestRevCycle: '$ 612,884.40',
      interestRevYtd: '$ 3,401,229.18',
      feeRevenue: [
        { type: 'Annual', cycle: 184200, ytd: 1842000 },
        { type: 'Late', cycle: 88640, ytd: 512300 },
        { type: 'Foreign Tx', cycle: 42180, ytd: 248900 },
        { type: 'Cash Advance', cycle: 31290, ytd: 182400 },
        { type: 'Returned Pmt', cycle: 12840, ytd: 74200 },
      ],
      aging: [
        { bucket: '1–29 days', count: 412, amount: 284100, tone: 'info' },
        { bucket: '30–59 days', count: 138, amount: 142800, tone: 'warning' },
        { bucket: '60–89 days', count: 47, amount: 88200, tone: 'warning' },
        { bucket: '90+ days', count: 19, amount: 61400, tone: 'danger' },
      ],
    },
    statements: [
      { id: 'ST-2026-05-100001', acct: 'C-100001', name: 'Brian Willian Jensen', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 2184.55, minDue: 65.00, status: 'Published', flag: null },
      { id: 'ST-2026-05-100002', acct: 'C-100002', name: 'Annette Black', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 412.18, minDue: 35.00, status: 'Published', flag: null },
      { id: 'ST-2026-05-100004', acct: 'C-100004', name: 'Dianne Russell', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 2914002.55, minDue: 0, status: 'Held', flag: 'Outlier balance — exceeds sanity range' },
      { id: 'ST-2026-05-100005', acct: 'C-100005', name: 'Cameron Williamson', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 1782.01, minDue: 53.00, status: 'Regenerated', flag: null },
      { id: 'ST-2026-05-100006', acct: 'C-100006', name: 'Kathryn Murphy', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 1043.18, minDue: 35.00, status: 'Published', flag: null },
      { id: 'ST-2026-05-100007', acct: 'C-100007', name: 'Esther Howard', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 0, minDue: 0, status: 'Held', flag: 'Missing APR disclosure field' },
      { id: 'ST-2026-05-100008', acct: 'C-100008', name: 'Darrell Steward', cycle: 'May 2026', close: '05/24/2026', due: '06/14/2026', balance: 612.40, minDue: 35.00, status: 'Generated', flag: null },
      { id: 'ST-2026-04-100001', acct: 'C-100001', name: 'Brian Willian Jensen', cycle: 'Apr 2026', close: '04/24/2026', due: '05/15/2026', balance: 1944.12, minDue: 58.00, status: 'Published', flag: null },
    ],
    payments: [
      { id: 'PMT-88401', acct: 'C-100001', name: 'Brian Willian Jensen', source: 'Autopay', amount: 1944.12, funding: 'Chase ••4021', status: 'Posted', applied: 'Purchases', date: '05/14/2026 08:01', fail: null },
      { id: 'PMT-88402', acct: 'C-100002', name: 'Annette Black', source: 'Manual', amount: 200.00, funding: 'BofA ••8830', status: 'Posted', applied: 'Highest-APR first', date: '05/12/2026 19:44', fail: null },
      { id: 'PMT-88403', acct: 'C-100005', name: 'Cameron Williamson', source: 'Autopay', amount: 500.00, funding: 'Wells Fargo ••1190', status: 'Failed', applied: '—', date: '05/18/2026 08:02', fail: 'NSF — insufficient funds' },
      { id: 'PMT-88404', acct: 'C-100006', name: 'Kathryn Murphy', source: 'Manual', amount: 1043.18, funding: 'Citi ••2245', status: 'Posted', applied: 'Statement balance', date: '05/10/2026 12:08', fail: null },
      { id: 'PMT-88405', acct: 'C-100008', name: 'Darrell Steward', source: 'Autopay', amount: 612.40, funding: 'US Bank ••7711', status: 'Failed', applied: '—', date: '05/20/2026 08:03', fail: 'ACH return R01' },
      { id: 'PMT-88406', acct: 'C-100009', name: 'Floyd Miles', source: 'Manual', amount: 35.00, funding: 'PNC ••0048', status: 'Pending', applied: '—', date: '05/28/2026 09:15', fail: null },
      { id: 'PMT-88407', acct: 'C-100004', name: 'Dianne Russell', source: 'Manual', amount: 1275.43, funding: 'KeyBank ••6512', status: 'Reversed', applied: 'Reversed (ACH return)', date: '05/06/2026 16:22', fail: 'ACH return R02 after settlement' },
    ],
    // a single example statement detail
    sampleStatement: {
      id: 'ST-2026-05-100001', acct: 'C-100001', name: 'Brian Willian Jensen', cycle: 'May 2026',
      open: '04/25/2026', close: '05/24/2026', due: '06/14/2026', daysInCycle: 30,
      openingBalance: 1944.12, payments: 1944.12, purchases: 2102.43, fees: 0, interest: 82.12, closingBalance: 2184.55,
      minDue: 65.00, statementBalance: 2184.55,
      apr: { purchase: '24.49%', cashAdvance: '29.99%', balanceTransfer: '0.00% intro', type: 'Variable · Prime + 16.99%' },
      minWarning: { years: 8, months: 4, totalInterest: 2841.18, threeYearPmt: 78.00 },
      transactions: [
        { date: '05/02', merchant: 'Amazon Mktp', cat: 'Online Retail', amount: 84.32 },
        { date: '05/06', merchant: 'Delta Airlines', cat: 'Travel', amount: 612.55 },
        { date: '05/11', merchant: 'Whole Foods', cat: 'Groceries', amount: 142.18 },
        { date: '05/15', merchant: 'Shell Oil', cat: 'Fuel', amount: 58.40 },
        { date: '05/19', merchant: 'Apple Store', cat: 'Electronics', amount: 1204.98 },
      ],
      fees: [],
      interestLines: [
        { sub: 'Purchases', adb: 2018.44, apr: '24.49%', charge: 82.12 },
        { sub: 'Cash Advances', adb: 0, apr: '29.99%', charge: 0 },
      ],
      rewards: { earned: 4280, redeemed: 0, balance: 38240, type: 'points' },
    },
  };

  // ── Spend Controls (Flow 7) ─────────────────────────────────
  D.spend = {
    rules: [
      { id: 'SR-2001', scope: 'Program', type: 'Geo', name: 'OFAC sanctioned countries', detail: 'Deny: CU, IR, KP, SY, RU-Crimea', status: 'Active', compliance: true, effective: '01/01/2026', impact: 8421 },
      { id: 'SR-2002', scope: 'Program', type: 'MCC', name: 'High-risk MCC deny list', detail: 'Deny group: Gambling, Crypto, Adult', status: 'Active', compliance: false, effective: '01/01/2026', impact: 8421 },
      { id: 'SR-2003', scope: 'Program', type: 'Cash Advance', name: 'Cash advance disabled', detail: 'Cash advance off program-wide', status: 'Active', compliance: false, effective: '01/01/2026', impact: 8421 },
      { id: 'SR-2004', scope: 'Account', type: 'Limit', name: 'Corporate monthly ceiling', detail: '$ 25,000.00 / month', status: 'Active', compliance: false, effective: '03/14/2026', impact: 12 },
      { id: 'SR-2005', scope: 'Card', type: 'Limit', name: 'Dining category cap', detail: '$ 500.00 / month on Dining group', status: 'Active', compliance: false, effective: '04/02/2026', impact: 1 },
      { id: 'SR-2006', scope: 'Program', type: 'Velocity', name: 'Auto-freeze on decline burst', detail: 'Freeze after 5 declines / hour', status: 'Active', compliance: false, effective: '02/10/2026', impact: 8421 },
      { id: 'SR-2007', scope: 'Account', type: 'MCC', name: 'Travel-only whitelist', detail: 'Allow only: Travel group', status: 'Draft', compliance: false, effective: '06/15/2026', impact: 4 },
    ],
    mccGroups: [
      { name: 'Gambling', count: 6, codes: '7800, 7801, 7802, 7995, 9406, 7994', risk: 'high' },
      { name: 'Crypto', count: 3, codes: '6051, 6012, 4829', risk: 'high' },
      { name: 'Adult Entertainment', count: 4, codes: '5967, 7841, 7273, 5912', risk: 'high' },
      { name: 'Travel', count: 9, codes: '3000–3299, 4511, 4722, 7011, 7512', risk: 'low' },
      { name: 'Dining', count: 5, codes: '5811, 5812, 5813, 5814, 5462', risk: 'low' },
      { name: 'Fuel', count: 3, codes: '5541, 5542, 5983', risk: 'low' },
      { name: 'Groceries', count: 2, codes: '5411, 5422', risk: 'low' },
    ],
    declineVocab: [
      { code: 'MCC_BLOCKED', label: 'Merchant category not permitted' },
      { code: 'VELOCITY_DAILY_LIMIT', label: 'Too many transactions today' },
      { code: 'GEO_RESTRICTED', label: 'Transaction outside permitted region' },
      { code: 'LIMIT_EXCEEDED_MONTHLY', label: 'Monthly spend limit exceeded' },
      { code: 'CASH_ADVANCE_DISABLED', label: 'Cash advance not enabled on this card' },
      { code: 'FRAUD_SCORE_THRESHOLD', label: 'Flagged by fraud system' },
      { code: 'CARD_FROZEN', label: 'Card is currently frozen' },
    ],
  };

  // ── Fraud alerts (Flow 5) ───────────────────────────────────
  D.fraud = [
    { id: 'FA-5512', name: 'Kathryn Murphy', card: '7555', merchant: 'Unknown Merchant 8841', amount: 98743.65, score: 0.97, reason: 'Anomalous amount + new geo', time: '03/12/2026 02:14', status: 'Open' },
    { id: 'FA-5511', name: 'Darrell Steward', card: '1019', merchant: 'QuickCash ATM (RU)', amount: 1000.00, score: 0.92, reason: 'Geo + cash advance pattern', time: '03/12/2026 01:48', status: 'Open' },
    { id: 'FA-5510', name: 'Floyd Miles', card: '2031', merchant: 'Steam Games', amount: 249.99, score: 0.71, reason: 'Velocity burst (6 in 10 min)', time: '03/11/2026 23:02', status: 'Open' },
    { id: 'FA-5509', name: 'Annette Black', card: '4142', merchant: 'Amazon Mktp', amount: 61.13, score: 0.55, reason: 'Card-not-present + device change', time: '03/11/2026 19:30', status: 'Dismissed' },
    { id: 'FA-5508', name: 'Cameron Williamson', card: '1844', merchant: 'BestBuy.com', amount: 1782.01, score: 0.83, reason: 'High amount + new merchant', time: '03/11/2026 14:22', status: 'Confirmed' },
  ];
})();
