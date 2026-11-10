// #1785 US paycheck: 2026 federal income tax, Social Security, Medicare and state tax on wages, as yearly
// amounts spread over paychecks. Pure maths, no DOM, checked in tests/tools/us-paycheck.mjs.
// Federal: IRS Rev. Proc. 2025-32 (2026 brackets, standard deduction, child tax credit), checked 2026-11-10.
// Social Security and Medicare: SSA 2026 COLA fact sheet (wage base 184,500; 6.2%, 1.45%, extra 0.9% over 200,000).
// 401(k) and HSA limits: IRS IR-2025-111 and Rev. Proc. 2025-19.

export type Status = 'single' | 'mfj' | 'hoh' | 'mfs';
type Bracket = [number, number]; // [top of the bracket, rate]
const I = Infinity;

export const BRACKETS: Record<Status, Bracket[]> = {
  single: [[12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [I, 0.37]],
  mfj: [[24800, 0.10], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [I, 0.37]],
  hoh: [[17700, 0.10], [67450, 0.12], [105700, 0.22], [201750, 0.24], [256200, 0.32], [640600, 0.35], [I, 0.37]],
  mfs: [[12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [384350, 0.35], [I, 0.37]],
};
export const STD: Record<Status, number> = { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 };
export const CTC = 2200, CTC_PHASE: Record<Status, number> = { single: 200000, mfj: 400000, hoh: 200000, mfs: 200000 };
export const SS_RATE = 0.062, SS_BASE = 184500, MED_RATE = 0.0145, MED_EXTRA = 0.009, MED_EXTRA_FROM = 200000;
export const LIMITS = { k401: 24500, k401CatchUp50: 8000, k401CatchUp60: 11250, hsaSelf: 4400, hsaFamily: 8750, hsaCatchUp55: 1000 };
export const PERIODS: Record<string, [string, number]> = {
  weekly: ['Weekly', 52], biweekly: ['Every two weeks', 26], semimonthly: ['Twice a month', 24], monthly: ['Monthly', 12],
};

// State tax on wages. 'none': no tax on wages. 'flat': one rate on wages after the state's own allowance, confirmed on the
// state's revenue site (see the guide's sources). 'az': Arizona withholding is a percentage of wages you pick on form A-4.
// 'est': no exact rule here; the visitor types an effective rate (a starting value is shown, marked as an estimate).
export interface StateRule { name: string; kind: 'none' | 'flat' | 'az' | 'est'; rate?: number; allow?: number; allowMfj?: number; perChild?: number; std?: Partial<Record<Status, number>>; k401Taxed?: boolean; start?: number }
export const STATES: Record<string, StateRule> = {
  AK: { name: 'Alaska', kind: 'none' }, FL: { name: 'Florida', kind: 'none' }, NV: { name: 'Nevada', kind: 'none' },
  NH: { name: 'New Hampshire', kind: 'none' }, SD: { name: 'South Dakota', kind: 'none' }, TN: { name: 'Tennessee', kind: 'none' },
  TX: { name: 'Texas', kind: 'none' }, WA: { name: 'Washington', kind: 'none' }, WY: { name: 'Wyoming', kind: 'none' },
  AZ: { name: 'Arizona', kind: 'az', rate: 0.02 },
  IL: { name: 'Illinois', kind: 'flat', rate: 0.0495, allow: 2925, allowMfj: 5850, perChild: 2925 },
  KY: { name: 'Kentucky', kind: 'flat', rate: 0.035, allow: 3360, allowMfj: 3360 },
  MI: { name: 'Michigan', kind: 'flat', rate: 0.0425, allow: 5900, allowMfj: 11800, perChild: 5900 },
  NC: { name: 'North Carolina', kind: 'flat', rate: 0.0399, std: { single: 12750, mfj: 25500, hoh: 19125, mfs: 12750 } },
  PA: { name: 'Pennsylvania', kind: 'flat', rate: 0.0307, allow: 0, allowMfj: 0, k401Taxed: true },
  // Flat-rate states not confirmed on the state's own site: the starting value is the 2026 flat rate (Tax Foundation),
  // which is higher than the effective rate because it ignores the state's deductions. Marked as an estimate on the page.
  CO: { name: 'Colorado', kind: 'est', start: 4.4 }, GA: { name: 'Georgia', kind: 'est', start: 5.19 }, ID: { name: 'Idaho', kind: 'est', start: 5.3 },
  IN: { name: 'Indiana (plus county tax)', kind: 'est', start: 2.95 }, IA: { name: 'Iowa', kind: 'est', start: 3.8 }, LA: { name: 'Louisiana', kind: 'est', start: 3.0 },
  MS: { name: 'Mississippi', kind: 'est', start: 4.0 }, OH: { name: 'Ohio', kind: 'est', start: 2.75 }, UT: { name: 'Utah', kind: 'est', start: 4.5 },
};
for (const [k, n] of Object.entries({ AL: 'Alabama', AR: 'Arkansas', CA: 'California', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', HI: 'Hawaii', KS: 'Kansas', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MN: 'Minnesota', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', ND: 'North Dakota', OK: 'Oklahoma', OR: 'Oregon', RI: 'Rhode Island', SC: 'South Carolina', VT: 'Vermont', VA: 'Virginia', WV: 'West Virginia', WI: 'Wisconsin' })) STATES[k] = { name: n, kind: 'est', start: 4 };

export interface Input {
  gross: number;          // yearly pay before anything comes off
  status: Status;
  children: number;       // children under 17 for the child tax credit
  k401: number;           // yearly 401(k) employee contribution
  roth: boolean;          // Roth 401(k): taken after tax
  hsa: number;            // yearly HSA through payroll (pre-tax for income tax and FICA)
  pretax: number;         // other pre-tax deductions (health, dental, vision premiums under a cafeteria plan)
  state: string;
  stateRate: number;      // percent: effective rate for 'est' states, A-4 percentage for Arizona
}
export interface Result {
  gross: number; fedTaxable: number; fedBefore: number; credit: number; fed: number;
  ss: number; medicare: number; stateWages: number; state: number; deductions: number;
  takeHome: number; marginalFed: number;
}

const pos = (x: number) => (x > 0 ? x : 0);
const r2 = (x: number) => Math.round(x * 100) / 100;
export const bracketTax = (x: number, b: Bracket[]) => { let t = 0, lo = 0; for (const [hi, r] of b) { if (x > lo) t += (Math.min(x, hi) - lo) * r; lo = hi; } return t; };
export const marginal = (x: number, b: Bracket[]) => (b.find(([hi]) => x < hi) ?? b[b.length - 1])[1];

export function paycheck(inp: Input): Result {
  const gross = pos(inp.gross), k401 = Math.min(pos(inp.k401), gross), hsa = pos(inp.hsa), pre = pos(inp.pretax);
  const cafe = Math.min(hsa + pre, gross - k401);              // HSA and premiums come off before FICA too
  const trad = inp.roth ? 0 : k401;
  const agi = pos(gross - trad - cafe);
  const fedTaxable = pos(agi - STD[inp.status]);
  const fedBefore = bracketTax(fedTaxable, BRACKETS[inp.status]);
  // Child tax credit: 2,200 a child, less 50 for each 1,000 (or part) of income over the phase-out start.
  const kids = Math.max(0, Math.floor(inp.children));
  const credit = pos(kids * CTC - 50 * Math.ceil(pos(agi - CTC_PHASE[inp.status]) / 1000));
  const fed = pos(fedBefore - credit);
  const fica = pos(gross - cafe);
  const ss = SS_RATE * Math.min(fica, SS_BASE);
  // Employers withhold the extra 0.9% on wages over 200,000 whatever the filing status.
  const medicare = MED_RATE * fica + MED_EXTRA * pos(fica - MED_EXTRA_FROM);
  const st = STATES[inp.state] ?? STATES.TX;
  const stateWages = pos(gross - cafe - (st.k401Taxed ? 0 : trad));
  let state = 0;
  if (st.kind === 'flat') {
    const allow = st.std ? st.std[inp.status] ?? 0 : (inp.status === 'mfj' ? st.allowMfj ?? 0 : st.allow ?? 0) + (st.perChild ?? 0) * kids;
    state = (st.rate ?? 0) * pos(stateWages - allow);
  } else if (st.kind === 'az') state = (pos(inp.stateRate) / 100) * stateWages;
  else if (st.kind === 'est') state = (pos(inp.stateRate) / 100) * stateWages;
  const deductions = k401 + cafe;
  const takeHome = gross - deductions - fed - ss - medicare - state;
  return {
    gross, fedTaxable: r2(fedTaxable), fedBefore: r2(fedBefore), credit: r2(Math.min(credit, fedBefore)), fed: r2(fed),
    ss: r2(ss), medicare: r2(medicare), stateWages: r2(stateWages), state: r2(state), deductions: r2(deductions),
    takeHome: r2(takeHome), marginalFed: marginal(fedTaxable, BRACKETS[inp.status]),
  };
}

/** Most an employee can defer to a 401(k) in 2026 at this age. */
export const k401Limit = (age: number) => LIMITS.k401 + (age >= 60 && age <= 63 ? LIMITS.k401CatchUp60 : age >= 50 ? LIMITS.k401CatchUp50 : 0);
