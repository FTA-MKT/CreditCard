// data.js — Plausible bank card-program demo data
// Loaded as a regular script; exports to window.AppData

const AppData = (() => {
  const ts = (s) => s; // helper

  // KPIs (Dashboard)
  const kpis = [
    { id: 'settled', label: 'Settled Authorization', value: '$ 52,813,685.64', unit: 'USD', delta: '+836.24', dir: 'up', icon: 'shield', tone: 'green', help: true },
    { id: 'tx', label: 'Transaction Count', value: '127,051,901', delta: '-136', dir: 'down', icon: 'receipt', tone: 'blue' },
    { id: 'avg', label: 'Average Transaction', value: '$ 27.42', unit: 'USD', delta: '+0.48', dir: 'up', icon: 'chart', tone: 'navy' },
    { id: 'disp', label: 'Dispute Count', value: '25,678', delta: '+36', dir: 'up', icon: 'message', tone: 'peach' },
  ];

  // Dashboard chart: dispute count vs settled auth count (12 months)
  const monthly = [
    { m: 'Jan', settled: 138, dispute: 120 },
    { m: 'Feb', settled: 142, dispute: 134 },
    { m: 'Mar', settled: 148, dispute: 138 },
    { m: 'Apr', settled: 162, dispute: 142 },
    { m: 'May', settled: 130, dispute: 118 },
    { m: 'Jun', settled: 142, dispute: 122 },
    { m: 'Jul', settled: 146, dispute: 132 },
    { m: 'Aug', settled: 118, dispute: 108 },
    { m: 'Sep', settled: 222, dispute: 196 },
    { m: 'Oct', settled: 140, dispute: 122 },
    { m: 'Nov', settled: 84,  dispute: 72 },
    { m: 'Dec', settled: 70,  dispute: 64 },
  ];

  // Settled auth amount by day
  const weekly = [
    { d: 'Mon.', v: 712.69 },
    { d: 'Tues.', v: 382.12 },
    { d: 'Wed.', v: 426.23 },
    { d: 'Thur.', v: 426.23 },
    { d: 'Fri.', v: 812.55 },
    { d: 'Sat.', v: 411.32 },
    { d: 'Sun.', v: 612.23 },
  ];

  // Top categories (donut)
  const categories = [
    { name: 'Loan',          value: 199015.64, pct: 40.1, color: 'var(--fta-chart-9)' },
    { name: 'Mortgage',      value: 8450.60,   pct: 18.2, color: 'var(--fta-chart-2)' },
    { name: 'Dining',        value: 972.27,    pct: 12.0, color: 'var(--fta-chart-4)' },
    { name: 'Health',        value: 458.36,    pct: 9.0,  color: 'var(--fta-chart-3)' },
    { name: 'Personal Care', value: 203.37,    pct: 6.1,  color: 'var(--fta-chart-8)' },
    { name: 'Entertainment', value: 199.90,    pct: 6.0,  color: 'var(--fta-chart-1)' },
    { name: 'Donations',     value: 51.00,     pct: 1.6,  color: 'var(--fta-chart-5)' },
    { name: 'Other',         value: 31.00,     pct: 7.0,  color: 'var(--fta-chart-10)' },
  ];

  // Recent disputes (Dashboard panel)
  const recentDisputes = [
    { holder: 'Annette Black',      card: '4142', status: 'Case Won',         amount: 61.13,    tone: 'success'  },
    { holder: 'Marvin McKinney',    card: '7911', status: 'Case Closed',      amount: 1275.43,  tone: 'inactive' },
    { holder: 'Dianne Russell',     card: '6512', status: 'Arbitration',      amount: 0.68,     tone: 'warning'  },
    { holder: 'Cameron Williamson', card: '1844', status: 'Pending Customer', amount: 1782.01,  tone: 'info'     },
    { holder: 'Kathryn Murphy',     card: '7555', status: 'Submitted',        amount: 98743.65, tone: 'info'     },
    { holder: 'Esther Howard',      card: '6222', status: 'Prearbitration',   amount: 778.35,   tone: 'warning'  },
    { holder: 'Darrell Steward',    card: '1019', status: 'Representment',    amount: 446.61,   tone: 'info'     },
  ];

  // Programs
  const programs = [
    { id: 'P-001', name: 'Neo Banking Rewards',   contact: 'Brian Willian Jensen', manager: 'Brian Cooper',   subs: 12, cards: 8421, status: 'Active',       updated: '03/12/2024' },
    { id: 'P-002', name: 'SMB Cash Back Visa',    contact: 'Jenny Wilson',         manager: 'Wade Warren',    subs: 7,  cards: 3210, status: 'Active',       updated: '03/11/2024' },
    { id: 'P-003', name: 'Allegra Travel Mastercard', contact: 'Robert Fox',       manager: 'Brian Cooper',   subs: 4,  cards: 1284, status: 'Under Review', updated: '03/10/2024' },
    { id: 'P-004', name: 'Pacific Credit Union Debit', contact: 'Cody Fisher',     manager: 'Marvin McKinney',subs: 9,  cards: 6711, status: 'Active',       updated: '03/09/2024' },
    { id: 'P-005', name: 'Helios Corporate Card', contact: 'Esther Howard',       manager: 'Cameron Williamson',subs: 3,cards: 422,  status: 'Inactive',     updated: '02/28/2024' },
    { id: 'P-006', name: 'Northstar Student Visa', contact: 'Floyd Miles',        manager: 'Wade Warren',    subs: 2,  cards: 920,  status: 'Active',       updated: '02/22/2024' },
  ];

  // Sub-programs for a single program
  const subPrograms = [
    { id: 'SP-1001', name: 'Neo Bank Premium',    bin: '948803', network: 'Visa',       type: 'Physical', status: 'Active',       cards: 1842 },
    { id: 'SP-1002', name: 'Neo Bank Standard',   bin: '948811', network: 'Visa',       type: 'Physical', status: 'Active',       cards: 4218 },
    { id: 'SP-1003', name: 'Neo Bank Virtual',    bin: '948820', network: 'Mastercard', type: 'Virtual',  status: 'Active',       cards: 1240 },
    { id: 'SP-1004', name: 'Neo Travel',          bin: '948834', network: 'Visa',       type: 'Physical', status: 'Under Review', cards: 712 },
    { id: 'SP-1005', name: 'Neo Youth',           bin: '948842', network: 'Mastercard', type: 'Virtual',  status: 'Inactive',     cards: 409 },
  ];

  // Customers
  const customers = [
    { id: 'C-100001', name: 'Brian Willian Jensen', email: 'bwjcompanyname@xxx.com', phone: '801-722-8299',  status: 'Active',   created: '11/08/2023', cards: 6, state: 'NY' },
    { id: 'C-100002', name: 'Annette Black',       email: 'a.black@xxx.com',         phone: '406-555-0120',  status: 'Active',   created: '02/14/2024', cards: 2, state: 'TX' },
    { id: 'C-100003', name: 'Marvin McKinney',     email: 'm.mckinney@xxx.com',      phone: '210-555-0144',  status: 'Active',   created: '03/01/2024', cards: 1, state: 'CA' },
    { id: 'C-100004', name: 'Dianne Russell',      email: 'd.russell@xxx.com',       phone: '512-555-0145',  status: 'Frozen',   created: '12/19/2023', cards: 3, state: 'FL' },
    { id: 'C-100005', name: 'Cameron Williamson',  email: 'c.williamson@xxx.com',    phone: '619-555-0163',  status: 'Active',   created: '01/30/2024', cards: 4, state: 'WA' },
    { id: 'C-100006', name: 'Kathryn Murphy',      email: 'k.murphy@xxx.com',        phone: '714-555-0190',  status: 'Active',   created: '02/22/2024', cards: 2, state: 'NJ' },
    { id: 'C-100007', name: 'Esther Howard',       email: 'e.howard@xxx.com',        phone: '305-555-0177',  status: 'Pending',  created: '03/02/2024', cards: 0, state: 'NV' },
    { id: 'C-100008', name: 'Darrell Steward',     email: 'd.steward@xxx.com',       phone: '702-555-0181',  status: 'Active',   created: '01/06/2024', cards: 5, state: 'AZ' },
    { id: 'C-100009', name: 'Floyd Miles',         email: 'f.miles@xxx.com',         phone: '503-555-0193',  status: 'Active',   created: '10/14/2023', cards: 1, state: 'OR' },
    { id: 'C-100010', name: 'Jenny Wilson',        email: 'j.wilson@xxx.com',        phone: '208-555-0118',  status: 'Closed',   created: '06/20/2023', cards: 0, state: 'ID' },
  ];

  // Disputes
  const disputes = [
    { id: 'DP-30441', case: '5301-2024-30441', holder: 'Annette Black',       card: '4142', reason: 'Fraudulent Transaction', amount: 61.13,   filed: '04/28/2024', status: 'Case Won',         tone: 'success', step: 5, network: 'Visa',       merchant: 'Amazon Mktp' },
    { id: 'DP-30440', case: '5301-2024-30440', holder: 'Marvin McKinney',     card: '7911', reason: 'Duplicate Charge',       amount: 1275.43, filed: '04/27/2024', status: 'Case Closed',      tone: 'inactive', step: 5, network: 'Visa',       merchant: 'Walmart Supercenter' },
    { id: 'DP-30439', case: '5301-2024-30439', holder: 'Dianne Russell',      card: '6512', reason: 'ATM Cash Misdispense',   amount: 1000.00, filed: '04/27/2024', status: 'Arbitration',      tone: 'warning', step: 4, network: 'Mastercard', merchant: 'Wells Fargo ATM' },
    { id: 'DP-30438', case: '5301-2024-30438', holder: 'Cameron Williamson',  card: '1844', reason: 'Service Not Provided',   amount: 1782.01, filed: '04/26/2024', status: 'Pending Customer', tone: 'info', step: 1, network: 'Visa',       merchant: 'DEF Logistics' },
    { id: 'DP-30437', case: '5301-2024-30437', holder: 'Kathryn Murphy',      card: '7555', reason: 'Goods Not Received',     amount: 98743.65,filed: '04/25/2024', status: 'Submitted',        tone: 'info', step: 2, network: 'Mastercard', merchant: 'Industrial Supply Co.' },
    { id: 'DP-30436', case: '5301-2024-30436', holder: 'Esther Howard',       card: '6222', reason: 'Defective Merchandise',  amount: 778.35,  filed: '04/24/2024', status: 'Prearbitration',   tone: 'warning', step: 4, network: 'Visa',       merchant: 'BestBuy' },
    { id: 'DP-30435', case: '5301-2024-30435', holder: 'Darrell Steward',     card: '1019', reason: 'Authorization Mismatch', amount: 446.61,  filed: '04/23/2024', status: 'Representment',    tone: 'info', step: 3, network: 'Visa',       merchant: 'Delta Airlines' },
    { id: 'DP-30434', case: '5301-2024-30434', holder: 'Brian Willian Jensen',card: '4082', reason: 'Cancelled Subscription', amount: 14.99,   filed: '04/22/2024', status: 'Submitted',        tone: 'info', step: 2, network: 'Visa',       merchant: 'Spotify USA' },
    { id: 'DP-30433', case: '5301-2024-30433', holder: 'Floyd Miles',         card: '2031', reason: 'Wrong Amount',           amount: 49.50,   filed: '04/22/2024', status: 'Case Won',         tone: 'success', step: 5, network: 'Mastercard', merchant: 'Lyft' },
  ];

  const disputeSteps = ['New', 'Pending Customer', 'Submitted', 'Representment', 'Prearbitration', 'Arbitration'];

  return {
    kpis, monthly, weekly, categories, recentDisputes,
    programs, subPrograms, customers, disputes, disputeSteps,
  };
})();

window.AppData = AppData;
