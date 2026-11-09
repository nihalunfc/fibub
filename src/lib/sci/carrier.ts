// Bayesian carrier risk for autosomal recessive and X-linked recessive conditions, in exact fractions
// (Young ID, Introduction to Risk Calculation in Genetic Counselling, 3rd ed. 2007; Harper PS, Practical Genetic
// Counselling, 8th ed. 2020). Each column is a hypothesis; prior × conditionals = joint; joint ÷ total = posterior.

/** An exact fraction with BigInt parts, always in lowest terms with a positive denominator. */
export class Q {
  readonly n: bigint; readonly d: bigint;
  constructor(n: bigint | number, d: bigint | number = 1n) {
    let N = BigInt(n), D = BigInt(d);
    if (D === 0n) throw new Error('Division by zero');
    if (D < 0n) { N = -N; D = -D; }
    const g = gcd(N < 0n ? -N : N, D) || 1n;
    this.n = N / g; this.d = D / g;
  }
  add(o: Q) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o: Q) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o: Q) { return new Q(this.n * o.n, this.d * o.d); }
  div(o: Q) { return new Q(this.n * o.d, this.d * o.n); }
  pow(k: number) { let r = ONE; for (let i = 0; i < k; i++) r = r.mul(this); return r; }
  num() { return Number(this.n) / Number(this.d); }
  isZero() { return this.n === 0n; }
  eq(o: Q) { return this.n === o.n && this.d === o.d; }
  toString() { return this.d === 1n ? String(this.n) : `${this.n}/${this.d}`; }
}
function gcd(a: bigint, b: bigint): bigint { while (b) { [a, b] = [b, a % b]; } return a; }
export const ZERO = new Q(0), ONE = new Q(1), HALF = new Q(1, 2);
export const q = (n: number, d = 1) => new Q(n, d);

/** A probability typed as 1/25, 2/3, 0.9, 90 % or 1. Exact: 0.9 is 9/10. */
export function parseProb(raw: string, what = 'Probability'): Q {
  const s = raw.trim().replace(/[−–]/g, '-').replace(',', '.');
  let m = /^(\d+)\s*\/\s*(\d+)$/.exec(s), v: Q;
  if (m) { if (m[2] === '0') throw new Error(`${what}: the bottom of a fraction cannot be 0`); v = new Q(BigInt(m[1]), BigInt(m[2])); }
  else if ((m = /^(\d*\.?\d+)\s*%$/.exec(s))) v = dec(m[1]).div(q(100));
  else if ((m = /^(\d*\.?\d+)$/.exec(s))) v = dec(m[1]);
  else throw new Error(`${what}: "${raw.trim()}" is not a probability (write 1/25, 0.04 or 4 %)`);
  if (v.num() > 1) throw new Error(`${what}: ${raw.trim()} is more than 1 (100 %)`);
  return v;
}
function dec(s: string): Q { const [a, b = ''] = s.split('.'); return new Q(BigInt((a || '0') + b), 10n ** BigInt(b.length)); }

export type Step = { label: string; values: Q[] };
export type Table = { columns: string[]; rows: Step[]; joint: Q[]; total: Q; posterior: Q[] };
/** Multiply each column down its rows, then normalise. Throws if every joint is zero (the evidence is impossible). */
export function bayes(columns: string[], rows: Step[]): Table {
  const joint = columns.map((_, j) => rows.reduce((p, r) => p.mul(r.values[j]), ONE));
  const total = joint.reduce((a, b) => a.add(b), ZERO);
  if (total.isZero()) throw new Error('These facts cannot all be true together (every joint probability is 0). Check the prior and the evidence: for example an obligate carrier cannot have a negative test with a 100 % detection rate.');
  return { columns, rows, joint, total, posterior: joint.map((x) => x.div(total)) };
}

export type Evidence = { sons?: number; testNegative?: boolean; detection?: Q };
/** One person: carrier or not, with unaffected sons (X-linked only) and a negative carrier test. */
export function onePerson(prior: Q, ev: Evidence, xl: boolean): Table {
  const rows: Step[] = [{ label: 'Prior', values: [prior, ONE.sub(prior)] }];
  if (xl && ev.sons) rows.push({ label: `${ev.sons} unaffected son${ev.sons === 1 ? '' : 's'}`, values: [HALF.pow(ev.sons), ONE] });
  if (ev.testNegative) rows.push({ label: `Negative carrier test (detection rate ${pct(ev.detection!)})`, values: [ONE.sub(ev.detection!), ONE] });
  return bayes(['Carrier', 'Not a carrier'], rows);
}

/**
 * X-linked, two generations: a mother and her daughter (the consultand). Columns: mother and daughter both carriers,
 * mother carrier and daughter not, mother not a carrier (so neither; a new mutation in the daughter is ignored).
 */
export function motherDaughter(motherPrior: Q, mother: Evidence, daughter: Evidence): Table & { daughter: Q; mother: Q } {
  const rows: Step[] = [
    { label: "Mother's prior", values: [motherPrior, motherPrior, ONE.sub(motherPrior)] },
    { label: 'Daughter inherits the variant', values: [HALF, HALF, ONE] },
  ];
  if (mother.sons) rows.push({ label: `Mother: ${mother.sons} other unaffected son${mother.sons === 1 ? '' : 's'}`, values: [HALF.pow(mother.sons), HALF.pow(mother.sons), ONE] });
  if (mother.testNegative) rows.push({ label: `Mother: negative test (detection ${pct(mother.detection!)})`, values: [ONE.sub(mother.detection!), ONE.sub(mother.detection!), ONE] });
  if (daughter.sons) rows.push({ label: `Daughter: ${daughter.sons} unaffected son${daughter.sons === 1 ? '' : 's'}`, values: [HALF.pow(daughter.sons), ONE, ONE] });
  if (daughter.testNegative) rows.push({ label: `Daughter: negative test (detection ${pct(daughter.detection!)})`, values: [ONE.sub(daughter.detection!), ONE, ONE] });
  // "Daughter inherits": in columns 1 and 2 it is 1/2 for carrier and 1/2 for not; column 3 is certain.
  const t = bayes(['Mother and daughter carriers', 'Mother carrier, daughter not', 'Mother not a carrier'], rows);
  return { ...t, daughter: t.posterior[0], mother: t.posterior[0].add(t.posterior[1]) };
}

export const pct = (x: Q) => `${+(x.num() * 100).toPrecision(3)} %`;
/** "1 in N" for a probability, rounded. */
export const oneIn = (x: Q) => (x.isZero() ? 'none' : `1 in ${Math.round(1 / x.num()).toLocaleString('en')}`);

/** Risks for the consultand's children. */
export function offspringXL(p: Q) { return { sonAffected: p.mul(HALF), daughterCarrier: p.mul(HALF), childAffected: p.mul(q(1, 4)) }; }
export function offspringAR(p: Q, partner: Q) {
  return { childAffected: p.mul(partner).mul(q(1, 4)), childCarrier: p.mul(ONE.sub(partner)).mul(HALF).add(partner.mul(ONE.sub(p)).mul(HALF)).add(p.mul(partner).mul(HALF)) };
}

export type Position = { id: string; label: string; prior: string; why: string };
export const AR_POSITIONS: Position[] = [
  { id: 'sib', label: 'Unaffected brother or sister of an affected person', prior: '2/3', why: 'Both parents are carriers; of the unaffected children, 2 in 3 are carriers.' },
  { id: 'parent', label: 'Parent of an affected child', prior: '1', why: 'An obligate carrier.' },
  { id: 'child-affected', label: 'Child of an affected person', prior: '1', why: 'Inherits one variant from the affected parent.' },
  { id: 'child-carrier', label: 'Child of a known carrier (other parent not a carrier)', prior: '1/2', why: 'Half the carrier parent\'s alleles pass on.' },
  { id: 'aunt', label: 'Brother or sister of a parent of an affected person', prior: '1/2', why: 'The parent is an obligate carrier; one grandparent is too.' },
  { id: 'nephew', label: 'Child of an unaffected brother or sister of an affected person', prior: '1/3', why: '2/3 × 1/2.' },
  { id: 'cousin', label: 'First cousin of an affected person', prior: '1/4', why: 'Aunt or uncle 1/2 × 1/2.' },
  { id: 'custom', label: 'My own prior', prior: '1/10', why: 'Type any prior.' },
];
export const XL_POSITIONS: Position[] = [
  { id: 'daughter-carrier', label: 'Daughter of a known carrier (e.g. sister of an affected boy, mother a carrier)', prior: '1/2', why: 'Each daughter of a carrier has a 1 in 2 chance.' },
  { id: 'isolated-mother', label: 'Mother of an isolated (only) affected son', prior: '2/3', why: 'Haldane: with equal mutation rates in men and women and no reproduction by affected males, 2 in 3 such mothers are carriers.' },
  { id: 'granddaughter', label: 'Granddaughter of a known carrier through a daughter', prior: '1/4', why: '1/2 × 1/2.' },
  { id: 'obligate', label: 'Daughter of an affected man, or mother of an affected son with another affected relative', prior: '1', why: 'An obligate carrier.' },
  { id: 'custom', label: 'My own prior', prior: '1/10', why: 'Type any prior.' },
];
